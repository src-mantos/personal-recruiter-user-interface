/** @Deprecated
 * Bad references only
 */
import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes } from 'react';
import { IPostDataScrapeRequest } from 'data-service/types';
import { css, keyframes } from '@stitches/react';
import { theme } from '../../stitches.config';
import styles from '../../styles/ScrapeQueue.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faInfoCircle, faChevronCircleUp, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import ToolTip, {IToolTip, IToolTipOperations} from './ToolTip';

const tmp:IPostDataScrapeRequest = {
    keyword : "full stack engineer",
    location : "Washington DC",
    pageDepth : 2,
    uuid:"65df4gs6df45df4g6d5f4g32"
};
enum QueueTileState {
    ACTIVE = "qt-active",
    COMPLETE = "qt-done",
    INACTIVE = "qt-pending",
}
const getClassName = (input:QueueTileState)=>{
    return styles[input];
};




  

const QueueTile = (props:any)=>{
    return (
        <div className={['tile is-parent is-vertical','level-item level-left'].join(" ")}>
            <div className={['box', styles['qt'], getClassName(props.className)].join(" ")}>
                <div className={['is-child', styles['qt-text-primary'] ].join(" ")}>
                    {props.keyword}
                </div>
                <div className={['is-child', styles['qt-text-secondary'] ].join(" ")}>
                    {props.location}
                </div>
                <div className={['is-child', styles['qt-text-secondary'] ].join(" ")}>
                    {props.uuid}
                </div>
            </div>
        </div>
    );
};

enum ActiveState {
    FULL,
    PARTIAL,
    MINI,
}
const anim = keyframes({
    '0%': { transform: 'scale(1)' },
    '100%': { transform: 'scale(1.5)' },
});
const slideUp = css({
    maxHeight: "0px",
    // transform: "max-height",
    // transformOrigin: "top",
    transition: "max-height .5s ease",   
});
const SlideUpObj = slideUp();

const slideDown = css({
    maxHeight: "200px",
    // transform: "max-height",
    // transformOrigin: "top",
    transition: "max-height .5s ease",   
});
const SlideDownObj = slideDown();

