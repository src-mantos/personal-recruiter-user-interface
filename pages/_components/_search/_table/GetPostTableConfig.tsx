// import {
//     Column,
//     useTable,
//     useAbsoluteLayout,
//     useSortBy,
//     useFlexLayout,
//     useRowSelect,
//     Row,
//     HeaderGroup,
//     CellProps,
//     useFilters,
//     useGlobalFilter,
//     useAsyncDebounce,
//     UseFiltersColumnOptions,
//     FilterProps,
//     Renderer,
//     UseSortByColumnOptions,
//     SortByFn,
//     IdType,
//     UseFiltersColumnProps,
//     FilterType,
//     FilterValue,
//     UseSortByColumnProps,
//     UseFiltersInstanceProps
// } from 'react-table';
import {
    Column,
    Table,
    useReactTable,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    sortingFns,
    getSortedRowModel,
    FilterFn,
    SortingFn,
    ColumnDef,
    flexRender,
    FilterFns,
    createColumnHelper,
    CellContext,
} from '@tanstack/react-table'
import { IPostData } from 'data-service/types';
import { matchSorter } from 'match-sorter';
import styles from '../../../../styles/search/ResultPanel.module.scss';
import React, { useMemo } from 'react';
import {truncEllipsis, formatLocaleDateString} from '../../_utils/FormUtils'


const helper = createColumnHelper<IPostData>();


const GetPostTableConfig = () => {
    const columns = useMemo<ColumnDef<IPostData,any>[]>( () => [
        {
            id: 'title',
            header: 'Post Title',
            cell: (cell:CellContext<IPostData, any>) => {
                return (
                    <div>
                        {cell.getValue()}
                    </div>
                );
            }
        },
        {
            id: 'organization',
            header: 'Organization',
        },
        {
            id: 'location',
            header: 'Location',
        },
        {
            id: 'description',
            header: 'Post Desc.',
        },
        {
            id: 'captureTime',
            header: 'Updated Time',
        },
        {
            id: 'salary',
            header: 'Salary Info',
        },
    ] ,[]);
    const colRef = useMemo<ColumnDef<IPostData,any>[]>( () => [
        {
            header: 'Post Title',
            columns: [ {
                id:'title',
                accessorKey: 'title',
                cell: info => info.getValue(),
            }]
        },
        {
            header: 'Organization',
            columns: [ {
                id:'organization',
                accessorKey: 'organization',
                cell: info => info.getValue(),
            }]
        },
        {
            header: 'Location',
            columns: [ {
                id:'location',
                accessorKey: 'location',
                cell: info => info.getValue(),
            }]
        },
        {
            header: 'Post Desc.',
            columns: [ {
                id:'description',
                accessorKey: 'description',
                cell: info => info.getValue(),
            }]
        },
        {
            header: 'Updated Time',
            columns: [ {
                id:'captureTime',
                accessorKey: 'captureTime',
                cell: info => info.getValue(),
            }]
        },
    ] ,[]);
    return [columns, colRef];
};
export default GetPostTableConfig;

// const isUndef = (val:any) => val===undefined || val == null;
// export const sortAlpha:SortByFn<IPostData> = (rowA: Row<IPostData>, rowB: Row<IPostData>, columnId: IdType<IPostData>, desc?: boolean): number=>{

//     if(isUndef(rowA.values[columnId]) && isUndef(rowB.values[columnId])) return 0;
//     if(isUndef(rowA.values[columnId])) return (desc)? 1 : -1;
//     if(isUndef(rowB.values[columnId])) return (desc)? 1 : -1;

//     const a:string = rowA.values[columnId].toLowerCase();
//     const b:string = rowB.values[columnId].toLowerCase();
    
//     const len = Math.max(a.length,b.length);
//     for (let i=0; i<len; i++){
//         let an:number = a.charCodeAt(i);
//         if(isNaN(an)) an = 0;
//         let bn:number = b.charCodeAt(i);
//         if(isNaN(bn)) bn = 0;

//         if(an == bn) continue;
//         const dir = an - bn;
        
//         if(dir > 0 && desc){
//             return  1;
//         }else{
//             return -1;
//         }
//     }
//     return 0;
// };

// export const fuzzyTextFilter:FilterType<IPostData> = (() => {
//     const filter = (rows: Array<Row<IPostData>>, columnIds: Array<IdType<IPostData>>, filterValue: FilterValue): Array<Row<IPostData>> =>{
//         if(rows.length && rows.length > 0){
//             return matchSorter(rows, filterValue, {
//                 keys: [(row) => row.values[columnIds[0]]],
//             });
//         }
//         return rows;
//     };
//     filter.autoRemove = (filterValue: FilterValue): boolean => {return !filterValue;};
//     return filter;
// })();

