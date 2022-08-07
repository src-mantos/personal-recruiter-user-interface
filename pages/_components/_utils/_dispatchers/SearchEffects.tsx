import React, {useEffect, useState} from 'react';
import { IPostData, IPostDataScrapeRequest, IPostDataSearchRequest } from 'data-service/types';
import useDispatcherContext, { Action } from '../DispatcherContext';
import { urlBuilder } from '../FormUtils';
import { SearchAction, SearchActionType } from './SearchDispatcher';

const SearchEffects = () => {
    const {searchState,fireSearchAction:dispatcher} = useDispatcherContext();
    const {userRequest,postResultSet,filterCriteria,activePost,fetch} = searchState;

    useEffect(()=>{
        if(fetch && userRequest != undefined){
            ActionKeySearch(dispatcher,userRequest)();
        }
    },[fetch,userRequest])
    return(
        <span></span>
    );
};
export default SearchEffects;

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


export const ActionKeySearch = (dispatcher: React.Dispatch<SearchAction>, userRequest: IPostDataSearchRequest) => {
    dispatcher({ type: SearchActionType.ClearFetchFlag });
    return fetchURL("/api/data/search?keywords="+userRequest.keywords, {
        ...defaultMajorResponseHandler,
        200: async (resp: Response) => {
            const data: IPostData[] = await resp.json();
            dispatcher({ type: SearchActionType.SetSearchResult, payload:data });
        },
    });
};