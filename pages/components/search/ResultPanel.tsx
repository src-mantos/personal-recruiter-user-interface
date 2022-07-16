/* eslint-disable react/jsx-key */
import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, ChangeEvent } from 'react';
import { Column, useTable, useAbsoluteLayout, useSortBy, useFlexLayout, useRowSelect, Row, HeaderGroup, CellProps,useFilters, useGlobalFilter, useAsyncDebounce, UseSortByColumnProps, UseFiltersColumnOptions, FilterTypes, FilterType, FilterValue, IdType, TableInstance, ColumnInstance, UseSortByColumnOptions, UseRowSelectRowProps, UseRowSelectInstanceProps,UseFiltersOptions, UseTableOptions, Hooks } from 'react-table';
import styles from '../../../styles/search/ResultPanel.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { IPostData } from 'data-service/types';
import {matchSorter} from 'match-sorter';

import {columnDef, getColumnDef, DefaultColumnFilter, fuzzyTextFilter, CustomColumn} from './tableUtil';
import { IpcNetConnectOpts } from 'net';

interface AnyMap { [key: string]: any }
export interface ResultPanelProps extends AnyMap {
    className?: string;
    compact?: boolean;
    searchData?: IPostData[];
    onSelect?: {(row:IPostData):void}
}

interface AnyTable extends AnyMap {
    instance: TableInstance<IPostData>;
}


const ResultPanel = (props:ResultPanelProps) => {
    
    const columns = React.useMemo<Column<IPostData>[]>(
        getColumnDef,
        []
    );

    const filterTypes:FilterTypes<IPostData> = {
        fuzzyText: fuzzyTextFilter,
    };

    const data = (props.searchData == undefined)? []:props.searchData;

    const tableInst = useTable(
        { columns, data, filterTypes }, 
        useFlexLayout, useFilters, useSortBy, useRowSelect);//useFlexLayout, useFilters, useSortBy, useRowSelect

    const {
        getTableProps,
        rows,
        prepareRow
    } = tableInst;

    console.log("instance",tableInst);
    const {style:g2, ...TableProps} = getTableProps();

    return (
        <div key={"RS-Table"} {...TableProps} className={["is-flex is-flex-direction-column", props.className, styles["rs-table"]].join(" ")}>
            
            <TableHeader instance={tableInst}></TableHeader>

            {rows.map((row) => {
                prepareRow(row);
                return ( <TableRow instance={tableInst} row={row} onSelect={props.onSelect}></TableRow>);
            })}
        </div>
    );
    
};

interface TableHeaderProps extends AnyTable {}

const TableHeader = (props:TableHeaderProps) => {
    const { headers } = props.instance;

    return (            
        <div key={"RS-TableHeader"} className={["is-flex",styles["rs-row"],styles["rs-header"]].join(" ")}>

            {headers.map( (column) => {
                const columnSort = (column as unknown as UseSortByColumnProps<IPostData>);
                const {style:g, ...SortProps} = columnSort.getSortByToggleProps();

                const columnConfig = column as unknown as CustomColumn<IPostData>;
                const colSortType = columnConfig.sortType;
                const colFilter = columnConfig.Filter;
                const colClassName = columnConfig.className;
                
                return (
                    <div key={"headerRow_"+column.id} {...SortProps} className={["is-flex is-flex-direction-column",styles["rs-row"], styles["rs-cell"],colClassName].join(" ")}>
                        <div className={["is-flex"].join(" ")}>
                            {column.render('Header')}
                            { (colSortType && columnSort.isSorted)? (
                                <div className={["is-flex"].join(" ")}>
                                    {columnSort.isSortedDesc ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} />}
                                </div>
                            ):""}
                        </div>
                        <div className={["is-flex"].join(" ")}>
                            {(colFilter) ? column.render('Filter') : null}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

interface TableRowProps extends AnyTable {
    row : Row<IPostData>;
    selected?: boolean;
    onSelect?: {(row:IPostData):void} | undefined;
}
const TableRow = (props:TableRowProps) => {
    //const [selected, setSelected] = useState((props.selected==undefined)? false : props.selected);
    const rowSelect = props.row as unknown as UseRowSelectRowProps<IPostData>;
    const {style:g1, onChange:g3, ...SelectProps} = rowSelect.getToggleRowSelectedProps();
    const {style:g2, key:tableKey, ...RowProps} = props.row.getRowProps();
    const combindedProps = {
        key: (tableKey)? tableKey : props.row.id,
        ...RowProps,
        ...SelectProps
    };

    const rowRef = useRef<HTMLDivElement>(null);
    const mouseEnter = ()=>{
        const el = rowRef.current as HTMLElement;
        el.classList.add(styles["rs-focus-row"]);
    };
    const mouseLeave = ()=>{
        const el = rowRef.current as HTMLElement;
        el.classList.remove(styles["rs-focus-row"]);
    };

    const selectRow = (event: React.SyntheticEvent<Element>)=>{
        (props.instance as unknown as UseRowSelectInstanceProps<IPostData>).toggleAllRowsSelected(false);
        rowSelect.toggleRowSelected(true);
        if(props.onSelect){
            props.onSelect(props.row.original);
        }
    };
    
    return (
        <div ref={rowRef} {...combindedProps} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onClick={selectRow}
            className={["is-flex",styles["rs-row"], styles["rs-body-row"], (rowSelect.isSelected)? styles["rs-select-row"]:""].join(" ")}>
            {props.row.cells.map((cell, _index) => {
                const {style:g, ...CellProps} = cell.getCellProps();
                const colClassName = (cell.column as unknown as CustomColumn<IPostData>).className;
                return (
                    <div {...CellProps} className={["is-flex",styles["rs-cell"],colClassName].join(" ")} >
                        {cell.render('Cell')}
                    </div>
                );
            })}
        </div>
    );
};

export default ResultPanel;