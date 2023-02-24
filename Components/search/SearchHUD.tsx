import React, { useEffect, useState } from 'react';
import { ActiveScrapeRequest, FilterSet, SearchFilter, StylableComponent } from '../types';
import FormStyles from '../../styles/Components/Form.module.scss';

import { IPostData, IPostMetaData, ISearchQuery, ISearchFilter, IVendorMetadata, IPostDataIndex } from 'data-service/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchControls from './SearchControls';
import FilterDisplay from './FilterDisplay';


const SearchHUD = ( props:StylableComponent ) => (
    <div className={['tile is-ancestor', FormStyles['app-border'], FormStyles['app-border-top'], FormStyles['app-border-break'], props.className].join( " " )}>
        <div className={['tile is-parent is-vertical'].join( " " )}>

            <div className={['tile is-child'].join( " " )} style={{ marginBottom: "0 !important" }}>
                <span style={{ paddingLeft: "0.75rem" }}>Post Data Search</span>
            </div>
            <div className={['tile is-child', 'columns'].join( " " )}>
                <SearchControls></SearchControls>
                {/* <KeywordSearchForm></KeywordSearchForm>

                    <FilterDisplay></FilterDisplay> */}
                <div className={['column is-vertical is-half', 'control'].join( " " )} 
                    style={{ overflow: "auto", maxHeight: "400px", padding: 0 }}>
                    <FilterDisplay></FilterDisplay>
                </div>
            </div>
        </div>
    </div>
);
export default SearchHUD;