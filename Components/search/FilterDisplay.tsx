import { faSearch, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FilterOperation, ISearchFilter, ISort } from "data-service/types";
import { CSSProperties, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { searchFilterSelector, searchRequestState } from "../contexts/SearchContext";
import { UserSearchFilter } from "../types";


const FilterDisplay = () => {
    // const [searchFilters, setUserFilters] = useRecoilState( searchFilterState );
    const [searchQuery, setSearchQuery] = useRecoilState( searchRequestState );
    const sortedFilters = useRecoilValue( searchFilterSelector );
    const sortList = ( searchQuery.sort===undefined )? []:searchQuery.sort;

    if ( sortedFilters.length == 0 && sortList.length == 0 )
        return (
            <div className={['column'].join( " " )}>
                No Filters
            </div>
        );

    const RemoveFilter = ( filter:UserSearchFilter ) => () => {
        const { filters } = searchQuery;
        if ( filters !== undefined ){
            const updatedFilters = filters.filter( ( elem:ISearchFilter ) => !( elem.dataKey === filter.dataKey && elem.value == filter.value ) );
            setSearchQuery({ ...searchQuery, filters: updatedFilters, sendRequest: true });
        }
    };

    const RemoveSort = ( sortObj:ISort ) => () => {
        setSearchQuery({
            ...searchQuery,
            sort       : sortList.filter( ({ dataKey }) => dataKey !== sortObj.dataKey ),
            sendRequest: true
        });
    };

    return (
        <div className={['tile is-ancestor is-vertical'].join( " " )} style={{ marginTop: 0 }}>
            {sortedFilters.map( ( row ) => (
                <div key={'FilterRow'}
                    className={['tile is-parent'].join( " " )}
                    style={{ padding: "0px 12px" }}
                >
                    {row.map( ( filter ) => {
                        let displayBool = ( filter.value )?"True":"False";
                        return (
                            <div key={"filter-"+filter.dataKey}
                                className={['tag', 'is-child', 'columns'].join( " " )}
                                style={{
                                    margin: "1px 5px",
                                    border: "1px solid #ccc"
                                }}>
                                <div className={['column'].join( " " )}
                                    style={{ letterSpacing: "-.2px", padding: "0", minWidth: "120px" }}
                                >
                                    {filter.label} : {( filter.operation == FilterOperation.BOOL )?displayBool:filter.value}
                                </div>
                                <div className={['column is-narrow'].join( " " )}
                                    style={{ margin: 0, padding: "0" }}>
                                    <button className="delete is-small" onClick={RemoveFilter( filter )}></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) )}
            <div key={'FilterRow'}
                className={['tile is-parent'].join( " " )}
                style={{ padding: "0px 12px" }}
            >
                {sortList.map( ({ dataKey, direction }) => (
                    <div key={"sort-"+dataKey}
                        className={['tag', 'is-child', 'columns'].join( " " )}
                        style={{
                            margin: "1px 5px",
                            border: "1px solid #ccc"
                        }}>
                        <div className={['column'].join( " " )}
                            style={{ letterSpacing: "-.2px", padding: "0", minWidth: "120px" }}
                        >
                            {dataKey} : {( direction > 0 )? 'asc':'desc'}
                        </div>
                        <div className={['column is-narrow'].join( " " )}
                            style={{ margin: 0, padding: "0" }}>
                            <button className="delete is-small" onClick={RemoveSort({ dataKey, direction })}></button>
                        </div>
                    </div>
                ) )}
            </div>
        </div>
    );
};
export default FilterDisplay;