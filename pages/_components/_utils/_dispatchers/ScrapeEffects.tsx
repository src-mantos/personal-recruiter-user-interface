import React, {useCallback, useEffect, useState} from 'react';
import { IPostDataScrapeRequest } from 'data-service/types';
import useDispatcherContext, { Action } from '../DispatcherContext';
import { urlBuilder } from '../FormUtils';
import { ScrapeAction, ScrapeActionType } from './ScrapeDispatcher';



const ScrapeEffects = ()=>{
    const {scrapeState,fireScrapeAction:dispatcher} = useDispatcherContext();
    const {userRequest,queueData,isQueueRunning,removeUUID, getScrapeQueue,getIsRunning,startScrapeQueue} = scrapeState;
    
    useEffect(()=>{
        if(userRequest != undefined && userRequest.uuid == undefined){
            ActionAddScrape(dispatcher,userRequest)();
        }
    },[userRequest,dispatcher]);
    useEffect(()=>{
        if(getScrapeQueue){
            GetScrapeQueue(dispatcher)();
        }
    },[getScrapeQueue,dispatcher]);
    useEffect(()=>{
        if(getIsRunning){
            GetIsRunning(dispatcher)();
        }
    },[getIsRunning,dispatcher]);
    useEffect(()=>{
        if(removeUUID != undefined){
            ActionRemoveScrape(dispatcher,removeUUID)();
        }
    },[removeUUID,dispatcher]);
    useEffect(()=>{
        if(startScrapeQueue){
            ActionRunQueue(dispatcher)();
            GetIsRunning(dispatcher)();
        }
    },[startScrapeQueue,dispatcher]);

    const polling = useCallback( ()=>{
        dispatcher({type:ScrapeActionType.GetIsAndScrape});
    }, [dispatcher]);

    useEffect(()=>{
        setTimeout(polling,100);
        // polling();
        const interval = 5*60*1000;
        const handle = setInterval(polling, interval);
        return ()=>{
            clearInterval(handle);
        };
    },[polling]);//Initial component load

    return (
        <span></span>
    );
};
export default ScrapeEffects;

/** Effects */
const fetchURL = (url: string, responseHandlers: Record<number, { (resp: Response): Promise<any> }>, fetchOpts?:any) => {
    return async () => {
        let resp: Response;
        if(fetchOpts != undefined) resp = await fetch(url,fetchOpts);
        else resp = await fetch(url);

        if (responseHandlers[resp.status] != undefined) responseHandlers[resp.status](resp);
    };
};

const ErrorHandler = async (resp: Response): Promise<any> =>{ console.error(resp); };

const defaultMajorResponseHandler:Record<number, { (resp: Response): Promise<any> }> = 
    (():Record<number, { (resp: Response): Promise<any> }> => {
        const statusCodes: number[] = [];
        for (let n = 1; n <= 5; n++) {
            for (let i = 0; i < 50; i++) {
                statusCodes.push(n * 100 + i);
            }
        }
        const ret:Record<number, { (resp: Response): Promise<any> }> ={};
        statusCodes.forEach((value:number)=>{
            ret[value] = async (resp: Response) => {
                console.warn('defaultHandler', resp);
            };
        });
        ret[400]=ErrorHandler;
        ret[500]=ErrorHandler;
        return ret;
    })();


export const GetIsRunning = (dispatcher: React.Dispatch<ScrapeAction>) => {
    dispatcher({ type: ScrapeActionType.GetIsRunning });
    return fetchURL('/api/data/scrape/isRunning', {
        ...defaultMajorResponseHandler,
        200: async (resp: Response) => {
            const data: boolean = await resp.json();
            dispatcher({
                type: ScrapeActionType.SetIsRunning,
                payload: data,
            });
        },
    });
};

export const GetScrapeQueue = (dispatcher: React.Dispatch<ScrapeAction>) => {
    dispatcher({ type: ScrapeActionType.GetScrapeQueue });
    return fetchURL('/api/data/scrape/status', {
        ...defaultMajorResponseHandler,
        200: async (resp: Response) => {
            const data: IPostDataScrapeRequest[] = await resp.json();
            dispatcher({
                type: ScrapeActionType.SetScrapeQueue,
                payload: data,
            });
        },
    });
};

export const ActionAddScrape = (dispatcher: React.Dispatch<ScrapeAction>, userRequest: IPostDataScrapeRequest) => {
    const builder = urlBuilder('/api/data/scrape');
    builder.addGetParam('keyword', userRequest.keyword);
    builder.addGetParam('pageDepth', '' + userRequest.pageDepth);
    if (userRequest.location) builder.addGetParam('location', userRequest.location);
    return fetchURL(builder.getURL(), {
        ...defaultMajorResponseHandler,
        200: async (resp: Response) => {
            const data: IPostDataScrapeRequest = await resp.json();
            dispatcher({
                type: ScrapeActionType.ActionAddScrape,
                payload: data,
            });
            dispatcher({ type: ScrapeActionType.GetScrapeQueue });
        },
    });
};
export const ActionRemoveScrape = (dispatcher: React.Dispatch<ScrapeAction>, uuid: string) => {
    const stdResp = async (_resp: Response) => { dispatcher({ type: ScrapeActionType.GetScrapeQueue }); };
    return fetchURL(
        '/api/data/scrape/' + uuid,
        {
            ...defaultMajorResponseHandler,
            200: stdResp,
            300: stdResp,
            400: stdResp,
        },
        { method: 'DELETE' }
    );
};

export const ActionRunQueue = (dispatcher: React.Dispatch<ScrapeAction>) => {
    dispatcher({ type:ScrapeActionType.ActionRunQueue, payload:false });
    const stdResp = async (_resp: Response) => {
        dispatcher({ type: ScrapeActionType.GetIsAndScrape });
    };
    return fetchURL(
        '/api/data/scrape/run',
        {
            ...defaultMajorResponseHandler,
            200: stdResp,
            300: stdResp,
            400: stdResp,
        },
        { method: 'PATCH' }
    );
};