const ScrapeQueue = (props:any)=>{
    const [activeState, setActiveState] = useState(ActiveState.FULL);

    let open = true;
    const searchContainer = useRef<HTMLDivElement>(null);
    const toggleSearchContainer = ()=>{
        if(open){
            searchContainer.current?.classList.add(SlideUpObj.className);
            searchContainer.current?.classList.remove(SlideDownObj.className);
        }else{
            searchContainer.current?.classList.remove(SlideUpObj.className);
            searchContainer.current?.classList.add(SlideDownObj.className);
        }
        open = !open;
        
    };

    const [vizQueue, setVizQueue] = useState<IPostDataScrapeRequest[]>([]);
    const requestKeywords = useRef<HTMLInputElement>(null);
    const requestLocation = useRef<HTMLInputElement>(null);
    const requestPageDepth = useRef<HTMLInputElement>(null);
    const queueRequest = (event:any)=>{
        const hasValue = (elem:any):boolean=>{
            if(elem == undefined || elem ==null || elem == ""){
                return false;
            }
            return true;
        };
        if( !hasValue(requestKeywords.current?.value) || !hasValue(requestPageDepth.current?.value) ){
            console.log("No Val");
            return;
        }
        
        const request:IPostDataScrapeRequest = {
            keyword: new String(requestKeywords.current?.value).toString(),
            pageDepth: new Number(requestPageDepth.current?.valueAsNumber).valueOf(),
            uuid: "ABC-"+Math.random()*1000,
        };
        if(requestLocation.current?.value != undefined){request.location = requestLocation.current?.value;}
        console.log(request);
        setVizQueue([...vizQueue,request]);
    };

    // const keyTool = useRef<IToolTipOperations>(null);
    
    interface ToolTipState{
        keywords:boolean;
        location:boolean
    }
    const [toolTipState, setToolTipState] = useState<ToolTipState>({
        keywords:true,
        location:true,
    });

    const keyTipMouseOver=()=>{
        console.log("keyTipMouseOver");
        toolTipState.keywords = !toolTipState.keywords;
        setToolTipState({
            keywords:toolTipState.keywords,
            location:toolTipState.location,
        });
    };
    const locTipMouseOver=()=>{
        console.log("keyTipMouseOver")
        toolTipState.location = !toolTipState.location;
        setToolTipState({
            keywords:toolTipState.keywords,
            location:toolTipState.location,
        });
    };

    return (
        <div className={['tile is-ancestor is-vertical', styles["sq-channel"] ].join(" ")} >
            
            <div ref={searchContainer} className={['container', styles["sq-search-container"] ].join(" ")}>
                
                <div className={['tile is-ancestor container' ].join(" ")} style={{ padding:"0.75rem 0.75rem 0 0.75rem" }}>
                    <div className={['tile is-parent is-vertical'].join(" ")} >
                        <div className={['is-child control has-icons-right' ].join(" ")} >
                            <input ref={requestKeywords} placeholder='Job Post Keywords' className={["input"].join(" ")} type="text"style={{ width:"400px" }} onFocus={keyTipMouseOver} onBlur={keyTipMouseOver}/>
                            <span className={["icon is-small is-right"].join(" ")}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                <ToolTip hidden={toolTipState.keywords} desc="Primary Scrape Keywords - any job title or skill you would search for at your preferred job posting site." />
                            </span>
                        </div>
                        <div className={['is-child control has-icons-right'].join(" ")} >
                            <input ref={requestLocation} placeholder='Job Location' className={["input"].join(" ")} type="text" onMouseOver={locTipMouseOver} onMouseOut={locTipMouseOver}/>
                            <span className={["icon is-small is-right"].join(" ")}>
                                <FontAwesomeIcon icon={faInfoCircle}/>
                                
                            </span>
                            
                        </div>
                    </div>
                    <div className={['tile is-parent is-vertical'].join(" ")} >
                        <div className={['is-child control'].join(" ")} >
                            <input ref={requestPageDepth} placeholder='Page Depth' className={["input"].join(" ")} type="number" style={{ width:"140px",padding:"0 0 0 10px" }}/>
                        </div>
                        <div className={['is-child control'].join(" ")} >
                            <button onClick={queueRequest} className={['button'].join(" ")}>Queue Scrape</button>
                        </div>
                    </div>
                </div>

            </div>


            <div className={['container is-fluid', styles["sq-search-separator"] ].join(" ")} onClick={toggleSearchContainer}>
                <ToolTip hidden={false} desc="Primary Location Filter - provided by your preferred job posting site." />
                <FontAwesomeIcon icon={faChevronCircleUp} className={[styles["sq-search-separator-icon"]].join(" ")}/>
                <FontAwesomeIcon icon={faChevronCircleDown} className={[styles["sq-search-separator-icon"]].join(" ")}/>
                
            </div>

            <div className={['tile is-child', styles["sq-queue-container"] ].join(" ")} >
                <div className={['level', styles["sq-queue-panel"] ].join(" ")} >
                    <div className={['level-left'].join(" ")} >
                        <div className={['level-item is-ancestor'].join(" ")} >
                            <QueueTile {...tmp} className={QueueTileState.COMPLETE} />
                        </div>
                    </div>
                    <div className={['level-left'].join(" ")} >
                        <div className={['level-item is-ancestor'].join(" ")} >
                            <QueueTile {...tmp} className={QueueTileState.ACTIVE} />
                        </div>
                    </div>
                    {vizQueue.map((req) => {
                        return (
                            <div key={req.uuid} className={['level-left'].join(" ")} >
                                <div className={['level-item is-ancestor'].join(" ")} >
                                    <QueueTile {...req} className={QueueTileState.INACTIVE}/>
                                </div>
                            </div> 
                        );
                    })}
                    
                </div>
            
                
            </div>
        </div>
    );
};

export default ScrapeQueue;