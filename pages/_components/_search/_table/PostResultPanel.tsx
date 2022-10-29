/* eslint-disable indent */
import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, ChangeEvent, ComponentType, PureComponent, Key } from 'react';

import styles from '../../../../styles/_components/_search/PostResultPanel.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { IPostData } from 'data-service/types';
import { matchSorter } from 'match-sorter';

import GetPostTableConfig from './GetPostTableConfig';
import { StylableComponent } from '../../types';
import useDispatcherContext from '../../_utils/DispatcherContext';
// import { useReactTable, getCoreRowModel, flexRender, Row, Cell, ColumnDef } from '@tanstack/react-table';
import { useRecoilValueLoadable, useRecoilValue } from 'recoil';
import { searchRequestState, searchResultState } from '../../_utils/_dispatchers/SearchContext';
// import { FixedSizeList, FixedSizeListProps, ListChildComponentProps, FixedSizeGrid, FixedSizeGridProps, GridChildComponentProps} from 'react-window';
import { truncEllipsis } from '../../_utils/FormUtils';
import DataGrid, { Column, HeaderRendererProps, RowRendererProps, useFocusRef } from 'react-data-grid';


interface Filter extends Omit<IPostData, 'id' | 'complete'> {
  complete: number | undefined;
  enabled: boolean;
}

interface ChildFilter<T> {
  children: (args: {
    ref: React.RefObject<T>;
    tabIndex: number;
    filters: Filter;
  }) => React.ReactElement;
}

function FilterRenderer<R, SR, T extends HTMLOrSVGElement>({
  isCellSelected,
  column,
  children
}: HeaderRendererProps<R, SR> & ChildFilter<T> ) {
//   const filters = useContext(FilterContext)!;
  const { ref, tabIndex } = useFocusRef<T>(isCellSelected);
    const filters:Filter ={
        complete: undefined,
        enabled: false,
        directURL: '',
        captureTime: new Date(),
        title: '',
        organization: '',
        location: '',
        description: '',
        postedTime: ''
    };
  return (
    <>
      <div>{column.name}</div>
      <div>{children({ ref, tabIndex, filters })}</div>
      {/* {filters.enabled && <div>{children({ ref, tabIndex, filters })}</div>} */}
    </>
  );
}

const RowRenderer = (key: Key, props: RowRendererProps<IPostData, any>):React.ReactNode => {
    console.log("RowRendererProps", props);
    
    return(<span key={key}></span>);
};

export const columns: readonly Column<IPostData>[] = [
        {
            key: 'title',
            name: 'Post Title',
            headerRenderer: (p) => (
                <FilterRenderer<IPostData, unknown, HTMLInputElement> {...p}>
                    {({ filters, ...rest }) => (
                    <input
                        {...rest}
                    />
                    )}
                </FilterRenderer>
            )
        },
        {
            key: 'organization',
            name: 'Organization'
        },
        {
            key: 'location',
            name: 'Location'
        },
        {
            key: 'description',
            name: 'Post Desc.'
        },
        {
            key: 'captureTime',
            name: 'Updated Time',
        },
        {
            key: 'salary',
            name: 'Salary Info',
        }
    ];


const PostResultPanel = (props:any) => {
    
        

    const userRequest = useRecoilValue(searchRequestState);
    const loadableData = useRecoilValueLoadable(searchResultState);
    const [dataset,setDataset] = useState<IPostData[]>([]);
    // const dataType:IPostData[] = [];
    // const [tableProps, setTableProps] = useState<FixedSizeListProps>({
    //     itemCount: 0,
    //     itemSize: 25,
    //     width: "100%",
    //     height: 600,
    //     itemData: [],
    //     children: RowRenderer,
    // });
    
    useEffect(()=>{
        if(userRequest != undefined && loadableData.state == 'hasValue' && loadableData.contents != undefined){
            setDataset( loadableData.contents );
        }
    },[userRequest,loadableData]);
    
    const tableProps:any = {
        height: 600, 
        rowHeight: 25, 
        rowCount:0, 
        width: 600,
        headerHeight: 30,
        className: 'tile is-child is-flex is-flex-direction-column',
    };
    
    return (
        <div className='tile is-child'>
            <DataGrid columns={columns} rows={dataset} headerRowHeight={55} ></DataGrid>
        </div>
        
    );
    //renderers={{rowRenderer:RowRenderer}}
};

export default PostResultPanel;
