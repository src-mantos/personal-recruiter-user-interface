import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, useMemo, useCallback, useReducer } from 'react';

import { IPostData, ISearchQuery } from 'data-service/types';
import { onEnterHandler, urlBuilder } from '../FormUtils';
import { faBookmark, faAdd, faSearch, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StylableComponent } from '../types';

import {SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {searchRequestState, searchResultState, searchFilterState, FilterStateRecord, searchFilterSelector} from '../contexts/SearchContext';

import { columns } from './PostResultPanel';
///pages/Components/SearchDisplayComponents/PostSearchForm.tsx
import styles from '../../../styles/Components/Form.module.scss';

export interface FilterColumns {
    key : string;
    name : string | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}
export const getFilterColumns = ():FilterColumns[] => {
    return [...columns, {
        key: "tag",
        name: "Tag Name"
    }];
};

type Factory<T> = {(props: T) : {() : void}};

const PostSearchForm = (props:StylableComponent) => {
    const [searchQuery, setSearchQuery] = useRecoilState(searchRequestState);
    const [searchFilters, setFilters] = useRecoilState(searchFilterState);
    
    const keywords = useRef<HTMLInputElement>(null);
    const SearchPosts:{():void} = () => {
        if(keywords.current && keywords.current.value != ""){
            const req:ISearchQuery = {
                keywords: keywords.current.value
            };
            if( searchQuery?.keywords != req.keywords){
                setSearchQuery(req);
            }
        }
    };

    const filterType = useRef<HTMLSelectElement>(null);
    const filterValue = useRef<HTMLInputElement>(null);
    const AddFilter:{():void} = () => {
        if(filterType.current == undefined || filterValue.current == undefined) 
            return;
        
        setFilters([
            ...searchFilters,
            {
                key:filterType.current.value,
                name:filterType.current.value,
                value:filterValue.current.value,
            }
        ]);
    };
    
    return (
        <div className={['tile is-ancestor', props.className].join(" ")}>
            <div className={['tile is-parent is-vertical'].join(" ")}>
                <div className={['tile is-parent', styles["pad-children"]].join(" ")}>
                    <input type="text" 
                        ref={keywords}
                        className={['input control'].join(" ")} 
                        placeholder='Search Terms'
                        onKeyDown={onEnterHandler(SearchPosts)} />

                    <button className={['input control'].join(" ")} style={{width:"42px"}} onClick={SearchPosts} >
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
                
                <div className={['tile is-parent', styles["pad-children"]].join(" ")}>
                    <div className='control select' style={{width:"100%"}}>
                        <select ref={filterType} className={['input control select'].join(" ")} >
                            {getFilterColumns().map((col:FilterColumns, index:number)=>{
                                const {key,name} = col;
                                return (
                                    <option key={"Filter-"+key} value={key}>{name}</option>
                                );
                            })}
                        </select>
                    </div>

                    <span className={['control'].join(" ")} style={{padding: "0.5em 0px"}}>
                        contains
                    </span>

                    <input type="text" ref={filterValue}
                        className={['input control'].join(" ")} 
                        placeholder='Filter Term' />

                    <button className={['input control '].join(" ")} style={{width:"42px"}} onClick={AddFilter} >
                        <FontAwesomeIcon icon={faAdd} />
                    </button>
                </div>
            </div>

            <div className={['tile is-parent', styles["pad-children"]].join(" ")}>
                <TagLayout></TagLayout>
            </div>
        </div>
    );
};
export default PostSearchForm;

const TagLayout = () => {
    const displayMatrix:FilterStateRecord[][] = useRecoilValue(searchFilterSelector);
    const [searchFilters, setFilters] = useRecoilState(searchFilterState);
    const RemoveFilter = (props:FilterStateRecord) => {
        return ()=>{
            const updatedFilters:FilterStateRecord[] = [];
            searchFilters.forEach((filter)=>{
                const k = filter.key == props.key;
                const n = filter.name == props.name;
                const v = filter.value == props.value;
                if(k && n && v){
                    return;
                }
                updatedFilters.push(filter);
            });
            setFilters(updatedFilters);
        }
    };
    return (
        <div className={["tile is-parent is-vertical"].join(" ")} style={{overflow:"auto", maxHeight:"150px"}}>
            {(displayMatrix.length > 0)? displayMatrix.map((row)=>{
                const {key, name} = row[0];
                const margin0 = {margin:"0px"};
                const padding0 = {padding:"0px"};
                const indent = {marginLeft: "10px"};
                return (
                    <div key={key+"-Filter-Row"} className={["tile is-parent is-vertical"].join(" ")} style={padding0}>
                        <label className={["is-child label"].join(" ")} style={margin0}>
                            {name}
                        </label>
                        <div className={["is-child tags", styles["pad-children"]].join(" ")} style={indent}>
                            {row.map((filter)=> Tile(filter,RemoveFilter(filter) ))}
                        </div>
                    </div>
                );
            }):<div>No Active Filters</div>}
        </div>
    );
};

const Tile = (props:FilterStateRecord, onRemove:{():void}) => {
    return (
        <div key={props.key+"-"+props.name+"-Tag"} 
            className={["tag is-warning is-medium"].join(" ")} >
            <span>{props.value}</span>
            <button className="delete is-small" onClick={onRemove}></button>
        </div>
    );
};