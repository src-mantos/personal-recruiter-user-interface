import { atom, selector, selectorFamily, useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import {  IPostData, IPostMetaData, IPostDataIndex, ISearchQuery, ISearchFilter } from 'data-service/types';
import { FilterColumns } from '../SearchComponents/KeywordSearchForm';

const ErrorHandler = async (resp: Response): Promise<any> => {
    console.error(resp);
};

export enum EditorAtomKeys {
    PostData = 'PostData'
} 
export interface ActivePostData {
    origState?: Partial<IPostData>;
    editState?: IPostData;
}

export const postDataState = atom<ActivePostData>({
    key: EditorAtomKeys.PostData,
    default:{},
    effects: [
        ({ onSet, setSelf, getLoadable }) => {
            onSet((postDataState) => {
                console.log("set Editor data", postDataState);
                // const makeRequest = async () =>{
                //     const resp: Response = await fetch('/dataservice/data/search/?keywords=' + newReq.keywords);
                //     const tmp = await resp.json() as unknown as IPostData[];
                //     setSelf({ ...newReq, dataset:tmp, sendRequest:false  });
                //     console.log("updated");
                // }
                // if(newReq.sendRequest){
                //     setSelf({ ...newReq, sendRequest:false });
                //     makeRequest();
                //     console.log("requested");
                // }
            });
        },
    ],
});

