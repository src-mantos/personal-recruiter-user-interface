import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faInfoCircle, faChevronCircleUp, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../styles/scrape/ScrapeForm.module.scss';

interface AnyMap { [key: string]: any }
export interface ScrapeFormProps extends AnyMap {
    className?: string;
    
}

const ScrapeSearchForm = (props:ScrapeFormProps)=>{
    const requestKeywords = useRef<HTMLInputElement>(null);
    const requestLocation = useRef<HTMLInputElement>(null);
    const requestPageDepth = useRef<HTMLInputElement>(null);
    return (
        <div className={['tile is-ancestor', styles["form-wrapper"] ].join(" ")}>
            <div className={['tile is-parent', styles["form-spacer"]].join(" ")} >{/*margin*/}</div>

            <div className={['tile is-parent is-vertical'].join(" ")} >
                <div className={['is-child control has-icons-right' ].join(" ")} >
                    <input ref={requestKeywords} placeholder='Job Post Keywords' className={["input"].join(" ")} type="text" />
                    <span className={["icon is-small is-right"].join(" ")}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </span>
                </div>
                <div className={['is-child control has-icons-right'].join(" ")} >
                    <input ref={requestLocation} placeholder='Job Location' className={["input"].join(" ")} type="text" />
                    <span className={["icon is-small is-right"].join(" ")}>
                        <FontAwesomeIcon icon={faInfoCircle}/>
                        
                    </span>
                    
                </div>
            </div>
            <div className={['tile is-parent is-vertical',styles['no-flex-grow']].join(" ")} >
                <div className={['is-child control'].join(" ")} >
                    <input ref={requestPageDepth} placeholder='Page Depth' defaultValue={3} className={["input", styles["btn-width"] ].join(" ")} type="number" style={{padding:"0 0 0 10px" }}/>
                </div>
                <div className={['is-child control'].join(" ")} >
                    <button className={['button', styles["btn-width"]].join(" ")}>Queue Scrape</button>
                </div>
            </div>

            <div className={['tile is-parent', styles["form-spacer"]].join(" ")} ></div>
        </div>
    );
};

export default ScrapeSearchForm;