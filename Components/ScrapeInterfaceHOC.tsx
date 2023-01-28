import React, { useEffect, useState } from 'react';
import { ActiveScrapeRequest, StylableComponent } from './types';
import styles from '../styles/Components/Form.module.scss';
import { IScrapePostDataRequest, IScrapeRequest } from 'data-service/types';
import { useRecoilState, useRecoilValue } from 'recoil';
import { runScrapeQueueSelector, scrapeQueueState, scrapeRequestState } from './contexts/ScrapeContext';
import PrimaryScrapeForm from './ScrapeComponents/PrimaryScrapeForm';
import AuxScrapeForm from './ScrapeComponents/AuxScrapeForm';
import RequestTile from './ScrapeComponents/RequestTile';
import { onKeyPress } from './FormUtils';


const ScrapeInterfaceHOC = (props?:StylableComponent) => { 
    const request = useRecoilValue(scrapeRequestState);
    const [queueState, setQueueState] = useRecoilState(scrapeQueueState);
    const [startQueue, runQueue] = useRecoilState(runScrapeQueueSelector);

    const hasProgress =  queueState[0] !== undefined && queueState[0].metrics !== undefined && queueState[0].metrics.length > 0;
    const [isRunning, setRunning] = useState(hasProgress);
    const queueButtonStyle:React.CSSProperties = {
        display: (isRunning)?'none':'initial'
    };
    useEffect(()=>{
        if(request.sendRequest){
            setRunning(true);
            setTimeout(()=>{
                setQueueState([...queueState]);
            }, 100);
        }
        if(startQueue.sendRequest){
            setRunning(true);
            const activeTimer = setInterval(()=>{
                setQueueState([...queueState]);
            }, 1000 * 10);
            return ()=>{
                clearInterval(activeTimer);
            };
        }
    },[request, queueState, setQueueState, startQueue]);

    const execute = ()=>{
        runQueue({ sendRequest:true });
    };
    
    return (
        <div className={['tile is-ancestor', styles["scrape-background"],  props?.className].join(" ")}>
            <div className={['tile is-parent is-vertical'].join(" ")}>
                <div className={['tile is-child'].join(" ")} style={{ margin:"0px !important" }}>
                    <span style={{ paddingLeft:"0.75rem" }}>Scrape Job Post Data</span>
                </div>
                <div className={['tile is-child', 'columns', styles["scrape-column-height"]].join(" ")}>

                    <PrimaryScrapeForm></PrimaryScrapeForm>

                    <AuxScrapeForm></AuxScrapeForm>

                    <div className={['column is-narrow'].join(" ")}
                        style={{ backgroundColor:"#a9a9a9",padding:0, width:1, height: "75px" }}></div>

                    <div className={['column columns'].join(" ")} style={{ overflowX:"auto", overflowY:"hidden" }}>
                        <div className={['column','is-flex-grow-0'].join(" ")} style={queueButtonStyle}>
                            <div className={['control'].join(" ")} style={{ height:"100%" }}>
                                <div className={['button is-primary is-fullwidth is-flex-grow-1'].join(" ")} 
                                    style={{ height:"100%",wordWrap:"break-word" }}
                                    tabIndex={5}
                                    onClick={execute}
                                    onKeyDown={onKeyPress(['Enter'],execute)}>
                                        Start Queue
                                </div>
                            </div>
                        </div>
                        <div className={['column columns'].join(" ")}>
                            {queueState.map((tile, i) => {
                                return (
                                    <div key={'tile-'+tile.uuid} className={['column','is-narrow'].join(" ")}>
                                        <RequestTile {...tile} ></RequestTile>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default ScrapeInterfaceHOC;

