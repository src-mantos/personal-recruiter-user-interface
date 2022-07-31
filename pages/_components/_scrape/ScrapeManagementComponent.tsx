/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable indent */
import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, useMemo, useCallback, useReducer } from 'react';

import ScrapeSearchFormHandle from './_search/ScrapeSearchFormHandle';
import { IPostDataScrapeRequest } from 'data-service/types';
import { useAsync, urlBuilder, useAsyncWaterfall } from '../_utils/UseAsyncHook';
import { faCropSimple } from '@fortawesome/free-solid-svg-icons';
import { StylableComponent } from '../types';
import ScrapeControlForm from './_search/ScrapeControlForm';
import RequestQueue from './_queue/RequestQueue';


export interface ScrapeManagementProps extends StylableComponent {

}

export interface ScrapeAction{
    type:"toggle-fetch-queue"|"toggle-run-queue"|"queue-request-add"|"queue-request-remove"|"queue-data"|"running-state";
    payload?:any;
}
const scrapeReducer = (state:ScrapeState, action:ScrapeAction):ScrapeState=>{
    switch (action.type) {
        case "queue-request-add":
            if(action.payload != undefined){
                return{
                    ...state,
                    userRequest: action.payload
                };
            }
            break;
        case "toggle-fetch-queue":
            return{
                ...state,
                fetchQueue: !state.fetchQueue
            };
        case "queue-data":
            if(action.payload != undefined){
                return{
                    ...state,
                    queueData: action.payload
                };
            }
            break;
        case "running-state":
            if(action.payload != undefined){
                return{
                    ...state,
                    isQueueRunning: action.payload
                };
            }
            break;
        case "toggle-run-queue":
            return{
                ...state,
                runQueue: !state.runQueue
            };
        case "queue-request-remove":
            return{ //the standard state is undefined
                ...state,
                removeUUID: action.payload
            };
            
        default:
            break;
    }
    
    return state;
};

interface ScrapeState {
    userRequest?: IPostDataScrapeRequest;
    queueData?: IPostDataScrapeRequest[];
    fetchQueue: boolean;
    runQueue: boolean;
    isQueueRunning?:boolean;
    removeUUID?: string;
}
const getInitialState = ():ScrapeState=>{
    return {
        fetchQueue:false,
        runQueue:false
    };
};

const requestQueueRunningStatus = (dispatcher:React.Dispatch<ScrapeAction>)=>{
    return async ()=>{
        const resp = await fetch("/api/data/scrape/isRunning");
        if(resp.status == 200){
            const data = await resp.json();
            dispatcher({
                type: "running-state",
                payload: data,
            });
        }
    };
};
const requestQueueStatus = (dispatcher:React.Dispatch<ScrapeAction>)=>{
    return async ()=>{
        const resp = await fetch("/api/data/scrape/status");
        if(resp.status == 200){
            const data = await resp.json();
            dispatcher({
                type: "queue-data",
                payload: data,
            });
        }
    };
};
const sendAddRequest = (dispatcher:React.Dispatch<ScrapeAction>, userRequest?:IPostDataScrapeRequest)=>{
    return async ()=>{
        if(userRequest != undefined && userRequest.uuid == undefined){
            const builder = urlBuilder("/api/data/scrape");
            builder.addGetParam("keyword", userRequest.keyword);
            builder.addGetParam("pageDepth", ""+userRequest.pageDepth);
            if(userRequest.location) builder.addGetParam("location", userRequest.location);

            const resp = await fetch(builder.getURL());
            if(resp.status == 200){
                const data:IPostDataScrapeRequest = await resp.json();
                dispatcher({
                    type:"queue-request-add",
                    payload: data,
                });
            }
        }
    };
};
const sendRemoveRequest = (dispatcher:React.Dispatch<ScrapeAction>, uuid:string)=>{
    return async ()=>{
        const resp = await fetch("/api/data/scrape/"+uuid, {method:"DELETE"});
        if(resp.status == 200){
            const data = await resp.json();
            dispatcher({
                type: "queue-request-remove",
                payload: undefined,
            });
        }
    };
};

const startQueue = async ()=>{
    const resp = await fetch("/api/data/scrape/run",{method:"PATCH"});
    if(resp.status == 200){
        const data = await resp.json();
        console.log("Request Success", data);
    }
};

const ScrapeManagementComponent = (props:ScrapeManagementProps)=>{
    const [{userRequest,queueData,fetchQueue,runQueue,isQueueRunning,removeUUID}, dispatcher] = useReducer(scrapeReducer,getInitialState(),getInitialState);
    const fetchScrapeQueue = requestQueueStatus(dispatcher);
    
    useEffect(()=>{
        if(userRequest != undefined){
            sendAddRequest(dispatcher,userRequest)();
            dispatcher({type:'toggle-fetch-queue'});
        }
    },[userRequest]);
    useEffect(()=>{
        if(fetchQueue){
            fetchScrapeQueue();
            dispatcher({type:'toggle-fetch-queue'});
        }
    },[fetchQueue]);
    useEffect(()=>{
        if(removeUUID != undefined){
            sendRemoveRequest(dispatcher,removeUUID)();
            dispatcher({
                type: "queue-request-remove",
                payload: undefined,
            });
            dispatcher({type:'toggle-fetch-queue'});
        }
    },[removeUUID]);
    useEffect(()=>{
        if(runQueue){
            startQueue();
            dispatcher({type:'toggle-run-queue'});
            dispatcher({type:'toggle-fetch-queue'});
        }
    },[runQueue]);

    useEffect(()=>{
        fetchScrapeQueue();
        requestQueueRunningStatus(dispatcher)();
        const polling = setInterval(fetchScrapeQueue, 240*1000);
        return ()=>{clearInterval(polling);}
    },[]);//Initial component load

    const isRunning = (isQueueRunning == undefined)? false: isQueueRunning;
    return (
        <div className={['tile is-ancestor is-vertical', props.className].join(" ")}>
            <div className={['tile is-parent'].join(" ")}>
                <ScrapeControlForm onAction={dispatcher} isRunning={isRunning}></ScrapeControlForm>
            </div>
            <div className={['tile is-parent'].join(" ")}>
                handle
            </div>
            <div className={['tile is-parent'].join(" ")}>
                <RequestQueue queueData={queueData} isRunning={isRunning} dispatcher={dispatcher}></RequestQueue>
            </div>
        </div>
    );
};

export default ScrapeManagementComponent;