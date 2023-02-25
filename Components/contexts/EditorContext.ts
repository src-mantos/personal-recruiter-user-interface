import { atom } from 'recoil';
import { IPostData } from 'data-service/types';
import { AsyncState, EditorPostData } from '../types';

const ErrorHandler = async ( resp: Response ): Promise<any> => {
    console.error( resp );
};

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
                        setSelf({
                            ...postDataState,
                            record     : updateObj,
                            sendRequest: false,
                            updateList : true,
                            asyncState : AsyncState.Complete
                        });
                    } else {
                        setSelf({
                            ...postDataState,
                            sendRequest: false,
                            updateList : false,
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
                                fetchRecord: false,
                                asyncState : AsyncState.Complete
                            };
                            if ( data != null )
                                setSelf({ ...self, record: data });
                            else
                                setSelf({ ...self, asyncState: AsyncState.Error });
                            console.log( "Fetch Resp:", { self, data });
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