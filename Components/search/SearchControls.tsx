import React, { useEffect, useRef, useState } from 'react';
import { ActiveScrapeRequest, FilterSet, UserSearchFilter, SearchFilter, StylableComponent } from '../types';
import FormStyles from '../../styles/Components/Form.module.scss';

import { IPostData, IPostMetaData, ISearchQuery, ISearchFilter, IVendorMetadata, IPostDataIndex, FilterOperation } from 'data-service/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faSearch, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState } from 'recoil';
import { searchRequestState } from '../contexts/SearchContext';

/* simple compare func */
const isFilterEqual = ( lhs:ISearchFilter, rhs:ISearchFilter ) => lhs.dataKey == rhs.dataKey && lhs.operation == rhs.operation && lhs.value == rhs.value;

const SearchControls = ( props:StylableComponent ) => {
    const [searchQuery, setSearchQuery] = useRecoilState( searchRequestState );
    /* using the composite select state & boolean value object for this state */
    const [filterState, setFilter] = useState<UserSearchFilter>({ ...FilterSet[0], value: true });
    const filterInput = useRef<HTMLInputElement>( null );

    const updateFilterState=( event:React.ChangeEvent<HTMLSelectElement> ) => {
        const index = parseInt( event.currentTarget.value );
        setFilter({ ...filterState, ...FilterSet[index] });
    };

    const getCurrentFilter = ( ) => {
        let filterValue:boolean|string;
        //TODO: add in date time processing for before/after
        if ( filterState.operation == FilterOperation.REGEX || filterState.operation == FilterOperation.IN )
            filterValue = ( filterInput !== null && filterInput.current !== null )?filterInput.current.value : "";
        else
            filterValue = filterState.value;

        let userFilters = ( searchQuery.filters !== undefined )?[...searchQuery.filters] : [];
        if ( filterValue !== "" ){
            let dup = false;
            const newFilter:ISearchFilter = { ...filterState, value: filterValue };

            for ( let filter of userFilters )
                if ( isFilterEqual( newFilter, filter ) )
                    dup=true;

            if ( !dup )
                userFilters.push( newFilter );
        }

        return userFilters;
    };

    const keywordHandler = ( event:React.ChangeEvent<HTMLInputElement>|React.KeyboardEvent<HTMLInputElement> ) => {
        const val = event.currentTarget.value;
        if ( event.type === 'change' ){
            setSearchQuery({ ...searchQuery, keywords: val });
        } else {
            const ev = event as React.KeyboardEvent<HTMLInputElement>;
            if ( ['Tab', 'Enter'].indexOf( ev.key ) !== -1 ){
                setSearchQuery({ ...searchQuery, keywords: val });
                if ( ev.key === 'Enter' )
                    searchAction();
            }
        }
    };

    const filterHandler = ( event:React.KeyboardEvent<HTMLInputElement> ) => {
        if ( event.key === 'Enter' || event.key === 'Tab' )
            if ( event.key === 'Enter' )
                setSearchQuery({ ...searchQuery, filters: getCurrentFilter( ), sendRequest: true });
            else
                setSearchQuery({ ...searchQuery, filters: getCurrentFilter( ) });

    };

    const searchAction = () => {
        setSearchQuery({ ...searchQuery, sendRequest: true });
    };

    const recordCount = searchQuery.dataset?.length;
    return (
        <div className={['column is-vertical is-half', 'control'].join( " " )} style={{ paddingTop: 0 }}>
            <div className={['columns', FormStyles["no-margin"], FormStyles["search-column-pad"]].join( " " )} style={{ marginBottom: 0 }}>
                <div className={['column'].join( " " )} >
                    <input type="text"
                        className={['input control column'].join( " " )}
                        placeholder="Search Terms"
                        onChange={keywordHandler}
                        onKeyDown={keywordHandler}
                    />
                    {( recordCount !== undefined )?(
                        <label style={{ position: "absolute", top: 15, right: 85 }}>{recordCount} found</label>
                    ):""}
                </div>
                <div className={['column is-narrow'].join( " " )} >
                    <a className={['button control'].join( " " )}
                        style={{ paddingLeft: "14px", paddingRight: "14px" }}
                        onClick={searchAction}
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </a>
                </div>
            </div>

            <div className={['columns', FormStyles["no-margin"], FormStyles["search-column-pad"]].join( " " )} >
                <div className={['column'].join( " " )} >
                    <div className={['select is-link'].join( " " )} style={{ width: "100%" }}>
                        <select style={{ width: "100%" }} onChange={updateFilterState}>
                            {FilterSet.map( ({ label, dataKey, operation }:SearchFilter, index:number ) => (
                                <option key={"Filter-"+dataKey}
                                    value={index}
                                >{label}</option>
                            ) )}
                        </select>
                    </div>
                </div>

                <div className={['column is-narrow'].join( " " )} style={{ lineHeight: "2.6em" }}>
                    {( () => {
                        let text = "";
                        switch ( filterState.operation ){
                            case FilterOperation.REGEX:
                            case FilterOperation.IN:
                                text = "matches";
                                break;
                            case FilterOperation.BOOL:
                                text = ( filterState.value )?"includes":"excludes";
                                break;
                            case FilterOperation.BEFORE:
                                text = "before";
                                break;
                            case FilterOperation.AFTER:
                                text = "after";
                                break;
                            default:
                        }
                        return (
                            <div style={{ width: "55px" }}>
                                {text}
                            </div>
                        );
                    })()}
                </div>

                <div className={['column'].join( " " )} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                    {( filterState.operation == FilterOperation.BOOL )?(
                        <a onClick={() => {
                            setFilter({ ...filterState, value: !( filterState.value ) });
                        }}>
                            <FontAwesomeIcon
                                icon={( filterState.value )?faToggleOn:faToggleOff}
                                style={{ fontSize: "2em", marginLeft: ".5em" }}
                            />
                        </a>
                    ):""}
                    {( filterState.operation == FilterOperation.REGEX || filterState.operation == FilterOperation.IN )?(
                        <input type="text" title={"Enter a Regex query or comma separated values"}
                            ref={filterInput}
                            className={['input control'].join( " " )}
                            placeholder={"Filter Word"}
                            onKeyDown={filterHandler}
                        />
                    ):""}
                    {( filterState.operation == FilterOperation.BEFORE || filterState.operation == FilterOperation.AFTER )?(
                        <input type="datetime-local" title={"Enter a filtering date"}
                            ref={filterInput}
                            className={['input control'].join( " " )}
                            placeholder={"Before / After"}
                            onKeyDown={filterHandler}
                        />
                    ):""}

                </div>

                <div className={['column is-narrow'].join( " " )} >
                    <a className={['button control'].join( " " )}
                        style={{ paddingLeft: "14px", paddingRight: "14px" }}
                        onClick={() => {
                            setSearchQuery({ ...searchQuery, filters: getCurrentFilter( ), sendRequest: true });
                        }}
                    >
                        <FontAwesomeIcon icon={faAdd} />
                    </a>
                </div>
            </div>
        </div>
    );
};
export default SearchControls;