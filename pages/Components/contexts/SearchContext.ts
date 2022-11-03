import { atom, selector, selectorFamily } from 'recoil';
import {  IPostData, IPostMetaData, IPostDataIndex, ISearchQuery, ISearchFilter } from 'data-service/types';
import { FilterColumns, getFilterColumns } from '../SearchDisplayComponents/PostSearchForm';

const ErrorHandler = async (resp: Response): Promise<any> => {
    console.error(resp);
};

export enum SearchAtomKeys {
    SearchRequest = 'SearchRequest',
    SearchResult = 'SearchResult',
    SearchFilters = 'SearchFilters',
} 



export const searchRequestState = atom<ISearchQuery | undefined>({
    key: SearchAtomKeys.SearchRequest,
    default: undefined,
    effects: [
        ({ onSet }) => {
            onSet((newReq) => {
                console.debug("updated User Search Req",newReq);
            });
        },
    ],
});

export const searchResultState = selector<IPostData[] | undefined>({
    key: SearchAtomKeys.SearchResult,
    get: async ({ get }) => {
        const userRequest = get(searchRequestState);
        if (userRequest != undefined) {
            const resp: Response = await fetch('/api/data/search?keywords=' + userRequest.keywords);
            if (resp.status == 200) {
                const data: IPostData[] = await resp.json();
                return data;
            } else {
                ErrorHandler(resp);
            }
        }
    },
});

export type FilterStateRecord = FilterColumns & { value: any };
export const searchFilterState = atom<FilterStateRecord[]>({
    key: SearchAtomKeys.SearchFilters,
    default: [],
});

/**
 * searchFilterSelector - generates the 2D display matrix of active filters.
 * Major Filter Groups x Individual Filters.
 * default AND Majors & default OR Individuals
 * This entire implementation should be scrubbed in favor of an optimized store.
 */
export const searchFilterSelector = selector({
    key: 'get' + SearchAtomKeys.SearchFilters,
    get:
        ({ get }) => {
            const list: FilterStateRecord[] = get(searchFilterState);
            if(list == undefined){
                return [];
            }
            const mapping: Record<string,FilterStateRecord[]> = {};
            
            list.forEach((filter) => {
                console.log('step',mapping, filter);
                if (mapping[filter.key] == undefined) {
                    mapping[filter.key] = [];
                }
                mapping[filter.key].push(filter);
            });

            const sub: FilterStateRecord[][] = [];
            const keySet = Object.keys(mapping);
            for(let fKey of keySet){
                sub.push(mapping[fKey]);
            }
            
            return sub;
        },
});

// export const searchFilterSelectorRemove = selectorFamily({
//     key: 'remove' + SearchAtomKeys.SearchFilters,
//     get:
//         (param) =>
//         ({ get }) => {
//             return;
//         },

//     set:
//         (removeFilter:FilterStateRecord) =>
//         ({ set, get }, newValue) => {
//             const filterList = get(searchFilterState);
//             const updateList = [];
//             filterList.forEach((filter)=>{
//                 const k = filter.key == removeFilter.
//             })
//             set(searchFilterState, );
//         },
// });