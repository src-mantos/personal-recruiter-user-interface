import { IRunMetric, IScrapeRequest } from "data-service/types";
import { ActiveScrapeRequest, StylableComponent } from "../../Components/types";
import TileStyle from '../../styles/Components/ScrapeTile.module.scss';
import FormStyle from '../../styles/Components/Form.module.scss';
import { faTimesCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { removeScrapeRequest } from "../../Components/contexts/ScrapeContext";
import { useRecoilState } from "recoil";
import { truncEllipsis } from "../FormUtils";

//TODO we need an active/running state indication
// and a snappier update on the status would be nice

const ScrapeTile = ( props:ActiveScrapeRequest ) => {
    const { keyword, pageDepth, location, uuid, _id, complete, metrics, requestTime, isActive: isRunning } = props;
    const displayLocation = ( location == undefined||location == null )? "\"Anywhere\"":location;
    const displayTime = new Intl.DateTimeFormat( 'en-US', {
        hour  : 'numeric',
        minute: 'numeric',
        second: 'numeric',
    }).format( ( requestTime !== undefined )? new Date( requestTime ): new Date() );
    const isActive = isRunning || metrics !== undefined && metrics.length > 0;
    const [showMetrics, setShowState] = useState( isActive );
    const [remTile, removeTile] = useRecoilState( removeScrapeRequest );

    return (
        <div className={["box tile is-vertical", TileStyle["scrape-tile"]].join( " " )} style={{ backgroundColor: ( isActive )?"#effaf5":"auto" }}>

            <div className={["columns", TileStyle["columns-spacing"]].join( " " )} >
                <div className={["column", TileStyle["scrape-tile-keyword"], FormStyle["no-wrap"]].join( " " )}
                    style={{ paddingTop: "10px" }}>
                    {keyword}
                </div>

                <div className={["column is-narrow", FormStyle["no-wrap"]].join( " " )} style={{ paddingTop: "8px" }}>
                    {( isActive )? (
                        <a style={{ cursor: "pointer" }}
                            onMouseOver={() => { setShowState( !isActive ) }}
                            onMouseOut={() => { setShowState( isActive ) }}
                        >
                            <span style={{ margin: "2px", padding: "5px" }}>
                                <FontAwesomeIcon icon={faInfoCircle} className={TileStyle["tile-icon"]}></FontAwesomeIcon>
                            </span>
                        </a>
                    ):(
                        <a style={{ cursor: "pointer" }}
                            onClick={() => {
                                console.log( "close", props );
                                removeTile({ ...remTile, uuid: uuid, sendRequest: true });
                            }}
                        >
                            <span style={{ margin: "2px", padding: "5px" }}>
                                <FontAwesomeIcon icon={faTimesCircle} className={TileStyle["tile-icon"]} ></FontAwesomeIcon>
                            </span>
                        </a>
                    )}
                </div>
            </div>
            <div className={["columns", TileStyle["columns-spacing"], ( showMetrics )?TileStyle["hide-content"]:""].join( " " )} >
                <div className={["column", FormStyle["no-wrap"]].join( " " )}>
                    <div>{displayLocation}</div>
                </div>
                <div className={["column is-narrow", FormStyle["no-wrap"]].join( " " )}>
                    <div style={{ letterSpacing: "-1px" }} >{pageDepth} Pages</div>
                </div>
            </div>
            <div className={["columns", TileStyle["columns-spacing"], ( showMetrics )?TileStyle["hide-content"]:""].join( " " )}>
                <div className={["column is-narrow", FormStyle["no-wrap"]].join( " " )}>
                    <div>{displayTime}</div>
                </div>
                <div className={["column", FormStyle["no-wrap"]].join( " " )}>
                    <div style={{ letterSpacing: "-1.1px" }} title={uuid}>{truncEllipsis( uuid, 20 )}</div>
                </div>
            </div>

            <div className={["columns", TileStyle["columns-spacing"], ( !showMetrics )?TileStyle["hide-content"]:""].join( " " )}
                style={{ margin: "1.3em -10px 0 0" }}>
                <div className={["column", TileStyle["columns-spacing"], TileStyle["scrape-metric-scroll"]].join( " " )}>
                    {( metrics !== undefined )? metrics.map( ( value:IRunMetric, index ) => {
                        const { vendorDesc, numComplete, numTotal } = value;
                        const percComplete = Math.round( ( numComplete/numTotal )*100 )+"%";
                        return (
                            <div key={"metric-"+index} className={["columns"].join( " " )} style={{ cursor: "pointer" }}>
                                <div className={["column", FormStyle["no-pad"]].join( " " )} title={percComplete}>
                                    {vendorDesc}
                                </div>
                                <div className={["column", FormStyle["no-pad"]].join( " " )}
                                    style={{ paddingLeft: 0, paddingRight: "1.1rem" }}>
                                    <progress className="progress is-small is-link"
                                        value={numComplete} max={numTotal}
                                        style={{ height: "0.45rem", marginTop: "0.35rem" }}
                                        title={percComplete}>
                                        {percComplete}
                                    </progress>
                                </div>
                            </div>
                        );
                    }):""}
                </div>
            </div>
        </div>
    );
};
export default ScrapeTile;
