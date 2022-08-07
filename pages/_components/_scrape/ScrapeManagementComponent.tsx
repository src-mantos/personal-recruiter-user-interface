import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, useMemo, useCallback, useReducer } from 'react';

import { IPostDataScrapeRequest } from 'data-service/types';
import { urlBuilder } from '../_utils/FormUtils';
import { faCropSimple } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StylableComponent } from '../types';
import ScrapeControlForm from './_form/ScrapeControlForm';
import RequestQueue from './_queue/RequestQueue';
import useDispatcherContext from '../_utils/DispatcherContext';

import {ScrapeAction, ScrapeActionType} from '../_utils/_dispatchers/ScrapeDispatcher';
import ScrapeEffects from '../_utils/_dispatchers/ScrapeEffects';


export interface ScrapeManagementProps extends StylableComponent {

}

const ScrapeManagementComponent = (props:ScrapeManagementProps)=>{
    const {scrapeState,fireScrapeAction:dispatcher} = useDispatcherContext();
    // const {userRequest,queueData,fetchQueue,runQueue,isQueueRunning,removeUUID} = scrapeState;
    
    
    
   
    return (
        <div className={['tile is-ancestor is-vertical', props.className].join(" ")}>
            <ScrapeEffects></ScrapeEffects>
            <div className={['tile is-parent'].join(" ")}>
                <ScrapeControlForm></ScrapeControlForm>
            </div>
            <div className={['tile is-parent'].join(" ")} style={{textAlign:'center'}}>
                <div className={['tile is-child'].join(" ")}></div>
                <div className={['tile is-child is-1'].join(" ")}><FontAwesomeIcon icon={faCropSimple} /></div>
                <div className={['tile is-child'].join(" ")}></div>
            </div>
            <div className={['tile is-parent'].join(" ")}>
                <RequestQueue></RequestQueue>
            </div>
        </div>
    );
};

export default ScrapeManagementComponent;