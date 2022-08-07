/* eslint-disable indent */
import React, { Provider, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { v4 } from 'uuid';
import ScrapeReducer, {
    ScrapeActionType,
    ScrapeAction,
    ScrapeState,
    getInitialScrapeState,
} from './_dispatchers/ScrapeDispatcher';
import SearchReducer, { getInitialSearchState, SearchAction, SearchState } from './_dispatchers/SearchDispatcher';


export interface Action<T> {
    type: T;
    payload?: any;
}

export interface DispatcherContextDef {
    scrapeState: ScrapeState;
    fireScrapeAction: React.Dispatch<ScrapeAction>;
    searchState: SearchState;
    fireSearchAction: React.Dispatch<SearchAction>;
}

const initialContextDef = ():DispatcherContextDef=>{
    return {
        scrapeState: getInitialScrapeState(),
        fireScrapeAction: ()=>{},
        searchState: getInitialSearchState(),
        fireSearchAction:()=>{},
    };
};

const DispatcherContext: React.Context<DispatcherContextDef> = React.createContext<DispatcherContextDef>( initialContextDef() );
const useDispatcherContext = () => {
    return React.useContext(DispatcherContext);
};
export default useDispatcherContext;


export const DispatchContextProvider = (props:any) => {
    const [scrapeState, fireScrapeAction] = useReducer(ScrapeReducer, getInitialScrapeState());
    const [searchState, fireSearchAction] = useReducer(SearchReducer,getInitialSearchState());

    return (
        <DispatcherContext.Provider value={{
            scrapeState,
            fireScrapeAction,
            searchState,
            fireSearchAction,
        }}>
            {props.children}
        </DispatcherContext.Provider>
    );
};

