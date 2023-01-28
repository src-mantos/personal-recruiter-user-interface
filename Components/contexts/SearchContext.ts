import { atom, selector, selectorFamily, useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import {  IPostData, IPostMetaData, IPostDataIndex, ISearchQuery, ISearchFilter } from 'data-service/types';
import { UserSearchFilter } from '../types';

const ErrorHandler = async (resp: Response): Promise<any> => {
    console.error(resp);
};

export enum SearchAtomKeys {
    SearchRequest = 'SearchRequest',
    SearchResult = 'SearchResult',
    SearchFilters = 'SearchFilters',
    DataSet = 'DataSet',
} 

export interface SearchQuery extends Partial<ISearchQuery> {
    sendRequest: boolean;
    dataset?: IPostData[];
};


export const searchRequestState = atom<SearchQuery>({
    key: SearchAtomKeys.SearchRequest,
    default: { sendRequest:false },
    effects: [
        ({ onSet, setSelf, getPromise }) => {
            onSet((newReq) => {
                const makeRequest = async () =>{
                    const payload:ISearchQuery = {
                        keywords: (newReq.keywords===undefined)?"":newReq.keywords,
                        filters:newReq.filters
                    };
                    const resp: Response = await fetch('/dataservice/data/search/', {
                        method:"POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body:JSON.stringify(payload)
                    });
                    const tmp = await resp.json() as unknown as IPostData[];
                    setSelf({ ...newReq, dataset:tmp, sendRequest:false  });
                    console.log("updated");
                };
                if(newReq.sendRequest){
                    setSelf({ ...newReq, sendRequest:false });
                    makeRequest();
                    console.log("requested");
                }
            });
        },
    ],
});



/**
 * separate filter consolidation state
 */
export const searchFilterState = atom<UserSearchFilter[]>({
    key: SearchAtomKeys.SearchFilters,
    default: [],
});

/**
 * searchFilterSelector - generates the 2D display matrix of active filters.
 * Major Filter Groups x Individual Filters.
 * default AND Majors & default OR Individuals
 * This entire implementation should be scrubbed in favor of an optimized store.
 */
export const searchFilterSelector = selector({
    key: 'get' + SearchAtomKeys.SearchFilters,
    get:
        ({ get }) => {
            const list: UserSearchFilter[] = get(searchFilterState);
            if(list == undefined){
                return [];
            }
            const mapping: Record<string,UserSearchFilter[]> = {};
            
            list.forEach((filter) => {
                console.log('step',mapping, filter);
                if (mapping[filter.dataKey] == undefined) {
                    mapping[filter.dataKey] = [];
                }
                mapping[filter.dataKey].push(filter);
            });

            const sub: UserSearchFilter[][] = [];
            const keySet = Object.keys(mapping);
            for(let fKey of keySet){
                sub.push(mapping[fKey]);
            }
            
            return sub;
        },
});

const padWidth = 28;
export const styleFilterSelector = selector({
    key: 'style' + SearchAtomKeys.SearchFilters,
    get:
        ({ get }) => {
            const sortedFilters: UserSearchFilter[][] = get(searchFilterSelector);
            const columnWidths:number[] = [];
            for(let i=0; i<sortedFilters.length; i++){
                const row = sortedFilters[i];
                for(let j=0; j<row.length; j++){
                    const width = (padWidth + row[j].label.length + row[j].value.length)*3;
                    if(isNaN(columnWidths[i])){
                        columnWidths[i] = width;
                    }else{
                        columnWidths[i] = Math.max(columnWidths[i],width);
                    }
                }
            }
            return columnWidths;
        },
});

// export const searchFilterSelectorRemove = selectorFamily({
//     key: 'remove' + SearchAtomKeys.SearchFilters,
//     get:
//         (param) =>
//         ({ get }) => {
//             return;
//         },

//     set:
//         (removeFilter:FilterStateRecord) =>
//         ({ set, get }, newValue) => {
//             const filterList = get(searchFilterState);
//             const updateList = [];
//             filterList.forEach((filter)=>{
//                 const k = filter.key == removeFilter.
//             })
//             set(searchFilterState, );
//         },
// });