import { atom, AtomEffect, selector } from 'recoil';
import { IPostData, ISearchQuery } from 'data-service/types';
import { UserSearchFilter, SearchQuery, AsyncState, FilterMap, PostDataProps } from '../types';


const requestLog:{( key:string ):AtomEffect<any>} = ( key:string ) => ({ onSet }) => {
    onSet( ( newVal ) => {
        if ( newVal.sendRequest )
            console.info( "Request: "+key, newVal );
    });
};

const resetAsyncStatus:AtomEffect<any> = ({ onSet, setSelf }) => {
    onSet( ( hasRequest ) => {
        if ( hasRequest.asyncState && hasRequest.asyncState == AsyncState.Complete )
            setTimeout( () => {
                setSelf({ ...hasRequest, asyncState: AsyncState.Pending });
                console.log( "resetting search state", AsyncState.Pending );
            }, 500 );
    });
};

export const searchRequestState = atom< SearchQuery<IPostData> >({
    key    : "searchRequestState",
    default: { sendRequest: false, asyncState: AsyncState.Pending },
    effects: [
        requestLog( "searchRequestState" ),
        ({ onSet, setSelf }) => {
            onSet( ( queryState ) => {

                const makeRequest = async () => {
                    const { keywords, filters, sort } = queryState;
                    const payload:ISearchQuery = {
                        keywords: ( keywords===undefined )?"":keywords,
                        filters,
                        sort
                    };
                    setSelf({ ...queryState, sendRequest: false, asyncState: AsyncState.Requested });

                    const resp: Response = await fetch( '/dataservice/data/search/', {
                        method : "POST",
                        headers: {
                            'Accept'      : 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify( payload )
                    });
                    if ( resp.status == 200 ){
                        const tmp = await resp.json() as unknown as IPostData[];
                        setSelf({ ...queryState, sendRequest: false, dataset: tmp, asyncState: AsyncState.Complete });
                    } else {
                        setSelf({ ...queryState, sendRequest: false, asyncState: AsyncState.Error });
                    }
                };
                if ( queryState.sendRequest )
                    makeRequest();
            });
        },
        resetAsyncStatus
    ],
});

/**
 * searchFilterSelector - generates the 2D display matrix of active filters.
 * Major Filter Groups x Individual Filters.
 * default AND Majors & default OR Individuals
 * This entire implementation should be scrubbed in favor of an optimized store.
 */
export const searchFilterSelector = selector({
    key: "searchFilterSelector",
    get:
        ({ get }) => {
            const searchObj:SearchQuery<IPostData> = get( searchRequestState );
            const { filters } = searchObj;
            const matrix = new Map<string, UserSearchFilter[]>();
            if ( filters !== undefined && filters.length > 0 ){
                for ( let filter of filters ){
                    let orRow = matrix.get( filter.dataKey );
                    if ( orRow === undefined )
                        orRow = [];

                    const dispFilter:UserSearchFilter = { ...FilterMap.get( filter.dataKey ), ...filter };
                    orRow.push( dispFilter );
                    matrix.set( filter.dataKey, orRow );
                }

                const displayFilterMatrix: UserSearchFilter[][] = [];
                for ( let key of [...matrix.keys()].sort() ){
                    const row = matrix.get( key );
                    if ( row !== undefined )
                        displayFilterMatrix.push( row );
                }
                return displayFilterMatrix;
            }
            return [];
        },
});



export const convertToUI = ( data:IPostData[] | undefined ):PostDataProps[] => {
    if ( data === undefined )
        return [];
    else
        return data.map( ( elem, index ) => {
            return {
                record  : elem,
                selected: false,
                index
            };
        });
};

export const postDisplayListState = atom<PostDataProps[]>({
    key    : "postDisplayListState",
    default: [],
});