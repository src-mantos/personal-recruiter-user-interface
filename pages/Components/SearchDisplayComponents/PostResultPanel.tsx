/* eslint-disable react/jsx-key */
import React, { useState, useEffect, Key } from 'react';

import { IPostData } from 'data-service/types';

import { useVirtualizer } from '@tanstack/react-virtual';

import { useRecoilValueLoadable, useRecoilValue, useRecoilState, useRecoilStateLoadable } from 'recoil';
import {  searchRequestState } from '../contexts/SearchContext';

import styles from '../../../styles/Components/Form.module.scss';
import { truncEllipsis } from '../FormUtils';


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


const PostResultPanel = (props:any & {dataset?:IPostData[]} ) => {
    const requestAtom = useRecoilValue(searchRequestState);
    const parentRef = React.useRef<HTMLDivElement>();

    // The virtualizer
    const rowVirtualizer = useVirtualizer({
        count: (requestAtom.dataset === undefined)? 1: requestAtom.dataset.length,
        getScrollElement: () => (parentRef.current === undefined)? null : parentRef.current,
        estimateSize: () => 35,
    });

    if(requestAtom.dataset === undefined){
        return (
            <div>
                <div className={['columns is-centered'].join(" ")}>
                    <div className={['column'].join(" ")}>no data available</div>
                </div>
            </div>
        );
    }else{
        const viewData:IPostData[] = requestAtom.dataset; //enforce datatype
        return (
            <div>
                <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'>
                    <thead>
                        <tr>
                            {columns.map((col)=>(
                                <td>{col.name}</td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={6}> nodata </td>
                        </tr>
                        <tr>
                            <td colSpan={6}> nodata </td>
                        </tr>
                    </tbody>
                </table>
                <div
                    ref={parentRef}
                    style={{
                        height: `400px`,
                        overflow: 'auto', // Make it scroll!
                    }}
                >
                    <div
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        
                        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                            const row = viewData[virtualItem.index] as any;
                            return (
                                <div className={['columns'].join(" ")}
                                    key={virtualItem.key}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: `${virtualItem.size}px`,
                                        transform: `translateY(${virtualItem.start}px)`,
                                    }}>

                                    {columns.map((col)=>(
                                        <div className={['column', col.className].join(" ")}>{(col.dataRenderer != undefined)? col.dataRenderer(row[col.key]) :row[col.key]}</div>
                                    ))}
                                    
                                </div>
                                    
                            );
                        })}
                        
                    </div>
                </div>
            </div>
        );
    }
    
    
    
   
};

export default PostResultPanel;
