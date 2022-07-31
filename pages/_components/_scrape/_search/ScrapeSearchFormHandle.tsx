import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../styles/_components/_scrape/_search/ScrapeForm.module.scss';


export interface ScrapeSearchFormHandleProps {
    className?: string;
    collapsed:boolean;
    onToggleAction?: {():void};
}

const ScrapeSearchFormHandle = (props:ScrapeSearchFormHandleProps)=>{
    if(props.onToggleAction == undefined){
        console.error("You are using a handler component with out any action");
    }

    const handler = ()=>{
        if(props.onToggleAction){
            props.onToggleAction();
        }
    };
    const expandedStyle = (!props.collapsed)? styles["ssfh-expand-border"] : "";
    return (
        <div className={['tile is-ancestor', props.className, styles["ssf-form-wrapper"], styles["ssfh-border"], expandedStyle].join(" ")}>
            <div className={['tile is-parent'].join(" ")} style={{padding:"0px"}}>
                <div className={['tile is-child'].join(" ")}></div>
                <div className={['tile is-child is-1'].join(" ")} onClick={handler} style={{textAlign:"center"}}>
                
                    <FontAwesomeIcon icon={props.collapsed? faChevronUp: faChevronDown}/>
                
                </div>
                <div className={['tile is-child'].join(" ")}></div>
            </div>
        </div>
    );
};

export default ScrapeSearchFormHandle;