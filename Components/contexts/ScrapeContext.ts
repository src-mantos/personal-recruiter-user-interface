import { atom, selector, AtomEffect } from 'recoil';
import { IScrapeRequest } from 'data-service/types';
import { ActiveScrapeRequest, AsyncState, MakeRequest, ScrapeQueue, UserScrapeRequest } from '../types';


const baseUrl = process.env.NEXT_PUBLIC_HOST_URL; //'http://localhost:8080';


const requestLog:{( key:string ):AtomEffect<any>} = ( key:string ) => ({ onSet }) => {
    onSet( ( newVal ) => {
        if ( newVal.sendRequest )
            console.info( "Request: "+key, newVal );
    });
};
const recoilLog:{( key:string ):AtomEffect<any>} = ( key:string ) => ({ onSet }) => {
    onSet( ( newVal ) => {
        console.info( "SET "+key, newVal );
    });
};

/**
 * Store & Send User Scrape Request
 */
export const scrapeRequestState = atom<UserScrapeRequest>({
    key    : 'ScrapeRequestAtom',
    default: { pageDepth: 3, sendRequest: false },
    effects: [
        requestLog( 'scrapeRequestState' ),
        ({ onSet, setSelf, trigger }) => {
            onSet( ( userReq ) => {
                const { sendRequest, keyword, location, pageDepth } = userReq;
                if ( sendRequest && keyword !== undefined && keyword != "" ){
                    let loc = new URL( baseUrl+'/dataservice/scrape/' );
                    loc.searchParams.append( "keyword", keyword );
                    if ( location )
                        loc.searchParams.append( "location", location );
                    if ( pageDepth )
                        loc.searchParams.append( "pageDepth", ""+pageDepth );

                    fetch( loc.toString() ).then( ( resp: Response ) => {
                        const updateObj = { ...userReq };
                        if ( resp.status == 200 ) {
                            updateObj.asyncState = AsyncState.Complete;
                            resp.json().then( ( val ) => {
                                console.log( "Respose scrapeRequestState:", val );
                            });
                        } else {
                            updateObj.asyncState = AsyncState.Error;
                            console.warn( resp );
                        }
                        setSelf({ ...updateObj, sendRequest: false });
                    });

                    setSelf({ ...userReq, sendRequest: false, asyncState: AsyncState.Requested });
                } else {
                    setSelf({ ...userReq, asyncState: AsyncState.Pending });
                }
            });
        }
    ],
});

/**
 * Retrieve Scrape Queue Status
 */
export const queueState = atom<ScrapeQueue>({
    key    : 'queueState',
    default: { sendRequest: false, queue: [], asyncState: AsyncState.Pending },
    effects: [
        requestLog( 'ScrapeQueue' ),
        ({ setSelf, onSet }) => {
            onSet( ( queueObj ) => {
                if ( queueObj.sendRequest ){
                    let loc = baseUrl+'/dataservice/scrape/status';
                    fetch( loc ).then( ( resp: Response ) => {
                        if ( resp.status == 200 ){
                            resp.json().then( ( remoteQueue:ActiveScrapeRequest[] ) => {
                                if ( remoteQueue.length > 0 )
                                    setSelf({ ...queueObj, sendRequest: false, asyncState: AsyncState.Complete, queue: remoteQueue });
                            });
                        } else {
                            setSelf({ ...queueObj, sendRequest: false, asyncState: AsyncState.Error });
                            console.warn( resp );
                        }

                    });
                    setSelf({ ...queueObj, sendRequest: false, asyncState: AsyncState.Requested });
                } else {
                    setSelf({ ...queueObj, asyncState: AsyncState.Pending });
                }
            });
        }
    ]
});

export const runQueueState = atom<MakeRequest&{isRunning:boolean}>({
    key    : "runQueueState",
    default: { sendRequest: false, isRunning: false, asyncState: AsyncState.Pending },
    effects: [
        requestLog( 'ScrapeQueue' ),
        ({ setSelf, onSet, resetSelf }) => {
            onSet( ( runObj ) => {
                if ( runObj.sendRequest ){
                    let loc = baseUrl+'/dataservice/scrape/run';
                    fetch( loc, { method: 'PATCH' }).then( ( resp: Response ) => {
                        if ( resp.status == 200 )
                            setSelf({ isRunning: true, sendRequest: false, asyncState: AsyncState.Complete });
                        else
                            setSelf({ isRunning: false, sendRequest: false, asyncState: AsyncState.Error });
                    });
                    setSelf({ isRunning: true, sendRequest: false, asyncState: AsyncState.Requested });
                } else {
                    setSelf({ ...runObj, asyncState: AsyncState.Pending });
                }
            });
        }
    ]
});

export const removeScrapeRequest = atom<Partial<UserScrapeRequest>>({
    key    : "removeScrapeRequest",
    default: { sendRequest: false, asyncState: AsyncState.Pending },
    effects: [
        requestLog( 'removeScrapeRequest' ),
        ({ setSelf, onSet, resetSelf }) => {
            onSet( ( remove ) => {
                if ( remove.sendRequest && remove.uuid !== undefined ){
                    const loc = new URL( baseUrl+'/dataservice/scrape/'+encodeURIComponent( remove.uuid ) );
                    fetch( loc.toString(), { method: 'DELETE' }).then( ( resp: Response ) => {
                        if ( resp.status == 200 )
                            setSelf({ sendRequest: false, asyncState: AsyncState.Complete });
                        else
                            setSelf({ sendRequest: false, asyncState: AsyncState.Error });
                    });
                    setSelf({ sendRequest: false, asyncState: AsyncState.Requested });
                }
            });
        }
    ]
});

