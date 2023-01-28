import { faSearch, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSProperties, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { searchFilterSelector, searchFilterState, searchRequestState, styleFilterSelector } from "../contexts/SearchContext";
import { UserSearchFilter } from "../types";


const FilterDisplay = () => {
    const [searchFilters, setUserFilters] = useRecoilState(searchFilterState);
    const [searchQuery, setSearchQuery] = useRecoilState(searchRequestState);
    const sortedFilters = useRecoilValue(searchFilterSelector);
    const colWidths = useRecoilValue(styleFilterSelector);
    console.log(sortedFilters, colWidths);

    if(searchFilters.length == 0) {
        return (
            <div className={['column'].join(" ")}>
                No Filters
            </div>
        );
    }
    const RemoveFilter = (filter:UserSearchFilter) => {
        return () => {
            for(let i=0; i<searchFilters.length; i++){
                const fltr = searchFilters[i];
                if(fltr.dataKey === filter.dataKey && fltr.value == filter.value){
                    const updatedFilters = searchFilters.slice(0,i).concat( (searchFilters.length == i+1)? [] : searchFilters.slice(i+1));
                    setUserFilters( updatedFilters );
                    setSearchQuery({...searchQuery,filters:updatedFilters, sendRequest:true});
                    break;
                }
            }
        };
    };
    return (
        <div className={['column is-vertical','tile is-ancestor'].join(" ")}
            style={{ overflowY:'inherit',overflowX:'hidden' }}>
            {sortedFilters.map((row, index)=>{
                return (
                    <div key={'FilterRow'+index}
                        className={['tile is-parent'].join(" ")}
                        style={{ paddingTop:0,paddingBottom:0, maxHeight:"30px" }}
                    >
                        {row.map((filter,index)=>(
                            <div key={"filter-"+index+"-"+filter.dataKey} 
                                className={['tag','is-child'].join(" ")}
                                style={{
                                    margin: "1px 5px", 
                                    border: "1px solid #ccc"
                                }}>
                                <div className={[].join(" ")}>{filter.label} : {filter.value}</div>
                                <div className={[].join(" ")} style={{ margin:0 }}>
                                    <button className="delete is-small" onClick={RemoveFilter(filter)}></button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
            {/* {searchFilters.map((filter,index)=>(
                <div key={"filter-"+index+"-"+filter.dataKey} 
                    className={['tag'].join(" ")}>
                    {filter.label} : {filter.value}
                </div>
            ))} */}
        </div>
    );
};
export default FilterDisplay;