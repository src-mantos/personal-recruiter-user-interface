import { faSearch, faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ISearchQuery } from "data-service/types";
import { onEnterHandler } from "../FormUtils";
import React, { useRef } from "react";
import { useRecoilState } from "recoil";
import styles from '../../../styles/Components/Form.module.scss';
import { searchFilterState, SearchQuery, searchRequestState } from "../contexts/SearchContext";
import { columns } from "../SearchDisplayComponents/PostResultPanel";

export interface FilterColumns {
    key : string;
    name : string | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}
export const getFilterColumns = ():FilterColumns[] => {
    return [...columns, {
        key: "tag",
        name: "Tag Name"
    }];
};

const KeywordSearchForm = () => {
    const [searchQuery, setSearchQuery] = useRecoilState(searchRequestState);
    const [searchFilters, setFilters] = useRecoilState(searchFilterState);

    const UpdateSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        setSearchQuery({ ...searchQuery, keywords:val });
    };
    
    const keywords = useRef<HTMLInputElement>(null);
    const SearchPosts:{():void} = () => {
        if(keywords.current && keywords.current.value != ""){
            setSearchQuery({ ...searchQuery, keywords:keywords.current.value, sendRequest:true });
        }
    };

    const filterType = useRef<HTMLSelectElement>(null);
    const filterValue = useRef<HTMLInputElement>(null);
    const AddFilter:{():void} = () => {
        if(filterType.current == undefined || filterValue.current == undefined) 
            return;
        
        setFilters([
            ...searchFilters,
            {
                key:filterType.current.value,
                name:filterType.current.value,
                value:filterValue.current.value,
            }
        ]);
    };
    return (
        <div className={['column is-vertical is-6','control'].join(" ")}>
            <div className={['columns', styles["no-margin"], styles["search-column-pad"]].join(" ")}>
                <div className={['column'].join(" ")} >
                    <input type="text" 
                        ref={keywords}
                        className={['input control column'].join(" ")} 
                        placeholder='Search Terms'
                        onKeyDown={onEnterHandler(SearchPosts)}
                        onChange={UpdateSearchQuery} />
                </div>
                <div className={['column is-narrow'].join(" ")} >
                    <button className={['input control column is-1'].join(" ")} style={{ width:"42px" }} onClick={SearchPosts} >
                        <FontAwesomeIcon icon={faSearch} style={{ paddingBottom:"5px" }} />
                    </button>
                </div>
            </div>
            <div className={['columns', styles["no-margin"], styles["search-column-pad"]].join(" ")} >
                <div className={['column'].join(" ")} >
                    <div className={['select is-link'].join(" ")} style={{ width:"100%" }}>
                        <select ref={filterType} 
                            style={{ padding: "5px 12px" }}
                            className={['input control select column'].join(" ")} >

                            {getFilterColumns().map((col:FilterColumns, index:number)=>{
                                const { key,name } = col;
                                return (
                                    <option key={"Filter-"+key} value={key}>{name}</option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                <div className={['column is-narrow'].join(" ")} >
                    <span style={{
                        marginTop: "0.5em",
                        display: "inline-block"
                    }}>
                        contains
                    </span>
                </div>

                <div className={['column'].join(" ")} >
                    <input type="text" ref={filterValue}
                        className={['input control'].join(" ")} 
                        placeholder='Filter Term'
                        onKeyDown={onEnterHandler(AddFilter)} />
                </div>

                <div className={['column is-narrow'].join(" ")} >
                    <button className={['input control'].join(" ")} style={{ width:"42px" }} onClick={AddFilter} >
                        <FontAwesomeIcon icon={faAdd} style={{ paddingBottom:"5px" }}/>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default KeywordSearchForm;