/* eslint-disable react/jsx-key */
import React, { useState, useEffect, Key } from 'react';

import { IPostData } from 'data-service/types';

import { useVirtualizer } from '@tanstack/react-virtual';

import { useRecoilValueLoadable, useRecoilValue, useRecoilState, useRecoilStateLoadable } from 'recoil';
import {  searchRequestState } from '../contexts/SearchContext';

import styles from '../../styles/Components/Form.module.scss';
import { truncEllipsis } from '../FormUtils';
import { postDataState } from '../contexts/EditorContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';


const TitleColumn = {
    key: 'title',
    name: 'Post Title',
    className: 'is-3',
    dataRenderer : (value:any) => {
        return value;
    }
};
const OrgColumn = {
    key: 'organization',
    name: 'Organization',
    className: 'is-2'
};
const LocColumn = {
    key: 'location',
    name: 'Location',
    className: 'is-narrow'
};
const DescColumn = {
    key: 'description',
    name: 'Post Desc.',
    className: 'is-3',
    dataRenderer : (value:any) => {
        return truncEllipsis(value, 100);
    }
};
const CapTimeColumn = {
    key: 'captureTime',
    name: 'Updated Time',
    className: 'is-1',
    dataRenderer : (value:any) => {
        const date = new Date(value);
        return date.toLocaleString();
    }
};
const SalaryColumn = {
    key: 'salary',
    name: 'Salary Info',
    className: 'is-1'
};

const IDColumn = {
    key: '_id',
    name: 'ID',
};
const UsrModColumn = {
    key: 'userModified',
    name: 'Edited',
};
const PostTimeColumn = {
    key: 'postedTime',
    name: 'Post Time Info',
    sortable: true
};
const NoDataColumn = {
    key: 'msg',
    name: 'No Data / Info Table',
};

export const columns = [
    TitleColumn,
    OrgColumn,
    LocColumn,
    DescColumn,
    CapTimeColumn,
    SalaryColumn
];


const PostResultPanel = (props:{height:number}) => {
    const requestAtom = useRecoilValue(searchRequestState);
    const parentRef = React.useRef<HTMLDivElement>(null);
    const [activePostData, setActivePost] = useRecoilState(postDataState);
    const [selectIndex, setSelected] = useState(-1);

    // The virtualizer
    const rowVirtualizer = useVirtualizer({
        count: (requestAtom.dataset === undefined)? 1: requestAtom.dataset.length,
        getScrollElement: () => (parentRef.current === undefined)? null : parentRef.current,
        estimateSize: () => 80,
    });

    if(requestAtom.dataset === undefined){
        return (
            <div>
                <div className={['columns is-centered', 'card', styles['post-tile']].join(" ")}>
                    <div className={['column'].join(" ")}
                        style={{ textAlign:'center' }}>
                            no data available
                    </div>
                </div>
            </div>
        );
    }else{
        const viewData:IPostData[] = requestAtom.dataset; //enforce datatype
        const clickRow = (index:number)=> {
            return (event:React.MouseEvent) => {
                if(selectIndex == index){
                    setSelected(-1);
                    setActivePost({
                        origState: undefined
                    });
                }else{
                    setSelected(index);
                    setActivePost({
                        origState: viewData[index]
                    });
                }
            };
        };
        
        return (
            <div ref={parentRef} className={[styles["vtable-viewport"]].join(" ")} style={{ height:props.height }}>
                <div className={[styles["vtable-canvas"]].join(" ")}
                    style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                >
                        
                    {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                        const row = viewData[virtualItem.index] as any;
                        const captureTime:Date = new Date(row["captureTime"]);
                        return (
                            <div className={[styles['vtable-row']].join(" ")}
                                key={virtualItem.key}
                                style={{
                                    height: `${virtualItem.size}px`,
                                    transform: `translateY(${virtualItem.start+10}px)`,
                                }}>

                                <div className={['card','columns',styles['post-tile'],(selectIndex == virtualItem.index)? styles['selected']:"" ].join(" ")} onClick={clickRow(virtualItem.index)}>
                                    <div className={['column is-vertical'].join(" ")}>
                                        <div className={['columns', styles['vtable-nopad'], styles['post-tile-header']].join(" ")}>
                                            <div className={['column', styles['vtable-title']].join(" ")}>{row["title"]}</div>
                                            <div className={['column is-narrow', styles['vtable-subtitle']].join(" ")}>{row["organization"]}</div>
                                            {(row["organization"] != row["location"])?(
                                                <div className={['column is-narrow', styles['vtable-subtitle']].join(" ")}>{row["location"]}</div>
                                            ):""}
                                            <div className={['column is-narrow'].join(" ")}
                                                style={{ paddingLeft:0 }}
                                                onClick={()=>{
                                                    if(row["directURL"] !== undefined && row["directURL"] !== "")
                                                        window.open(row["directURL"],"_blank");
                                                }}>
                                                <FontAwesomeIcon icon={faExternalLink} size={"1x"}/>
                                            </div>
                                        </div>
                                        <div className={['columns', styles['vtable-nopad']].join(" ")}>
                                            <div className={['column'].join(" ")}>{truncEllipsis(row["description"], 144)}</div>
                                            <div className={['column is-narrow is-vertical'].join(" ")}>
                                                <div>{captureTime.toLocaleString()}</div>
                                                <div>{truncEllipsis(row["salary"], 20)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    
                            </div>
                                    
                        );
                    })}
                        
                </div>
            </div>
        );
    }
    
    
    
   
};

export default PostResultPanel;
