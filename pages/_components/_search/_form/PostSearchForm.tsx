import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, useMemo, useCallback, useReducer } from 'react';

import { IPostDataSearchRequest } from 'data-service/types';
import { onEnterHandler, urlBuilder } from '../../_utils/FormUtils';
import { faBookmark, faCropSimple, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StylableComponent } from '../../types';

import useDispatcherContext from '../../_utils/DispatcherContext';
import { SearchActionType } from '../../_utils/_dispatchers/SearchDispatcher';


enum View {
    Search = "Search",
    Favorites = "Favorites"
}

const PostSearchForm = (props:StylableComponent) => {
    const {searchState,fireSearchAction:dispatcher} = useDispatcherContext();
    const {userRequest,postResultSet,filterCriteria,activePost} = searchState;

    const [view, setView] = useState<View>(View.Search);
    const tabFactory = (refView: View) => {
        return (event: React.MouseEvent)=>{
            const el = event.target as HTMLElement;
            if( !el.classList.contains("is-active") ){
                setView(refView);
            }
        };
    };
    const keywords = useRef<HTMLInputElement>(null);
    const SearchPosts:{():void} = () => {
        if(keywords.current && keywords.current.value != ""){
            const req:IPostDataSearchRequest = {
                keywords: keywords.current.value
            };
            dispatcher({ type: SearchActionType.ActionKeySearch, payload:req });
        }
    };
    
    return (
        <div className={['tile is-parent', props.className].join(" ")}>
            <div className={['tile is-parent is-4 control'].join(" ")} style={{marginRight:"5px",paddingTop:"0px"}}>
                <input type="text" 
                    ref={keywords}
                    className={['input control is-child'].join(" ")} 
                    placeholder='Search Terms'
                    onKeyDown={onEnterHandler(SearchPosts)} />
                <button className={['input control is-child'].join(" ")} style={{width:"42px"}} onClick={SearchPosts} >
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>
            
            <div className={['tile is-child control tabs is-boxed'].join(" ")}>
                <ul>
                    <li onClick={tabFactory(View.Search)} className={(view == View.Search)? 'is-active':''}>
                        <a>
                            <span style={{marginRight:"5px"}}>{View.Search}</span>
                            <FontAwesomeIcon icon={faSearch} />
                        </a>
                    </li>
                    <li onClick={tabFactory(View.Favorites)} className={(view == View.Favorites)? 'is-active':''}>
                        <a>
                            <span style={{marginRight:"5px"}}>{View.Favorites}</span>
                            <FontAwesomeIcon icon={faBookmark} />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default PostSearchForm;