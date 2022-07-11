import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, useCallback } from 'react';
import styles from '../../../styles/search/Layout.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { IPostDataSearchRequest, IPostData } from 'data-service/types';
import ResultPanel from './ResultPanel';
import EditorPanel, { EditorPanelProps } from './EditorPanel';

import useSWR from "swr";

const fetcher:{(url:string):Promise<any>} = (url) => fetch(url).then(res => res.json());

interface AnyMap { [key: string]: any }
export interface FavoritesProps extends AnyMap {
    className?: string;
    
}
enum View {
    Search = "Search",
    Favorites = "Favorites"
}

const Layout = (props:FavoritesProps) => {
    const [view, setView] = useState<View>(View.Search);
    const [dataset, setDataset] = useState<IPostData[]>([]);
    
    const tabFactory = (refView: View) => {
        return (event: React.MouseEvent)=>{
            const el = event.target as HTMLElement;
            if( !el.classList.contains("is-active") ){
                setView(refView);
            }
        };
    };
    const searchTextFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();
    const enterToSearch = (event: React.KeyboardEvent) => {
        if(event.key === 'Enter'){
            searchByView();
        }
    };


    const search = useRef<HTMLInputElement>(null);
    const [searchReq, setSearchReq] = useState<IPostDataSearchRequest>({keywords:""});
    const searchByView = () => {
        if( search.current?.value ){
            console.log("set search request");
            setSearchReq({...searchReq, keywords:search.current.value});
        }
        if(searchReq.keywords && searchReq.keywords.trim() != ""){
            RequestSearch();
        }
    };

    const RequestSearch = useCallback(async () => {
        try{
            const response:Response = await fetch("/api/data/search?keywords="+searchReq.keywords);
            console.log( searchReq.keywords, response.status );
            const results = await response.json();
            setDataset([...results]);
            console.log(dataset);
        }catch(ex){
            console.error(ex);
        }
            
    }, [searchReq, dataset]);    


    const testConfig = {
        key:"Rando",
        postData: {
            captureTime : new Date(),
            directURL : 'http://www.google.com',
            location : "somewhere",
            organization : "NoOne Corp",
            title : "Rando Job Title",
            salary : "$0.00",
            description : "lorem ipsum",
            postedTime: "23 days ago",
        }
    };

    return (
        <div className={['tile is-ancestor is-vertical',props.className, styles["layout"]].join(" ")}>
            <div className={['tile is-parent', styles["ctrl-bar"]].join(" ")}>
                <div className={['tile is-parent is-4 control'].join(" ")} style={{marginRight:"5px",paddingTop:"0px"}}>
                    <input type="text" 
                        className={['input control is-child'].join(" ")} 
                        ref={search}
                        placeholder='Search Terms'
                        onKeyUp={enterToSearch}
                        onFocus={searchTextFocus} />
                    <button className={['input control is-child'].join(" ")} style={{width:"42px"}} onClick={searchByView}>
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
            <div className={['tile is-parent', styles["data-view"]].join(" ")}>
                <div className={['tile is-parent'].join(" ")}>
                    <ResultPanel searchData={dataset} compact={false} />
                </div>
                <div className={['tile is-parent'].join(" ")}>
                    <EditorPanel {...testConfig} />
                </div>
            </div>
        </div>
    );
};

export default Layout;