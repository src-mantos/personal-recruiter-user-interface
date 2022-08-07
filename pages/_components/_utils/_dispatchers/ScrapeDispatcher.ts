/* eslint-disable indent */

import { IPostDataScrapeRequest } from 'data-service/types';
import { Action } from '../DispatcherContext';
import { urlBuilder } from '../FormUtils';

/*
 > add scrape request
 > remove scrape request
 > get queue status
 > get queue running state
 > start queue
*/
export enum ScrapeActionType {
    ActionAddScrape = 'ActionAddScrape',
    ActionRemoveScrape = 'ActionRemoveScrape',
    ActionRunQueue = 'ActionRunQueue',
    GetScrapeQueue = 'GetScrapeQueue',
    SetScrapeQueue = 'SetScrapeQueue',
    GetIsRunning = 'GetIsRunning',
    SetIsRunning = 'SetIsRunning',
    GetIsAndScrape = 'GetIsAndScrape',
}

export interface ScrapeAction extends Action<ScrapeActionType> {}

export interface ScrapeState {
    userRequest?: IPostDataScrapeRequest;
    queueData?: IPostDataScrapeRequest[];
    isQueueRunning?: boolean;
    removeUUID?: string;

    getScrapeQueue: boolean;
    getIsRunning: boolean;
    startScrapeQueue: boolean;
}
/**
 * "Request Toggling States" to debounce requests
 * @returns default states (fetchQueue|runQueue) otherwise undefined
 */
export const getInitialScrapeState = (): ScrapeState => {
    return {
        getScrapeQueue: false,
        getIsRunning: false,
        startScrapeQueue: false,
    };
};


const ScrapeReducer = (state: ScrapeState, action: ScrapeAction): ScrapeState => {
    console.log('ScrapeReducer', state, action);
    switch (action.type) {
        case ScrapeActionType.ActionAddScrape:
            return {
                ...state,
                userRequest: action.payload,
            };
        case ScrapeActionType.ActionRemoveScrape:
            return {
                ...state,
                removeUUID: action.payload,
            };
        case ScrapeActionType.ActionRunQueue:
            return {
                ...state,
                startScrapeQueue: !state.startScrapeQueue,
            };
        case ScrapeActionType.GetIsRunning:
            return {
                ...state,
                getIsRunning: !state.getIsRunning,
            };
        case ScrapeActionType.SetIsRunning:
            if (action.payload != undefined) {
                return {
                    ...state,
                    getIsRunning:false,
                    isQueueRunning: action.payload,
                };
            }
            break;
        case ScrapeActionType.GetScrapeQueue:
            return {
                ...state,
                getScrapeQueue: !state.getScrapeQueue,
            };
        case ScrapeActionType.SetScrapeQueue:
            if (action.payload != undefined) {
                return {
                    ...state,
                    getScrapeQueue:false,
                    queueData: action.payload,
                };
            }
            break;
        case ScrapeActionType.GetIsAndScrape:
            return {
                ...state,
                getScrapeQueue: !state.getScrapeQueue,
                getIsRunning: !state.getIsRunning,
            };
        default:
            break;
    }

    return state;
};
export default ScrapeReducer;
