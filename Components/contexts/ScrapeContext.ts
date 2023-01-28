import { atom, selector, selectorFamily, AtomEffect } from 'recoil';
import {  IScrapeRequest, IScrapePostDataRequest } from 'data-service/types';
import { ActiveScrapeRequest, MakeRequest, UserScrapeRequest } from '../types';


const baseUrl = process.env.NEXT_PUBLIC_HOST_URL; //'http://localhost:8080';



const recoilLog:{(key:string):AtomEffect<any>} = (key:string) => {
    return ({ onSet }) => {
        onSet((newVal) => {
            console.info("SET "+key, newVal);
        });
    };
};
export const scrapeRequestState = atom<UserScrapeRequest>({
    key: 'ScrapeRequestAtom',
    default: { pageDepth:3, sendRequest:false },
    effects: [
        recoilLog('ScrapeRequestAtom'),
        ({ onSet, setSelf }) => {
            onSet((newReq) => {
                if(newReq.sendRequest && newReq.keyword !== undefined && newReq.keyword != ""){
                    let loc = baseUrl+'/dataservice/scrape/?keyword=' + newReq.keyword ;
                    if(newReq.location){ loc+="&location="+newReq.location;}
                    if(newReq.pageDepth){ loc+="&pageDepth="+newReq.pageDepth;}
                    
                    setSelf({ ...newReq, sendRequest:false });
                    fetch(loc).then((resp: Response)=>{
                        if (resp.status == 200) {
                            resp.json().then(console.log);
                        } else {
                            console.log(resp);
                        }
                    });
                }
            });
        }
    ],
});

const scrapeQueueRefreshInterval = 1000*60;//*2.5;
export const scrapeQueueState = atom<ActiveScrapeRequest[]>({
    key: 'ScrapeQueue',
    default: [{
        uuid: '12359842374928',
        keyword: "query for scrape",
        location: "washington",
        pageDepth: 2,
        metrics:[{
            vendorDesc: "dummy1",
            numTotal: 10,
            numComplete: 3,
            pageSize: 10
        },{
            vendorDesc: "dummy2",
            numTotal: 20,
            numComplete: 12,
            pageSize: 10
        },{
            vendorDesc: "dummy3",
            numTotal: 40,
            numComplete: 12,
            pageSize: 10
        },{
            vendorDesc: "dummy4",
            numTotal: 70,
            numComplete: 60,
            pageSize: 10
        }]
    },{
        uuid: '35987342374928',
        keyword: "query for scrape (queued)",
        location: "washington",
        pageDepth: 2
    }],
    effects:[
        recoilLog('ScrapeQueue'),
        ({ setSelf, onSet }) => {
            const getStatus = ()=>{
                let loc = baseUrl+'/dataservice/scrape/status';//scrape/status
                fetch(loc).then((resp: Response)=>{
                    if (resp.status == 200) {
                        resp.json().then((remoteQueue:ActiveScrapeRequest[])=>{
                            if(remoteQueue.length > 0)
                                setSelf(remoteQueue);
                        });
                    }else{
                        console.log(resp);
                    }
                });
            };
            const periodicUpdate = setInterval(getStatus,scrapeQueueRefreshInterval);
            getStatus();
            onSet(getStatus);
            return ()=>{clearInterval(periodicUpdate);};
        }
    ]
});

export const scrapeItemRemove = selector< Partial<IScrapeRequest> >({
    key: 'RemoveScrapeItem',
    get: ({ get }) => {
        return {};
    },
    set: ({ set,get }, newValue) =>{
        const cast = newValue as Partial<IScrapeRequest>;
        const list: ActiveScrapeRequest[] = get(scrapeQueueState);
        const updateList: ActiveScrapeRequest[] = [];
        for(let i=0; i<list.length; i++){
            if( list[i].uuid &&  list[i].uuid === cast.uuid ){
                //do not add it to the new react list
                let loc = baseUrl+'/dataservice/scrape/'+list[i].uuid;
                fetch(loc,{ method:'DELETE' }).then((resp: Response)=>{
                    //the "end set" should trigger the status refresh
                });
            }else{
                updateList.push(list[i]);
            }
        }
        set(scrapeQueueState, updateList);
    }

});

const runQueueState = atom<MakeRequest>({
    key: "runQueueState",
    default:{
        sendRequest:false
    }
});
export const runScrapeQueueSelector = selector<MakeRequest>({
    key: 'StartScrapeQueue',
    get: ({ get }) => {
        return get(runQueueState);
    },
    set: ({ set,get,reset }, newValue) =>{
        set(runQueueState, newValue);
        let loc = baseUrl+'/dataservice/scrape/run';
        fetch(loc, { method:'PATCH' }).then((resp: Response)=>{ });
        reset(runQueueState);
    }
});
// const socket = io({ path:"/dataservice/scrape/status/"}); //"ws://localhost:3000",

// socket.on("message",(args:any[])=>{
//     console.log("WS OnMsg:", args );
// });
// socket.onAny((event, ...args) => {
//     console.log(`Recieved ${event}`, args);
// });
