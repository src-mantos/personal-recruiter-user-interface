import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, useMemo, useCallback, useReducer } from 'react';

import { IPostDataScrapeRequest } from 'data-service/types';
import { urlBuilder } from '../_utils/FormUtils';
import { faBookmark, faCropSimple, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StylableComponent } from '../types';

import useDispatcherContext from '../_utils/DispatcherContext';
import ResultPanel from './_table/PostResultPanel';
import EditorPanel from '../_editor/EditorPanel';
import SplitPanel from './SplitPanel';
import PostSearchForm from './_form/PostSearchForm';




const SearchManagementComponent = (props:StylableComponent) => {

    return (
        <div className={['tile is-ancestor is-vertical', props.className ].join(" ")}>
            <div className={['tile is-parent'].join(" ")}>
                <PostSearchForm></PostSearchForm>
            </div>
            <div className={['tile is-parent'].join(" ")}>
                <SplitPanel></SplitPanel>
            </div>
        </div>
    );
};

export default SearchManagementComponent;