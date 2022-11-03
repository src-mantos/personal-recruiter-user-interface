import { faSearch, faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import { getFilterColumns, FilterColumns } from "./SearchDisplayComponents//PostSearchForm";
import { onEnterHandler } from "./FormUtils";
import { searchRequestState, searchFilterState } from "./contexts/SearchContext";
import { StylableComponent } from "./types";
import styles from '../../styles/Components/Form.module.scss';
import { IPostData, IPostMetaData, ISearchQuery, ISearchFilter, IVendorMetadata, IPostDataIndex } from 'data-service/types';


const SearchInterfaceHOC = (props:StylableComponent) => {
    const [searchQuery, setSearchQuery] = useRecoilState(searchRequestState);
    const [searchFilters, setFilters] = useRecoilState(searchFilterState);
    
    const keywords = useRef<HTMLInputElement>(null);
    const SearchPosts:{():void} = () => {
        if(keywords.current && keywords.current.value != ""){
            const req:ISearchQuery = {
                keywords: keywords.current.value
            };
            if( searchQuery?.keywords != req.keywords){
                setSearchQuery(req);
            }
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
        <div className={['tile is-ancestor', styles['app-border'], styles['app-border-top'], styles['app-border-break'], props.className].join(" ")}>
            <div className={['tile is-parent is-vertical'].join(" ")}>

                <div className={['tile is-child'].join(" ")} style={{ margin:"0px !important" }}>
                    <span style={{ paddingLeft:"0.75rem" }}>Post Data Search</span>
                </div>
                <div className={['tile is-child', 'columns'].join(" ")}>

                    <div className={['column is-vertical is-6','control'].join(" ")}>
                        <div className={['columns', styles["no-margin"]].join(" ")}>
                            <input type="text" 
                                ref={keywords}
                                className={['input control column'].join(" ")} 
                                placeholder='Search Terms'
                                onKeyDown={onEnterHandler(SearchPosts)} />

                            <button className={['input control column is-1'].join(" ")} style={{ width:"42px" }} onClick={SearchPosts} >
                                <FontAwesomeIcon icon={faSearch} style={{ paddingBottom:"5px" }} />
                            </button>
                        </div>
                        <div className={['columns', styles["no-margin"]].join(" ")} >
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

                            <span className={['control column is-1'].join(" ")} style={{ padding: "0.5em 0px" }}>
                                contains
                            </span>

                            <input type="text" ref={filterValue}
                                className={['input control column'].join(" ")} 
                                placeholder='Filter Term' />

                            <button className={['input control column is-1'].join(" ")} style={{ width:"42px" }} onClick={AddFilter} >
                                <FontAwesomeIcon icon={faAdd} style={{ paddingBottom:"5px" }}/>
                            </button>
                        </div>
                    </div>

                    <div className={['column control'].join(" ")}>
                        <span className={['tag'].join(" ")}>
                            location : Remote
                        </span>
                    </div>
                </div>

                {/* <div className={['tile is-parent', styles["pad-children"]].join(" ")}>
                    <input type="text" 
                        ref={keywords}
                        className={['input control'].join(" ")} 
                        placeholder='Search Terms'
                        onKeyDown={onEnterHandler(SearchPosts)} />

                    <button className={['input control'].join(" ")} style={{ width:"42px" }} onClick={SearchPosts} >
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div> */}
                
                {/* <div className={['tile is-parent', styles["pad-children"]].join(" ")}>
                    <div className='control select' style={{ width:"100%" }}>
                        <select ref={filterType} className={['input control select'].join(" ")} >
                            {getFilterColumns().map((col:FilterColumns, index:number)=>{
                                const { key,name } = col;
                                return (
                                    <option key={"Filter-"+key} value={key}>{name}</option>
                                );
                            })}
                        </select>
                    </div>

                    <span className={['control'].join(" ")} style={{ padding: "0.5em 0px" }}>
                        contains
                    </span>

                    <input type="text" ref={filterValue}
                        className={['input control'].join(" ")} 
                        placeholder='Filter Term' />

                    <button className={['input control '].join(" ")} style={{ width:"42px" }} onClick={AddFilter} >
                        <FontAwesomeIcon icon={faAdd} />
                    </button>
                </div> */}
            </div>
            {/* <div className={['tile is-parent is-5'].join(" ")}>
                <span className={['tag'].join(" ")}>
                    location : Remote
                </span>
            </div> */}
        </div>
    );
};
export default SearchInterfaceHOC;