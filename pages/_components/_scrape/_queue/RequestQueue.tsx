import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes } from 'react';

import {StylableComponent} from '../../types';
import styles from '../../../../styles/_components/_scrape/_queue/ScrapeRequestQueue.module.scss';
import { IPostDataScrapeRequest } from 'data-service/types';
import ScrapeRequest from 'data-service/entity/ScrapeRequest';
import { faSearch, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ScrapeAction } from '../ScrapeManagementComponent';


export interface TileChannelProps extends StylableComponent {
    queueData?: IPostDataScrapeRequest[];
    dispatcher?:React.Dispatch<ScrapeAction>;
    isRunning:boolean;
}
interface Removable{
    // index:number;
    removable:boolean;
    onRemove?:{(uuid:string):Promise<any>};
    dispatcher?:React.Dispatch<ScrapeAction>;
}


const Tile = (props:IPostDataScrapeRequest & StylableComponent & Removable) => {
    const removeAction= ()=>{
        console.log("removeAction Fire",props)
        if(props.dispatcher != undefined){
            props.dispatcher({
                type: "queue-request-remove",
                payload: props.uuid,
            });
        }
    };
    const displayLocation = (props.location == undefined||props.location == null)? "\"Anywhere\"":props.location;
    // const displayLocation = (props.location == undefined||props.location == null)? ()=>{return(
    //     <span title="this will be based on you're network geo-locaiton by the underlying Organizations">&quot;Anywhere&quot;</span>
    // );}:props.location;
    return (
        <div className={["box tile is-parent is-vertical", styles["rq-tile"], props.className].join(" ")}
            style={{position:"relative"}}>
            <div className={["is-child", styles["rq-tile-element-1"]].join(" ")}>{props.keyword}</div>
            <div className={["is-child", styles["rq-tile-element-2"]].join(" ")}>{displayLocation}</div>
            <div className={["is-child", styles["rq-tile-element-2"]].join(" ")}>{props.pageDepth} Pages</div>
            {(props.removable)? 
                <div style={{position:"absolute",top:"0px",right:"0px"}} onClick={removeAction}>
                    <FontAwesomeIcon icon={faClose}/>
                </div>
                :""}
        </div>
    );
};

/**
{"uuid":"21b68579-045c-46a7-b6ca-6d2c2c40963c",
"requestTime":"2022-07-30T19:29:19.215Z",
"complete":false,"metrics":[
    {"vendorDesc":"DICE","numTotal":200,"numComplete":136,"pageSize":20},
    {"vendorDesc":"INDEED","numTotal":150,"numComplete":136,"pageSize":15}
],"pageDepth":"10",
"keyword":"Full Stack Engineer",
"_id":"62e58837f6127556e444a88b"}
 */
const requestActiveStats = (setActiveState:React.Dispatch<any>)=>{
    return async ()=>{
        const resp = await fetch("/api/data/scrape/active");
        if(resp.status == 200){
            const data = await resp.json();
            setActiveState(data);
            console.log("requestActiveStats", data);
        }
    };
};
const StatusTile = (props:any) => {
    const [activeState, setActiveState] = useState<ScrapeRequest>();
    useEffect(()=>{
        requestActiveStats(setActiveState);
        const polling = setInterval(requestActiveStats(setActiveState), 90*1000);
        return ()=>{clearInterval(polling);};
    },[]);

    const statistics = (activeState == undefined)? []:activeState?.metrics;
    let [total, completed] = [0,0];
    for(const metric of statistics){
        total += metric.numTotal;
        completed += metric.numComplete;
    }
    const percent = Math.round((completed/total)*100);
    return (
        <div className={["box tile is-parent is-vertical", styles["rq-status-tile"], props.className].join(" ")}>
            {statistics.map((metric)=>{
                return(
                    <div key={metric.vendorDesc} className={["tile is-child"].join(" ")}>
                        {metric.numComplete} / {metric.numTotal}
                    </div>
                );
            })}
            <div className={["tile is-child"].join(" ")}>
                {percent} % Complete.
            </div>
        </div>
    );
};

const RequestQueue = (props:TileChannelProps) => {
    let {className, queueData, dispatcher, isRunning} = props;
    if(queueData == undefined) queueData = [];
    

    return (
        <div className={["tile is-ancestor", className, styles["tile-channel"] ].join(" ")} >
            <div className={["tile", styles["rq-tile-container"] ].join(" ")} >
                
                <div className={["tile is-parent is-flex-grow-0", styles["rq-tile-wrapper"]].join(" ")}>
                    <StatusTile className={styles["rq-tile-bk-status"]} />
                </div>
                
                {queueData.map((tile, index) => {
                    const isRemovable = (isRunning)? index != 0 : true;
                    return (
                        <div key={tile.uuid} className={["tile is-parent is-flex-grow-0", styles["rq-tile-wrapper"]].join(" ")}>
                            <Tile {...tile} removable={isRemovable} dispatcher={dispatcher}
                                className={styles[(isRemovable)?"rq-tile-bk-queued":"rq-tile-bk-active"]}/>
                        </div>
                    );
                })}
                
            </div>
        </div>
    );
};

export default RequestQueue;