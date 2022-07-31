import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, useMemo, useCallback, useReducer } from 'react';
import ScrapeSearchForm, { ScrapeSearchFormProps } from './_search/ScrapeSearchForm';
import ScrapeSearchFormHandle from './_search/ScrapeSearchFormHandle';
import { IPostDataScrapeRequest } from 'data-service/types';
import { useAsync, urlBuilder, useAsyncWaterfall } from '../_utils/UseAsyncHook';
import { faCropSimple } from '@fortawesome/free-solid-svg-icons';
import RequestQueue from './_queue/RequestQueue';


export interface ScrapeSearchFormComponentProps {
    className?: string;
    formProps?: ScrapeSearchFormProps;
    
}

interface UIScrapeRequest extends IPostDataScrapeRequest{
    fetched: boolean;
}


const ScrapeFormComponent = (props:ScrapeSearchFormComponentProps)=>{
    const [collapsed, setCollapsed] = useState(false);
    const toggleAction = () =>{
        setCollapsed(!collapsed);
    };

    const [queue, setQueue] = useState<any[]>([]);
    const [userRequest, setUserRequest] = useState<IPostDataScrapeRequest>();
    const [fetched, setFetched] = useState(false);
    

    // const {run:getScrapeQueue} = useAsync(async ()=>{
    //     const builder = urlBuilder("/api/data/scrape/status");
    //     const resp = await fetch(builder.getURL());
    //     try{
    //         const data = await resp.json();
    //         console.log("updateScrapeQueue", data);
    //         setQueue(data);
    //         return data;
    //     }catch(ex){
    //         console.warn(ex);
    //     }
    // });
    
    const getScrapeQueue = useCallback(()=>{
        (async ()=>{
            const builder = urlBuilder("/api/data/scrape/status");
            const resp = await fetch(builder.getURL());
            try{
                const data = await resp.json();
                console.log("updateScrapeQueue", data);
                setQueue(data);
                return data;
            }catch(ex){
                console.warn(ex);
            }
        })()
        
    },[setQueue]);

    
    
    useEffect(()=>{
        if(userRequest != undefined){
            const builder = urlBuilder("/api/data/scrape");
            builder.addGetParam("keyword", userRequest.keyword);
            builder.addGetParam("pageDepth", ""+userRequest.pageDepth);
            if(userRequest.location) builder.addGetParam("location", userRequest.location);

            (async ()=>{
                const resp = await fetch(builder.getURL());
                if(resp.status == 200){
                    const data = await resp.json();
                    console.log("requestScrape", data);
                    setFetched(true);
                }
            })();
        }
    },[userRequest,setFetched]);

    useEffect(()=>{
        if(fetched){
            getScrapeQueue();
            setFetched(false);
        }
    },[fetched,setFetched,getScrapeQueue]);

    
    
    return (
        <div className={['tile is-ancestor is-vertical', props.className].join(" ")}>
            <div className={['tile is-parent', props.className].join(" ")}>
                <ScrapeSearchForm {...props.formProps} collapsed={collapsed} onRequestScrape={setUserRequest} />
            </div>
            <div className={['tile is-parent', props.className].join(" ")}>
                <ScrapeSearchFormHandle collapsed={collapsed} onToggleAction={toggleAction} />
            </div>
            <div className={['tile is-parent', props.className].join(" ")}>
                <RequestQueue queueData={queue}></RequestQueue>
            </div>
        </div>
    );
};

export default ScrapeFormComponent;
