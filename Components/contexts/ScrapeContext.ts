import { atom, selector, selectorFamily, AtomEffect } from 'recoil';
import {  IScrapeRequest, IScrapePostDataRequest } from 'data-service/types';
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
                // console.log("check period", Date.now(),queueObj)
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
// const scrapeQueueRefreshInterval = 1000*60;//*2.5;
// export const scrapeQueueState = atom<ActiveScrapeRequest[]>({
//     key    : 'ScrapeQueue',
//     default: [{
//         uuid     : '12359842374928',
//         keyword  : "query for scrape",
//         location : "washington",
//         pageDepth: 2,
//         metrics  : [{
//             vendorDesc : "dummy1",
//             numTotal   : 10,
//             numComplete: 3,
//             pageSize   : 10
//         }, {
//             vendorDesc : "dummy2",
//             numTotal   : 20,
//             numComplete: 12,
//             pageSize   : 10
//         }, {
//             vendorDesc : "dummy3",
//             numTotal   : 40,
//             numComplete: 12,
//             pageSize   : 10
//         }, {
//             vendorDesc : "dummy4",
//             numTotal   : 70,
//             numComplete: 60,
//             pageSize   : 10
//         }]
//     }, {
//         uuid     : '35987342374928',
//         keyword  : "query for scrape (queued)",
//         location : "washington",
//         pageDepth: 2
//     }, {
//         uuid     : '855464567865893',
//         keyword  : "Full Stack Engineer",
//         location : "washington",
//         pageDepth: 2
//     }, {
//         uuid     : '52726574595365765',
//         keyword  : "Principal Engineer",
//         location : "washington",
//         pageDepth: 2
//     }],
//     effects: [
//         recoilLog( 'ScrapeQueue' ),
//         ({ setSelf, onSet }) => {
//             // const getStatus = ()=>{
//             //     let loc = baseUrl+'/dataservice/scrape/status';//scrape/status
//             //     fetch(loc).then((resp: Response)=>{
//             //         if (resp.status == 200) {
//             //             resp.json().then((remoteQueue:ActiveScrapeRequest[])=>{
//             //                 if(remoteQueue.length > 0)
//             //                     setSelf(remoteQueue);
//             //             });
//             //         }else{
//             //             console.log(resp);
//             //         }
//             //     });
//             // };
//             // const periodicUpdate = setInterval(getStatus,scrapeQueueRefreshInterval);
//             // getStatus();
//             // onSet(getStatus);
//             // return ()=>{clearInterval(periodicUpdate);};
//             onSet( ( newState ) => {
//                 let loc = baseUrl+'/dataservice/scrape/status';
//                 fetch( loc ).then( ( resp: Response ) => {
//                     if ( resp.status == 200 )
//                         resp.json().then( ( remoteQueue:ActiveScrapeRequest[] ) => {
//                             if ( remoteQueue.length > 0 )
//                                 setSelf( remoteQueue );
//                         });
//                     else
//                         console.log( resp );

//                 });
//             });
//         }
//     ]
// });


/**
 * Remove Scrape Request from Queue
 */
export const scrapeItemRemove = selector< UserScrapeRequest >({
    key: 'RemoveScrapeItem',
    get: ({ get }) => {
        return { sendRequest: true };
    },
    set: ({ set, get }, newValue ) => {
        const cast = newValue as Partial<IScrapeRequest>;
        const list: ActiveScrapeRequest[] = [];//get( scrapeQueueState );
        const updateList: ActiveScrapeRequest[] = [];
        for ( let i=0; i<list.length; i++ )
            if ( list[i].uuid && list[i].uuid === cast.uuid ){
                //do not add it to the new react list
                let loc = baseUrl+'/dataservice/scrape/'+list[i].uuid;
                fetch( loc, { method: 'DELETE' }).then( ( resp: Response ) => {
                    //the "end set" should trigger the status refresh
                });
            } else {
                updateList.push( list[i] );
            }

        // set( scrapeQueueState, updateList );
    }

});



// export const runScrapeQueueSelector = selector<MakeRequest>({
//     key: 'StartScrapeQueue',
//     get: ({ get }) => get( runQueueState ),
//     set: ({ set, get, reset }, newValue ) => {
//         // set( runQueueState, newValue );
//         let loc = baseUrl+'/dataservice/scrape/run';
//         fetch( loc, { method: 'PATCH' }).then( ( resp: Response ) => { });
//         reset( runQueueState );
//     }
// });
