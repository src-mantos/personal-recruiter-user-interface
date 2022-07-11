/* eslint-disable react/jsx-key */
import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes } from 'react';
import { Column, useTable, useAbsoluteLayout, useSortBy, Row } from 'react-table';
import styles from '../../../styles/search/ResultPanel.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { IPostData } from 'data-service/types';

interface AnyMap { [key: string]: any }
export interface ResultPanelProps extends AnyMap {
    className?: string;
    compact?: boolean;
    searchData?: IPostData[];
}
enum View {
    Search = "Search",
    Favorites = "Favorites"
}



const ResultPanel = (props:ResultPanelProps) => {
    const isUndef = (val:any) => val===undefined || val == null;
    const sortAlpha = (rowA: Row, rowB: Row, columnId:any, desc: Boolean)=>{

        if(isUndef(rowA.values[columnId]) && isUndef(rowB.values[columnId])) return 0;
        if(isUndef(rowA.values[columnId])) return (desc)? 1 : -1;
        if(isUndef(rowB.values[columnId])) return (desc)? 1 : -1;

        const a:string = rowA.values[columnId].toLowerCase();
        const b:string = rowB.values[columnId].toLowerCase();
        
        const len = Math.max(a.length,b.length);
        for (let i=0; i<len; i++){
            let an:number = a.charCodeAt(i);
            if(isNaN(an)) an = 0;
            let bn:number = b.charCodeAt(i);
            if(isNaN(bn)) bn = 0;

            if(an == bn) continue;
            const dir = an - bn;
            console.log(an +" - "+ bn);
            if(dir > 0 && desc){
                return  1;
            }else{
                return -1;
            }
        }
    }
    
    const columns = React.useMemo<Column<IPostData>[]>(
        () => [
            {
                Header: 'Post Title',
                accessor: 'title',
                sortType: sortAlpha,
                className:'check'
            },
            {
                Header: 'Organization',
                accessor: 'organization',
                sortType: sortAlpha,
            },
            {
                Header: 'Location',
                accessor: 'location',
                sortType: sortAlpha,
            },
            {
                Header: 'Salary Info',
                accessor: 'salary',
                sortType: sortAlpha,
            },
            {
                Header: 'Post Desc.',
                accessor: 'description',
                Cell: (cell) => {
                    return (<span>{cell.value.slice(0, 100)+" ..."}</span>);
                }
            },
            {
                Header: 'Capture Time',
                accessor: 'captureTime',
                sortType: sortAlpha,
                Cell: (cell:CellProps<IPostData, Date>) => {
                    const hasData = cell.value && cell.value.toLocaleTimeString;
                    return (<span>{(hasData)?cell.value.toLocaleTimeString():""}</span>);
                }
            },
            {
                Header: 'Posted Time',
                accessor: 'postedTime',
                sortType: (rowA: Row, rowB: Row, columnId:any, desc: Boolean)=>{
                    let a = Number.parseFloat(rowA.values[columnId]);
                    let b = Number.parseFloat(rowB.values[columnId]);
                },
            },
            {
                Header: '',
                accessor: 'directURL',
                Cell: (cell) => {
                    return (<a href="{cell.value}" target={'_blank'}>Link</a>);
                }
            },
        ],
        []
    );
    const data = (props.searchData == undefined)? []:props.searchData;
    const tableInst = useTable({ columns, data }, useSortBy);//useAbsoluteLayout
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInst;
    console.log(tableInst.state,data);
   
    return (
        <div className={[props.className, styles["rs-table"]].join(" ")} >
            <table {...getTableProps()} className={styles["rs-header"]}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} className={[styles["rs-header"]].join(" ")}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} >
    
                                    {column.render('Header')}
                                    
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
    
                        return (
                            <tr {...row.getRowProps()} className={[styles["rs-row"]].join(" ")}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()} >
    
                                            {cell.render('Cell')}
    
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
    
    // return (
    //     <div className={[props.className, styles["rs-table"]].join(" ")} >
    //         <table {...getTableProps()} className={styles["rs-header"]}>
    //             <thead>
    //                 {headerGroups.map(headerGroup => (
    //                     <tr {...headerGroup.getHeaderGroupProps()} className={[styles["rs-header"]].join(" ")}>
    //                         {headerGroup.headers.map(column => (
    //                             <th {...column.getHeaderProps(column.getSortByToggleProps())} >
    
    //                                 {column.render('Header')}
                                    
    //                                 <span>
    //                                     {column.isSorted
    //                                         ? column.isSortedDesc
    //                                             ? ' 🔽'
    //                                             : ' 🔼'
    //                                         : ''}
    //                                 </span>
    //                             </th>
    //                         ))}
    //                     </tr>
    //                 ))}
    //             </thead>
    //             <tbody {...getTableBodyProps()}>
    //                 {rows.map(row => {
    //                     prepareRow(row);
    
    //                     return (
    //                         <tr {...row.getRowProps()} className={[styles["rs-row"]].join(" ")}>
    //                             {row.cells.map(cell => {
    //                                 return (
    //                                     <td {...cell.getCellProps()} >
    
    //                                         {cell.render('Cell')}
    
    //                                     </td>
    //                                 );
    //                             })}
    //                         </tr>
    //                     );
    //                 })}
    //             </tbody>
    //         </table>
    //     </div>
    // );
    
};

export default ResultPanel;