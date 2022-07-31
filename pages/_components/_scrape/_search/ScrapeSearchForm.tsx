import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faInfoCircle, faSearch, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../styles/_components/_scrape/_search/ScrapeForm.module.scss';
import { IPostDataScrapeRequest } from 'data-service/types';
import { domValueGetter, inputFocusSelectAll } from '../../_utils/FormUtils';
import { XyzTransition } from '@animxyz/react';
import { StylableComponent } from '../../types';
import { useToolTipContext } from '../../_utils/ToolTipContext';


export interface ScrapeSearchFormProps extends StylableComponent {
    defaultPageDepth?: number;
    onRequestScrape?: {(form:IPostDataScrapeRequest|undefined):void};
    collapsed:boolean;
}

const ScrapeSearchForm = (props:ScrapeSearchFormProps)=>{
    const requestKeywords = useRef<HTMLInputElement>(null);
    const requestLocation = useRef<HTMLInputElement>(null);
    const requestPageDepth = useRef<HTMLInputElement>(null);
    const defaultPageDepth = (props.defaultPageDepth)? props.defaultPageDepth : 3;

    const getFormValue = ():IPostDataScrapeRequest|undefined => {
        const keywords = domValueGetter(requestKeywords,'');
        if(keywords === '')return;

        return {
            keyword: domValueGetter(requestKeywords,''),
            pageDepth: domValueGetter(requestPageDepth, defaultPageDepth),
            location: domValueGetter(requestLocation, undefined),
        };
    };

    const [_request,setRequest] = useState<IPostDataScrapeRequest|undefined>();

    const requestScrape = () => {
        const req = getFormValue();
        if(req == undefined){
            setRequest(req);
        }else{
            setRequest({...req});
        }
        console.log("scrapeRequest",req);
        if(props.onRequestScrape){
            props.onRequestScrape(req);
        }
    };

    const {
        setMessage: setToolTipMessage,
        setLocData: setToolTipLocation,
    } = useToolTipContext();
    const setToolTipKeywords = (event:React.MouseEvent<HTMLElement>) => {
        setToolTipMessage({
            desc: "Think more about the title you might be looking for, you will be refining your criteria later. <br/> ie. \"Full Stack Engineer\", "
        });
        // setToolTipLocation({
        //     location: {pageX:event.pageX+200, pageY: event.pageY},
        //     hidden: false
        // });
    };
    const setToolTipLocMsg = (event:React.MouseEvent<HTMLElement>) => {
        setToolTipMessage({
            desc: "100% Optional City, end services will use approximate location of the connection"
        });
        // setToolTipLocation({
        //     location: {pageX:event.pageX, pageY: event.pageY},
        //     hidden: false
        // });
    };


    return (
        <XyzTransition duration="auto">
            <div className={['tile is-ancestor', styles["ssf-form-wrapper"], (!props.collapsed)?"xyz-in":"xyz-out "+styles["ssf-form-wrapper-height"],styles["ssf-slide-close"] ].join(" ")}>

                <div className={['tile is-parent','xyz-nested', styles["ssf-anim-wrapper"], styles["ssf-slide-widgets"]].join(" ")} >
                    <div className={['tile is-parent', styles["ssf-form-margin"]].join(" ")} >{/*margin*/}</div>

                    <div className={['tile is-parent is-vertical'].join(" ")}>
                        <div className={['is-child control has-icons-right' ].join(" ")} >
                            <input ref={requestKeywords} placeholder='Job Post Keywords' 
                                className={["input"].join(" ")} type="text" onFocus={inputFocusSelectAll} onMouseOver={setToolTipKeywords} />
                            <span className={["icon is-small is-right"].join(" ")}>
                                <FontAwesomeIcon icon={faSearch}/>
                            </span>
                        </div>
                        <div className={['is-child control has-icons-right'].join(" ")} title='Location (Optional)'>
                            <input ref={requestLocation} placeholder='Job Location' 
                                className={["input"].join(" ")} type="text" onFocus={inputFocusSelectAll} onMouseOver={setToolTipLocMsg}/>
                            <span className={["icon is-small is-right"].join(" ")}>
                                <FontAwesomeIcon icon={faMapLocationDot}/>
                            </span>
                        </div>
                    </div>

                    <div className={['tile is-parent is-vertical',styles['no-flex-grow']].join(" ")} >
                        <div className={['is-child control'].join(" ")} >
                            <input ref={requestPageDepth} placeholder='Page Depth' defaultValue={defaultPageDepth} 
                                className={["input", styles["ssf-btn-width"] ].join(" ")} type="number" 
                                style={{padding:"0 0 0 10px" }}/>
                        </div>
                        <div className={['is-child control'].join(" ")} >
                            <button onClick={requestScrape} className={['button is-primary', styles["ssf-btn-width"], styles["sf-button"]].join(" ")}>
                                Queue Data Request
                            </button>
                        </div>
                    </div>

                    <div className={['tile is-parent', styles["ssf-form-margin"]].join(" ")} >{/*margin*/}</div>
                </div>

            </div>
        </XyzTransition>
    );

};

export default ScrapeSearchForm;