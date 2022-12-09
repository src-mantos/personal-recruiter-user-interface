/* eslint-disable react/jsx-key */
import React, { useState, useEffect, Key } from 'react';

import { IPostData } from 'data-service/types';

import { Table, Column, Index, TableHeaderRowProps, TableRowProps } from 'react-virtualized';
import 'react-virtualized/styles.css';

import { useRecoilValueLoadable, useRecoilValue, useRecoilState, useRecoilStateLoadable } from 'recoil';
import {  searchRequestState } from '../contexts/SearchContext';




const TitleColumn = {
    key: 'title',
    name: 'Post Title',
    // headerRenderer: (p) => (
    //     <FilterRenderer<IPostData, unknown, HTMLInputElement> {...p}>
    //         {({ filters, ...rest }) => (
    //             <input
    //                 {...rest}
    //             />
    //         )}
    //     </FilterRenderer>
    // ),
    sortable: true
};
const OrgColumn = {
    key: 'organization',
    name: 'Organization',
    sortable: true
};
const LocColumn = {
    key: 'location',
    name: 'Location',
    sortable: true
};
const DescColumn = {
    key: 'description',
    name: 'Post Desc.',
    sortable: true
};
const CapTimeColumn = {
    key: 'captureTime',
    name: 'Updated Time',
    sortable: true
};
const SalaryColumn = {
    key: 'salary',
    name: 'Salary Info',
    sortable: true
};

const IDColumn = {
    key: '_id',
    name: 'ID',
    sortable: true
};
const UsrModColumn = {
    key: 'userModified',
    name: 'Edited',
    sortable: true
};
const PostTimeColumn = {
    key: 'postedTime',
    name: 'Post Time Info',
    sortable: true
};
const NoDataColumn = {
    key: 'msg',
    name: 'No Data / Info Table',
    sortable: true
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

    
    return (
        <Table headerHeight={55} height={800} rowHeight={55} width={1000} 
            rowCount={(requestAtom.dataset)?requestAtom.dataset.length : 0}
            headerRowRenderer={(props: TableHeaderRowProps) => {
                return (
                    <div className={['columns'].join(" ")}>
                        {props.columns.map( (val,index) => {
                            return (
                                <div className={['column'].join(" ")}>
                                    {val}
                                </div>
                            );
                        } )}
                    </div>
                );
            }}
            rowRenderer={(props: TableRowProps) => {
                return (
                    <div className={['columns'].join(" ")}>
                        {props.columns.map( (val,index) => {
                            return (
                                <div className={['column'].join(" ")}>
                                    {val}
                                </div>
                            );
                        } )}
                    </div>
                );
            }}
            rowGetter={(info:Index)=>{
                return (requestAtom.dataset)? requestAtom.dataset[info.index] : undefined;
            }}>
            <Column dataKey={TitleColumn.key} label={TitleColumn.name} width={200}/>
            <Column dataKey={OrgColumn.key} label={OrgColumn.name} width={100}/>
            <Column dataKey={LocColumn.key} label={LocColumn.name} width={100}/>
            <Column dataKey={DescColumn.key} label={DescColumn.name} width={100}/>
            <Column dataKey={CapTimeColumn.key} label={CapTimeColumn.name} width={100}/>
            <Column dataKey={SalaryColumn.key} label={SalaryColumn.name} width={100}/>
        </Table>
    );
   
};

export default PostResultPanel;