// export const startingTextFilter:FilterType<IPostData> = (() => {
//     const filter = (rows: Array<Row<IPostData>>, columnIds: Array<IdType<IPostData>>, filterValue: FilterValue): Array<Row<IPostData>> =>{
//         return rows.filter(row => {
//             const rowValue = row.values[columnIds[0]];
//             return rowValue !== undefined
//                 ? String(rowValue)
//                     .toLowerCase()
//                     .startsWith(String(filterValue).toLowerCase())
//                 : true;
//         });
//     };
//     filter.autoRemove = (filterValue: FilterValue): boolean => {return !filterValue;};
//     return filter;
// })();
  

// const filterTypes = React.useMemo(
//     () => ({
//         // Add a new fuzzyTextFilterFn filter type.
//         fuzzyText: fuzzyTextFilter,
//         // Or, override the default text filter to use
//         // "startWith"
//         text: startingTextFilter,
//     }),
//     []
// );


//column: { filterValue, preFilteredRows, setFilter },
// export const DefaultColumnFilter:Renderer<FilterProps<IPostData>> = (input) => {
//     const { preFilteredRows, setFilter } = input as unknown as UseFiltersInstanceProps<IPostData>;
//     const { filterValue } = input.column as unknown as UseFiltersColumnProps<IPostData>;
//     const count = preFilteredRows.length;
    

//     return (
//         <input
//             value={filterValue || ''}
//             onChange={e => {
//                 console.log(e.target.value);
//                 setFilter(input.column.id, e.target.value || undefined); // Set undefined to remove the filter entirely
//             }}
//             placeholder={`Search ${count} records...`}
//             style={{width:"90%",margin:"0 5%"}}
//         />
//     );
// };

// export type CustomColumn<D extends object = {}> = 
//     Column<D> & 
//     UseFiltersColumnOptions<D> &
//     UseSortByColumnOptions<D> & 
//     { 
//         className?:string;
//     };

// export const columnDef:ColumnDef<IPostData>[] = [

//     {
//         Header: 'Post Title',
//         accessor: 'title',
//         disableSortBy: true,
//         className:styles["rs-title"],
//         Filter: DefaultColumnFilter,
//         Cell: (cell:CellProps<IPostData, string>) => {
//             return (<span>{truncEllipsis(cell.value,62)}</span>);
//         }
        
//     },
//     {
//         Header: 'Organization',
//         accessor: 'organization',
//         className:styles["rs-org"],
//         Filter: DefaultColumnFilter,
//         Cell: (cell:CellProps<IPostData, string>) => {
//             return (<span>{truncEllipsis(cell.value,42)}</span>);
//         }
//     },
//     {
//         Header: 'Location',
//         accessor: 'location',
//         className:styles["rs-loc"],
//         Filter: DefaultColumnFilter,
//     },
//     {
//         Header: 'Salary Info',
//         accessor: 'salary',
//         disableSortBy: true,
//         className:styles["rs-salary"],
//     },
//     {
//         Header: 'Post Desc.',
//         accessor: 'description',
//         disableSortBy: true,
//         className:styles["rs-desc"],
//         Filter: DefaultColumnFilter,
//         Cell: (cell:CellProps<IPostData, string>) => {
//             return (<span>{truncEllipsis(cell.value,110)}</span>);
//         }
//     },
//     {
//         Header: 'Updated Time',
//         accessor: 'captureTime',
//         sortType: sortAlpha,
//         className:styles["rs-time"],
//         Cell: (cell:CellProps<IPostData, Date>) => {
//             const rowData = cell.row.values;
//             return (
//                 <div>
//                     <span style={{display:"inline-block"}}>
//                         {formatLocaleDateString(cell.value)}
//                     </span>
//                     <span style={{display:"inline-block"}}>
//                         {rowData.postedTime}
//                     </span>
//                 </div>
//             );
//         }
//     },

//     // {
//     //     Header: '',
//     //     accessor: 'directURL',
//     //     className:styles["rs-link"],
//     //     Cell: (cell:CellProps<IPostData, string>) => {
//     //         return (<a href="{cell.value}" target={'_blank'}>Link</a>);
//     //     }
//     // },
// ];

// export const getColumnDef = () => [...columnDef];