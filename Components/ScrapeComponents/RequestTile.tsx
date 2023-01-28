import { IRunMetric, IScrapeRequest } from "data-service/types";
import { ActiveScrapeRequest, StylableComponent } from "../types";
import styles from '../../styles/Components/Form.module.scss';
import { faRemove, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilState, useRecoilValue } from "recoil";
import { scrapeItemRemove } from "../contexts/ScrapeContext";
import { useState } from "react";

const RequestTile = (props:ActiveScrapeRequest ) => {
    const [showInfo, setHover] = useState(false);
    const [_removeTileState, removeTile] = useRecoilState(scrapeItemRemove);
    const removeRequest= ()=>{
        console.log("removeAction Fire",props);
        removeTile(props);
    };
    const displayLocation = (props.location == undefined||props.location == null)? "\"Anywhere\"":props.location;

    if(props.metrics !== undefined && props.metrics?.length > 0){
        const scrapers = props.metrics;
        const rowPaddingStyle:React.CSSProperties = {
            paddingTop:0, paddingBottom:0
        };
        const infoStyle:React.CSSProperties = {
            width:"100%", 
            height: "100%", 
            maxHeight:"40px",
            minWidth: '174px'
            
        };
        const metaStyle= (show:boolean):React.CSSProperties => {
            return {
                height: (show)? "100%":"0%",
                display: (show)? "block":"none",
            };
        };
        const setVisibility = (show:boolean) => {
            return ()=>{setHover(show);};
        };

        return (
            <div className={["box tile is-vertical", styles["scrape-tile"]].join(" ")} style={{ backgroundColor:"#effaf5" }}>
                <div className={[styles["scrape-tile-keyword"], "columns"].join(" ")}
                    style={{ marginBottom:0 }}>
                    <div className={["column", styles["no-wrap"]].join(" ")}
                        style={{ paddingTop:10, paddingBottom:0, paddingRight:0, fontWeight:"bold" }}>
                        {props.keyword}
                    </div>
                    <div className={["column is-narrow", styles["no-wrap"]].join(" ")}
                        style={{ paddingTop:10, paddingBottom:0 }}>
                        <FontAwesomeIcon icon={faInfoCircle} 
                            onClick = {setVisibility(!showInfo)}
                            onMouseOver={setVisibility(true)}
                            onMouseOut={setVisibility(false)}></FontAwesomeIcon>
                    </div>
                </div>
                <div style={{ ...infoStyle, ...metaStyle(showInfo) }}>
                    <div >{displayLocation}</div>
                    <div className={["columns"].join(" ")}>
                        <div className={["column", styles["no-wrap"]].join(" ")}>
                            <div>{props.pageDepth} Pages</div>
                        </div>
                        <div className={["column", styles["no-wrap"]].join(" ")}>
                            <div style={{ letterSpacing: "-1.1px" }} title={props.uuid}>{props.uuid?.substring(0,10)+"..."}</div>
                        </div>
                    </div>
                </div>
                <div style={{  ...infoStyle, overflowY:"inherit", overflowX:"hidden", ...metaStyle(!showInfo) }}>
                    {scrapers.map((value:IRunMetric, index)=>{
                        const { vendorDesc,numComplete,numTotal,pageSize } = value;
                        const percComplete = Math.round((numComplete/numTotal)*100)+"%";
                        return (
                            <div key={"metric-"+index} className={["columns"].join(" ")} style={{ marginTop:0,marginBottom:0,cursor:"pointer" }}>
                                <div className={["column"].join(" ")} style={rowPaddingStyle} title={percComplete}>
                                    {vendorDesc}
                                </div>
                                <div className={["column"].join(" ")}
                                    style={{ paddingLeft:0, ...rowPaddingStyle, paddingRight:"1.1rem" }}>
                                    <progress className="progress is-small is-link" 
                                        value={numComplete} max={numTotal}
                                        style={{ height: "0.45rem", marginTop: "0.35rem" }}
                                        title={percComplete}>
                                        {percComplete}
                                    </progress>
                                </div>
                                {/* <div className={["column is-narrow"].join(" ")} style={rowPaddingStyle}>
                                    pg: {Math.round(numComplete/pageSize)+1}
                                </div> */}
                            </div>
                        );
                    })}
                </div>
                
            </div>
        );
    }else{
        return (
            <div className={["box tile is-vertical", styles["scrape-tile"]].join(" ")} style={{ height:"100%" }}>
                <div className={[styles["scrape-tile-keyword"], "columns"].join(" ")}
                    style={{ marginBottom:0 }}>
                    <div className={["column", styles["no-wrap"]].join(" ")}
                        style={{ paddingTop:10, paddingBottom:0, paddingRight:0 }}>
                        {props.keyword}
                    </div>
                    <div className={["column is-narrow", styles["no-wrap"]].join(" ")}
                        style={{ paddingTop:10, paddingBottom:0 }}>
                        <button className="delete is-small" onClick={removeRequest}></button>
                    </div>
                </div>
                <div >{displayLocation}</div>
                <div className={["columns"].join(" ")}>
                    <div className={["column", styles["no-wrap"]].join(" ")}>
                        <div>{props.pageDepth} Pages</div>
                    </div>
                    <div className={["column", styles["no-wrap"]].join(" ")}>
                        <div style={{ letterSpacing: "-1.1px" }} title={props.uuid}>{props.uuid?.substring(0,10)+"..."}</div>
                    </div>
                </div>
            </div>
        );
    }
};
export default RequestTile;