import { atom, selector, selectorFamily, useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import {  IPostData, IPostMetaData, IPostDataIndex, ISearchQuery, ISearchFilter } from 'data-service/types';
import { AsyncState, EditorPostData } from '../types';

const ErrorHandler = async ( resp: Response ): Promise<any> => {
    console.error( resp );
};

export enum EditorAtomKeys {
    PostData = 'PostData'
}
export interface ActivePostData {
    remoteState: Partial<IPostData>;
    activeState: Partial<IPostData>;
}

export const postDataState = atom<ActivePostData>({
    key    : EditorAtomKeys.PostData,
    default: {
        remoteState: {},
        activeState: {}
    },
    effects: [
        ({ onSet, setSelf, getLoadable }) => {
            onSet( ( postDataState ) => {
                console.log( "set Editor data", postDataState );
            });
        },
    ],
});

export const remotePostDataState = atom<EditorPostData>({
    key    : "remotePostDataState",
    default: {
        sendRequest: false,
        fetchRecord: false,
        updateList : false,
        record     : {},
        index      : -1
    },
    effects: [
        ({ onSet, setSelf }) => {
            let stage = false; //chaining remote execution?
            onSet( ( postDataState ) => {
                const postUpdate = async () => {
                    setSelf({
                        ...postDataState,
                        sendRequest: false,
                        asyncState : AsyncState.Pending
                    });
                    const resp: Response = await fetch( '/dataservice/post/update/', {
                        method : "POST",
                        headers: {
                            'Accept'      : 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify( postDataState.record )
                    });
                    if ( resp.status == 200 ){
                        const updateObj = await resp.json() as unknown as IPostData;
                        console.log( "updating Post state" );
                        setSelf({
                            ...postDataState,
                            record     : postDataState.record,
                            sendRequest: false,
                            updateList : true,
                            asyncState : AsyncState.Complete
                        });
                    } else {
                        console.log( "no data returned" );
                        setSelf({
                            ...postDataState,
                            sendRequest: false,
                            updateList : true,
                            asyncState : AsyncState.Error
                        });
                    }
                };
                if ( postDataState.sendRequest )
                    postUpdate();

                if ( postDataState.fetchRecord ){
                    setSelf({
                        ...postDataState,
                        fetchRecord: false,
                        asyncState : AsyncState.Pending
                    });
                    fetch( '/dataservice/post/'+postDataState.record._id )
                        .then( ( resp: Response ) => {
                            if ( resp.status == 200 )
                                return resp.json() as unknown as IPostData;
                            else
                                return null;
                        })
                        .then( ( data ) => {
                            let self:EditorPostData =  {
                                ...postDataState,
                                fetchRecord:false,
                                asyncState: AsyncState.Complete
                            };
                            if ( data != null )
                                setSelf({ ...self, record: data });//self.record = data;
                            else
                                setSelf({ ...self, asyncState: AsyncState.Error });
                            console.log( "Fetch Resp:", { self, data });
                            // setSelf({ ...self });
                        }).catch( () => {
                            setSelf({
                                ...postDataState,
                                fetchRecord: false,
                                asyncState : AsyncState.Error
                            });
                        });
                }
            });
        },
    ],
});