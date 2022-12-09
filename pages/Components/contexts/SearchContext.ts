import { atom, selector, selectorFamily, useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import {  IPostData, IPostMetaData, IPostDataIndex, ISearchQuery, ISearchFilter } from 'data-service/types';
import { FilterColumns } from '../SearchComponents/KeywordSearchForm';

const ErrorHandler = async (resp: Response): Promise<any> => {
    console.error(resp);
};

export enum SearchAtomKeys {
    SearchRequest = 'SearchRequest',
    SearchResult = 'SearchResult',
    SearchFilters = 'SearchFilters',
    DataSet = 'DataSet',
} 

export interface SearchQuery extends Partial<ISearchQuery> {
    sendRequest: boolean;
    dataset?: IPostData[];
};


export const searchRequestState = atom<SearchQuery>({
    key: SearchAtomKeys.SearchRequest,
    default: { sendRequest:false },
    effects: [
        ({ onSet, setSelf, getLoadable }) => {
            onSet((newReq) => {
                const makeRequest = async () =>{
                    const resp: Response = await fetch('/dataservice/data/search/?keywords=' + newReq.keywords);
                    const tmp = await resp.json() as unknown as IPostData[];
                    setSelf({ ...newReq, dataset:tmp, sendRequest:false  });
                    console.log("updated");
                }
                if(newReq.sendRequest){
                    setSelf({ ...newReq, sendRequest:false });
                    makeRequest();
                    console.log("requested");
                }
            });
        },
    ],
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