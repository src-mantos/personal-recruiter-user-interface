/* eslint-disable indent */

import { IPostDataSearchRequest, IPostData } from 'data-service/types';
import { Action } from '../DispatcherContext';
import { urlBuilder } from '../FormUtils';

/*
 > Keyword Search
 > fav. Keyword Search
 > Add View Filter
 > Remove View Filter
 > Selected Post
*/
export enum SearchActionType {
    ActionKeySearch = 'ActionKeySearch',
    ActionFavSearch = 'ActionFavSearch',
    ActionAddFilter = 'ActionAddFilter',
    ActionRemoveFilter = 'ActionRemoveFilter',
    ActionSetActive = 'ActionSetActive',

    ClearFetchFlag = 'ClearFetchFlag',
    SetSearchResult = 'SetSearchResult',
}

export interface SearchAction extends Action<SearchActionType> {

}

export interface SearchState {
    userRequest?: IPostDataSearchRequest;
    postResultSet?: IPostData[];
    filterCriteria?: any[];
    activePost?: IPostData;

    fetch: boolean;
}
export const getInitialSearchState = (): SearchState => {
    return {
        fetch: false,
    };
};

const SearchReducer = (state: SearchState, action: SearchAction): SearchState => {
    console.log('SearchReducer', state, action);
    switch (action.type) {
        case SearchActionType.ActionKeySearch:
            if (action.payload != undefined) {
                return {
                    ...state,
                    fetch: true,
                    userRequest: action.payload,
                };
            }
            break;
        case SearchActionType.ActionSetActive:
            if (action.payload != undefined) {
                return {
                    ...state,
                    activePost: action.payload,
                };
            }
            break;
        case SearchActionType.ClearFetchFlag:
            return {
                ...state,
                fetch: false,
            };
        case SearchActionType.SetSearchResult:
            if (action.payload != undefined) {
                return {
                    ...state,
                    postResultSet: action.payload,
                };
            }
            break;
        default:
            break;
    }

    return state;
};
export default SearchReducer;
