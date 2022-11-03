import { faSearch, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { inputFocusSelectAll, onEnterHandler, formatLocaleDateString } from './FormUtils';
import { StylableComponent } from './types';
import styles from '../../styles/Components/Form.module.scss';
import { IScrapePostDataRequest, IScrapeRequest, ISearchQuery } from 'data-service/types';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { scrapeRequestState } from './contexts/ScrapeContext';
import PrimaryScrapeForm from './ScrapeComponents/PrimaryScrapeForm';
import AuxScrapeForm from './ScrapeComponents/AuxScrapeForm';
import RequestTile from './ScrapeComponents/RequestTile';


const ScrapeInterfaceHOC = (props?:StylableComponent) => { 
    const requestPageDepth = useRef<HTMLInputElement>(null);
    

    const noop=()=>{};
    const tileStubb = {
        uuid:'abcd-efg1-24nsl',
        requestTime: new Date(),
        keyword: "Full Stack Engineer",
        pageDepth: 2
    };
    const queueStubb:ActiveScrapeRequest[] = [{
        uuid: '1235987342374928',
        keyword: "query for scrape",
        location: "washington",
        pageDepth: 2,
        metrics:[{
            vendorDesc: "dummy1",
            numTotal: 10,
            numComplete: 3,
            pageSize: 10
        }]
    },{
        uuid: '1235987342374928',
        keyword: "query for scrape",
        location: "washington",
        pageDepth: 2
    }]
    return (
        <div className={['tile is-ancestor', styles["scrape-background"],  props?.className].join(" ")}>
            <div className={['tile is-parent is-vertical'].join(" ")}>
                <div className={['tile is-child'].join(" ")} style={{ margin:"0px !important" }}>
                    <span style={{ paddingLeft:"0.75rem" }}>Scrape Job Post Data</span>
                </div>
                <div className={['tile is-child', 'columns', styles["scrape-column-height"]].join(" ")}>

                    <PrimaryScrapeForm></PrimaryScrapeForm>

                    <AuxScrapeForm></AuxScrapeForm>

                    
                    <div className={['column'].join(" ")}>

                    </div>
                    <div className={['column','is-2'].join(" ")}>
                        {SummaryTile(queueStubb)}
                    </div>
                    <div className={['column','is-narrow'].join(" ")}>
                        <RequestTile {...tileStubb} ></RequestTile>
                    </div>
                    <div className={['column','is-flex-grow-0'].join(" ")}>
                        <div className={['control'].join(" ")} style={{ height:"100%" }}>
                            <button className={['button is-primary is-fullwidth is-flex-grow-1'].join(" ")} 
                                style={{ height:"100%",wordWrap:"break-word" }}
                                onClick={noop}>
                            Start Queue
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default ScrapeInterfaceHOC;

type ActiveScrapeRequest = IScrapeRequest&Partial<IScrapePostDataRequest>;
const SummaryTile = (requestQueue: ActiveScrapeRequest[]) => {
    const activeRequest = requestQueue[0] as IScrapeRequest&IScrapePostDataRequest;
    if(activeRequest !== undefined && activeRequest !== null){
        const { metrics, complete } = activeRequest;
        if(metrics){
            let dataSize = 1;
            let fetchComplete = 0;
            for(const m of metrics){
                fetchComplete += m.numComplete;
                dataSize += m.numTotal;
            }
            return (
                <div className={["box tile is-vertical", styles["scrape-tile"]].join(" ")}>
                    <div>{fetchComplete/dataSize}% complete</div>
                    {metrics.map((m)=> (
                        <div key={m.vendorDesc}>
                            {m.vendorDesc}: {m.numComplete} / {m.numTotal}
                        </div>
                    ) )}
                </div>
            );
        }
        return (
            <div className={["box tile is-vertical", styles["scrape-tile"]].join(" ")}>
                {requestQueue.length} pending requests
            </div>
        );
    }
    return (
        <div className={["box tile is-vertical", styles["scrape-tile"]].join(" ")}>
            this is a bad state we`ll probably hide this
        </div>
    );
};

const StatusTile = (props:any) => {
    const [activeState, setActiveState] = useState<IScrapePostDataRequest>();

    const statistics = (activeState == undefined)? []:activeState?.metrics;
    let [total, completed] = [0,0];
    for(const metric of statistics){
        total += metric.numTotal;
        completed += metric.numComplete;
    }
    const percent = Math.round((completed/total)*100);
    return (
        <div className={["box tile is-parent is-vertical", styles["rq-status-tile"], props.className].join(" ")}>
            {statistics.map((metric)=>{
                return(
                    <div key={metric.vendorDesc} className={["tile is-child"].join(" ")}>
                        {metric.numComplete} / {metric.numTotal}
                    </div>
                );
            })}
            <div className={["tile is-child"].join(" ")}>
                {percent} % Complete.
            </div>
        </div>
    );
};