import { faSearch, faAdd, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FilterOperation, ISearchQuery } from "data-service/types";
import { onEnterHandler } from "../FormUtils";
import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import styles from '../../styles/Components/Form.module.scss';
import { searchFilterState, searchRequestState } from "../contexts/SearchContext";

import { FilterSet, UserSearchFilter, SearchFilter } from '../types';

const KeywordSearchForm = () => {
    const [searchQuery, setSearchQuery] = useRecoilState( searchRequestState );

    const UpdateSearchQuery = ( event: React.ChangeEvent<HTMLInputElement> ) => {
        const val = event.target.value;
        setSearchQuery({ ...searchQuery, keywords: val });
    };

    const keywords = useRef<HTMLInputElement>( null );
    const SearchPosts:{():void} = () => {
        if ( keywords.current && keywords.current.value != "" )
            setSearchQuery({ ...searchQuery, keywords: keywords.current.value, sendRequest: true });

    };

    return (
        <div className={['column is-vertical is-6', 'control'].join( " " )}>
            <div className={['columns', styles["no-margin"], styles["search-column-pad"]].join( " " )}>
                <div className={['column'].join( " " )} >
                    <input type="text"
                        ref={keywords}
                        className={['input control column'].join( " " )}
                        placeholder="Search Terms"
                        onKeyDown={onEnterHandler( SearchPosts )}
                        onChange={UpdateSearchQuery} />
                </div>
                <div className={['column is-narrow'].join( " " )} >
                    <button className={['input control column is-1'].join( " " )} style={{ width: "42px" }} onClick={SearchPosts} >
                        <FontAwesomeIcon icon={faSearch} style={{ paddingBottom: "5px" }} />
                    </button>
                </div>
            </div>
            <FilterForm></FilterForm>
        </div>
    );
};
export default KeywordSearchForm;



const FilterForm = () => {
    const [selectedFilter, setSelectedFilter] = useState<SearchFilter>( FilterSet[0] );
    const [searchFilters, setUserFilters] = useRecoilState<UserSearchFilter[]>( searchFilterState );
    const [userModified, setModifiedFilter] = useState<boolean>( false );
    const [searchQuery, setSearchQuery] = useRecoilState( searchRequestState );

    const filterType = useRef<HTMLSelectElement>( null );
    const filterValue = useRef<HTMLInputElement>( null );
    const AddFilter:{():void} = () => {
        if ( ( filterType.current == null || filterValue.current == null ) &&
            selectedFilter.operation !== FilterOperation.BOOL )
            return;

        let setValue;
        if ( selectedFilter.operation === FilterOperation.BOOL )
            setValue = ( userModified )? "Included":"Excluded";
        else if ( filterValue.current !== null )
            setValue = filterValue.current.value;


        if ( setValue !== undefined ){
            const newFilter = [
                ...searchFilters,
                {
                    ...selectedFilter,
                    value: setValue,
                }
            ];
            setUserFilters( newFilter );
            setSearchQuery({ ...searchQuery, filters: newFilter, sendRequest: true });
        }
    };

    let qualifier, filterTitle, placeText;
    switch ( selectedFilter.operation ){
        case ( FilterOperation.BOOL ):
            qualifier = 'are';
            filterTitle = "is true or false";
            break;
        case ( FilterOperation.REGEX ):
            qualifier = 'contains';
            filterTitle = "a regex filter, assumes .*(filter).*";
            placeText = 'Required Keyword';
            break;
        case ( FilterOperation.IN ):
            qualifier = 'has';
            filterTitle = "comma separated Post Id's";
            placeText = 'UUID Lookup';
            break;
    }
    return (
        <div className={['columns', styles["no-margin"], styles["search-column-pad"]].join( " " )} >
            <div className={['column'].join( " " )} >
                <div className={['select is-link'].join( " " )} style={{ width: "100%" }}>
                    <select ref={filterType}
                        style={{ padding: "5px 12px" }}
                        className={['input control select column'].join( " " )}
                        onChange={( event ) => {
                            const setFilter = FilterSet.find( ( filter ) => {
                                if ( filter.dataKey === event.target.value )
                                    return true;
                                return false;
                            });
                            if ( setFilter !== undefined )
                                setSelectedFilter( setFilter );
                        }}>

                        {FilterSet.map( ( col, index:number ) => {
                            const { label, dataKey } = col;
                            return (
                                <option key={"Filter-"+dataKey} value={dataKey}>{label}</option>
                            );
                        })}
                    </select>
                </div>
            </div>

            <div className={['column is-narrow'].join( " " )} >
                <span style={{
                    marginTop: "0.5em",
                    display  : "inline-block",
                    minWidth : 55
                }}>
                    {qualifier}
                </span>
            </div>

            <div className={['column'].join( " " )} >
                {( FilterOperation.BOOL == selectedFilter.operation )? (
                    <div className={['columns'].join( " " )}>
                        <div className={['column is-narrow'].join( " " )}>
                            <FontAwesomeIcon size="2x" icon={( userModified )? faToggleOn:faToggleOff}
                                onClick={() => setModifiedFilter( !userModified )}
                                title={( userModified )? "only include user modified results":"only include raw results"}
                            />
                        </div>
                        <div className={['column'].join( " " )}>
                            <span style={{
                                marginTop: "0.5em",
                                display  : "inline-block"
                            }}>
                                {( userModified )? "Included":"Excluded"}
                            </span>
                        </div>
                    </div>
                ):(
                    <input type="text" ref={filterValue} title={filterTitle}
                        className={['input control'].join( " " )}
                        placeholder={placeText}
                        onKeyDown={onEnterHandler( AddFilter )} />
                )}

            </div>

            <div className={['column is-narrow'].join( " " )} >
                <button className={['input control'].join( " " )} style={{ width: "42px" }} onClick={AddFilter} >
                    <FontAwesomeIcon icon={faAdd} style={{ paddingBottom: "5px" }}/>
                </button>
            </div>
        </div>
    );
};