import { atom, selector, selectorFamily, useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import {  IPostData, IPostMetaData, IPostDataIndex, ISearchQuery, ISearchFilter } from 'data-service/types';

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
            });
        },
    ],
});

