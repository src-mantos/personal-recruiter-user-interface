import React, { useState, useEffect, Key } from 'react';

import { IPostData } from 'data-service/types';

import { useVirtualizer } from '@tanstack/react-virtual';

import { useRecoilValueLoadable, useRecoilValue, useRecoilState, useRecoilStateLoadable } from 'recoil';
import {  searchRequestState } from '../contexts/SearchContext';

import DataStyles from '../../styles/Components/PostDataList.module.scss';
import { truncEllipsis } from '../FormUtils';
import { postDataState } from '../contexts/EditorContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink, faCircle } from '@fortawesome/free-solid-svg-icons';
import { PostDataProps } from '../types';


const PostDataListItem = ( props:PostDataProps ) => {
    const { record, altMessage, selected, index, onClick } = props;
    const [searchQuery, setSearchQuery] = useRecoilState( searchRequestState );
    const addSort = ( sortField:string ) => () => {
        const sortList = ( searchQuery.sort === undefined )? []: [...searchQuery.sort];
        const sortInd = sortList.findIndex( ({ dataKey }) => dataKey===sortField );

        console.log("Sort Add:",{sortField,sortList,sortInd})

        if ( sortInd == -1 )
            setSearchQuery({
                ...searchQuery,
                sendRequest:true,
                sort: [
                    ...sortList, {
                        dataKey  : sortField,
                        direction: -1
                    }]
            });
        else
            setSearchQuery({
                ...searchQuery,
                sendRequest:true,
                sort: [
                    ...sortList.slice( 0, sortInd ),
                    {...sortList[sortInd], direction: sortList[sortInd].direction*-1},
                    ...sortList.slice( sortInd+1 )
                ]
            });

    };
    // console.log("LI props",props);

    if ( record !== undefined ){
        const { description, directURL, location, organization, postedTime, title, userModified, _id, captureTime, salary } = record;
        const displayTime = new Intl.DateTimeFormat( 'en-US', {
            year  : "2-digit",
            month : "numeric",
            day   : "numeric",
            hour  : "numeric",
            minute: "numeric",
            hour12: true,
        }).format( ( captureTime !== undefined )? new Date( captureTime ): new Date() );
        return (
            <div className={['card', 'columns', DataStyles['post-tile'], ( selected )?DataStyles['selected']:"" ].join( " " )} onClick={onClick}>
                <div className={['column is-vertical'].join( " " )}>

                    <div className={['columns', DataStyles['post-tile-header']].join( " " )}>
                        <div className={['column is-three-quarters', DataStyles['post-title']].join( " " )}>
                            {truncEllipsis( title, 53 )}
                        </div>
                        <div className={['column is-vertical'].join( " " )} style={{ padding: 0 }}>
                            <div className={[DataStyles['post-sub-title'], DataStyles['block']].join( " " )}
                                onClick={addSort( "organization" )}
                                style={{ paddingTop: "4px" }}>
                                {truncEllipsis( organization, 20 )}
                            </div>
                            {( organization != location )?(
                                <div className={[DataStyles['post-sub-title'], DataStyles['block']].join( " " )}
                                    onClick={addSort( "location" )}
                                    style={{ paddingBottom: "4px" }}>
                                    {truncEllipsis( location, 20 )}
                                </div>
                            ):""}
                        </div>

                        <div className={['column is-narrow is-vertical'].join( " " )} style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                            <a className={[DataStyles['block']].join( " " )}
                                onClick={addSort( "userModified" )}>
                                <FontAwesomeIcon icon={faCircle} style={{ color: ( userModified )?"green":"grey", fontSize: "1.1em" }}/>
                            </a>
                            <a className={[DataStyles['block']].join( " " )}>
                                <FontAwesomeIcon icon={faExternalLink} size={"1x"}/>
                            </a>
                        </div>
                    </div>

                    <div className={['columns', DataStyles['vtable-nopad']].join( " " )}>
                        <div className={['column is-three-quarters'].join( " " )}>
                            {truncEllipsis( description, 280 )}
                        </div>
                        <div className={['column is-one-quarter is-vertical'].join( " " )}>
                            {( captureTime !== undefined )? (
                                <div className={[DataStyles['block']].join( " " )}
                                    onClick={addSort( "captureTime" )}>
                                    {displayTime}
                                </div>
                            ):""}
                            {( postedTime !== undefined )? (
                                <div className={[DataStyles['block']].join( " " )}
                                    onClick={addSort( "postedTime" )}>
                                    {truncEllipsis( postedTime, 21 )}
                                </div>
                            ):""}
                            {( salary !== undefined )? (
                                <div>
                                    {truncEllipsis( salary, 20 )}
                                </div>
                            ):""}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={['card', 'columns', DataStyles['post-tile'], ( selected )? DataStyles['selected']:"" ].join( " " )} >
                <div className={['column is-vertical'].join( " " )}>
                    {altMessage}
                </div>
            </div>
        );
    }

};

export default PostDataListItem;
