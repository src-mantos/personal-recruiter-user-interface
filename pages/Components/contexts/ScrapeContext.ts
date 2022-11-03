import { atom, selector, selectorFamily, AtomEffect } from 'recoil';
import {  IScrapeRequest, IScrapePostDataRequest } from 'data-service/types';
import { io, Socket } from "socket.io-client";


export interface UserScrapeRequest{
    keyword?: string;
    location?: string;
    pageDepth?: number;
    sendRequest: boolean;
}
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
                if(newReq.sendRequest){
                    let loc = '/dataservice/scrape/?keyword=' + newReq.keyword ;
                    if(newReq.location){ loc+="&location="+newReq.location;}
                    if(newReq.pageDepth){ loc+="&pageDepth="+newReq.pageDepth;}
                    console.log("FETCH: ",loc);
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

const makeScrapeRequest = selectorFamily({
    key: 'UserName',
    get: (userID) => async ({ get }) => {
        const request = get(scrapeRequestState);
        
    },
});
export const makeQueueStatusRequest = selector({
    key: 'makeQueueStatusRequest',
    get: async ({ get }): Promise<any> => {
        const request = get(scrapeRequestState);
        console.log('MakeScrapeRequest',request);
            
        if (request.sendRequest) {
            let loc = '/dataservice/status';
            
            const resp: Response = await fetch(loc);
            if (resp.status == 200) {
                const data = await resp.json();
                return data;
            } else {
                return [false]; 
            }
        }
    },
});

// const socket = io({ path:"/dataservice/scrape/status/"}); //"ws://localhost:3000",

// socket.on("message",(args:any[])=>{
//     console.log("WS OnMsg:", args );
// });
// socket.onAny((event, ...args) => {
//     console.log(`Recieved ${event}`, args);
// });
