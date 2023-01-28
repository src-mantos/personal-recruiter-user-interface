import { faSearch, faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import { onEnterHandler } from "./FormUtils";
import { searchRequestState } from "./contexts/SearchContext";
import { StylableComponent } from "./types";
import styles from '../styles/Components/Form.module.scss';
import { IPostData, IPostMetaData, ISearchQuery, ISearchFilter, IVendorMetadata, IPostDataIndex } from 'data-service/types';
import KeywordSearchForm from "./SearchComponents/KeywordSearchForm";
import FilterDisplay from "./SearchComponents/FilterDisplay";


const SearchInterfaceHOC = (props:StylableComponent) => {
    
    return (
        <div className={['tile is-ancestor', styles['app-border'], styles['app-border-top'], styles['app-border-break'], props.className].join(" ")}>
            <div className={['tile is-parent is-vertical'].join(" ")}>

                <div className={['tile is-child'].join(" ")} style={{ margin:"0px !important" }}>
                    <span style={{ paddingLeft:"0.75rem" }}>Post Data Search</span>
                </div>
                <div className={['tile is-child', 'columns'].join(" ")}>

                    <KeywordSearchForm></KeywordSearchForm>

                    <FilterDisplay></FilterDisplay>
                </div>
            </div>
        </div>
    );
};
export default SearchInterfaceHOC;