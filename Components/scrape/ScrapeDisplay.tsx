import React, { useCallback, useEffect, useState } from 'react';
import { ActiveScrapeRequest, StylableComponent, DelayedTask, AsyncState } from '../../Components/types';
import FormStyles from '../../styles/Components/Form.module.scss';
import HudStyles from '../../styles/Components/ScrapeHUD.module.scss';
import tileStyle from '../../styles/Components/ScrapeTile.module.scss';
import { IScrapePostDataRequest, IScrapeRequest } from 'data-service/types';
import { useRecoilState, useRecoilValue } from 'recoil';
import {  scrapeRequestState, queueState, runQueueState } from '../../Components/contexts/ScrapeContext';
import { inputFocusSelectAll, onKeyPress } from '../../Components/FormUtils';
import { faSearch, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ScrapeControls from './ScrapeControls';
import ScrapeTile from './ScrapeTile';



const ScrapeDisplay = ( props?:StylableComponent ) => {
    const [queueObj, setQueueState] = useRecoilState( queueState );
    const [runObj, setRunState]  = useRecoilState( runQueueState );

    //initialize periodic load of the queue
    useEffect( () => {
        const updateTimer = setInterval( () => { setQueueState({ ...queueObj, sendRequest: true }) }, 60000 );
        setQueueState({ ...queueObj, sendRequest: true });
        //is there a better way to synchronize atoms?
        if ( queueObj.queue[0]?.metrics !== undefined )
            setRunState({ ...runObj, isRunning: true });

        return () => {
            clearInterval( updateTimer );
        };
    }, [] );


    const queueButtonStyle:React.CSSProperties = { display: ( runObj.isRunning )?'none':'initial' };
    return (
        <div className={['columns'].join( " " )}>

            <div className={['control column is-narrow'].join( " " )} style={queueButtonStyle}>
                <button
                    className={['button is-primary'].join( " " )}
                    style={{ wordWrap: "break-word", fontSize: "1.1em", fontWeight: "bold", minHeight: "80px" }}
                    tabIndex={5}
                    onClick={() => {
                        setRunState({ ...runObj, isRunning: true, sendRequest: true });
                        setTimeout( () => {
                            if ( runObj.asyncState == AsyncState.Error )
                                // if the run state returns an error state reset
                                setRunState({ ...runObj, isRunning: false });

                        }, 60000 );
                    }}
                >
                    Start Queue
                </button>
            </div>

            {queueObj.queue.map( ( tile, i ) => (
                <div key={'tile-'+tile.uuid} className={['column', 'is-narrow'].join( " " )}>
                    <ScrapeTile {...tile} ></ScrapeTile>
                </div>
            ) )}

        </div>
    );
};
export default ScrapeDisplay;