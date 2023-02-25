import React from 'react';

import { IPostData } from 'data-service/types';

import { useVirtualizer } from '@tanstack/react-virtual';

import { useRecoilValueLoadable, useRecoilValue, useRecoilState, useRecoilStateLoadable } from 'recoil';
import {  postDisplayListState, searchRequestState } from '../contexts/SearchContext';

import DataStyles from '../../styles/Components/PostDataList.module.scss';
import { truncEllipsis } from '../FormUtils';
import { remotePostDataState } from '../contexts/EditorContext';
import PostDataListItem from './PostDataListItem';
import { PostDataProps } from '../types';


const PostDataList = ( props: {height:number}) => {
    const parentRef = React.useRef<HTMLDivElement>( null );
    const [viewData, setDataset] = useRecoilState<PostDataProps[]>( postDisplayListState );
    const [editContext, setContext] = useRecoilState( remotePostDataState );

    const setRecord = ( post:Partial<IPostData>, index:number ) => {
        console.log( "setRecord", { record: post, index });
        setContext({ ...editContext, record: post, index });
    };

    // The virtualizer
    const rowVirtualizer = useVirtualizer({
        count           : ( viewData === undefined )? 1: viewData.length,
        getScrollElement: () => ( parentRef.current === undefined )? null : parentRef.current,
        estimateSize    : () => 165,
    });


    const unSelectMapping = ( entity:PostDataProps ) => {
        return { ...entity, selected: false };
    };
    const clickRow = ( index:number ) => ( event?:React.MouseEvent ) => {
        const entity = viewData[index];

        if ( entity.selected ){
            setRecord({}, index );
            setDataset( [
                ...viewData.map( unSelectMapping ),
            ] );
        } else if ( entity.record !== undefined ){
            setRecord( entity.record, index );
            setDataset( [
                ...viewData.slice( 0, index ).map( unSelectMapping ),
                { ...entity, selected: true },
                ...viewData.slice( index+1 ).map( unSelectMapping )
            ] );
        }
        // console.log({ entity, index });
    };

    return (
        <div ref={parentRef} className={[DataStyles["vtable-viewport"]].join( " " )} style={{ height: props.height }}>
            <div className={[DataStyles["vtable-canvas"]].join( " " )}
                style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            >

                {rowVirtualizer.getVirtualItems().map( ( virtualItem ) => (
                    <div className={[DataStyles['vtable-row']].join( " " )}
                        key={virtualItem.key}
                        style={{
                            height   : `${virtualItem.size}px`,
                            transform: `translateY(${virtualItem.start+10}px)`,
                        }}>

                        <PostDataListItem {...viewData[virtualItem.index]}
                            onClick={clickRow( virtualItem.index )}
                        ></PostDataListItem>

                    </div>
                ) )}

            </div>
        </div>
    );



};

export default PostDataList;
