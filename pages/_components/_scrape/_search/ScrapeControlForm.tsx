import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faInfoCircle, faSearch, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../styles/_components/_scrape/_search/ScrapeForm.module.scss';
import { IPostDataScrapeRequest } from 'data-service/types';
import { domValueGetter, inputFocusSelectAll } from '../../_utils/FormUtils';
import { StylableComponent } from '../../types';
import { ScrapeAction } from '../ScrapeManagementComponent';

interface ScrapeControlProps extends StylableComponent {
    isRunning: boolean;
    onAction: React.Dispatch<ScrapeAction>
}

const ScrapeControlForm = (props:ScrapeControlProps)=>{
    const requestKeywords = useRef<HTMLInputElement>(null);
    const requestLocation = useRef<HTMLInputElement>(null);
    const requestPageDepth = useRef<HTMLInputElement>(null);
    const defaultPageDepth = 3;
    const getFormValue = ():IPostDataScrapeRequest|undefined => {
        const keywords = domValueGetter(requestKeywords,'');
        if(keywords === '')return;

        return {
            keyword: domValueGetter(requestKeywords,''),
            pageDepth: domValueGetter(requestPageDepth, defaultPageDepth),
            location: domValueGetter(requestLocation, undefined),
        };
    };
    const queueRequest = ()=>{
        const request = getFormValue();
        if(request != undefined){
            props.onAction({
                type: "queue-request-add",
                payload: request,
            });
        }
    };
    const startQueue = ()=>{
        if(!props.isRunning){
            props.onAction({type: "toggle-run-queue"});
        }
    };
    return (
        <div className={['tile is-ancestor', props.className ].join(" ")}>

            <div className={['tile is-parent',].join(" ")} >
                <div className={['tile is-parent', styles["ssf-form-margin"]].join(" ")} >{/*margin*/}</div>

                <div className={['tile is-parent is-vertical is-3'].join(" ")}>
                    <div className={['is-child control has-icons-right' ].join(" ")} >
                        <input ref={requestKeywords} placeholder='Job Post Keywords' 
                            className={["input"].join(" ")} type="text" onFocus={inputFocusSelectAll} />
                        <span className={["icon is-small is-right"].join(" ")}>
                            <FontAwesomeIcon icon={faSearch}/>
                        </span>
                    </div>
                    <div className={['is-child control has-icons-right'].join(" ")} title='Location (Optional)'>
                        <input ref={requestLocation} placeholder='Job Location' 
                            className={["input"].join(" ")} type="text" onFocus={inputFocusSelectAll} />
                        <span className={["icon is-small is-right"].join(" ")}>
                            <FontAwesomeIcon icon={faMapLocationDot}/>
                        </span>
                    </div>
                </div>

                <div className={['tile is-parent is-vertical is-1',styles['no-flex-grow']].join(" ")} >
                    <div className={['is-child control'].join(" ")} >
                        <button onClick={queueRequest} className={['button is-info is-fullwidth'].join(" ")}>
                            Queue
                        </button>
                    </div>
                    <div className={['is-child control'].join(" ")} >
                        <input ref={requestPageDepth} placeholder='Page Depth' defaultValue={defaultPageDepth} 
                            className={["input", styles["ssf-btn-width"] ].join(" ")} type="number" 
                            style={{padding:"0 0 0 10px" }}/>
                    </div>
                </div>

                <div className={['tile is-parent is-1',].join(" ")} >{/*margin*/}</div>

                <div className={['tile is-parent is-vertical is-1'].join(" ")} >
                    <div className={['is-child control'].join(" ")} style={{height:"100%"}}>
                        <button onClick={startQueue} className={['button is-primary is-fullwidth'].join(" ")} style={{height:"100%",wordWrap:"break-word"}}>
                            Start Queue
                        </button>
                    </div>
                </div>

                <div className={['tile is-parent', styles["ssf-form-margin"]].join(" ")} >{/*margin*/}</div>
            </div>

        </div>
    );
};
export default ScrapeControlForm;