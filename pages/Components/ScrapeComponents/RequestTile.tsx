import { IScrapeRequest } from "data-service/types";
import { StylableComponent } from "../types";
import styles from '../../../styles/Components/Form.module.scss';

const RequestTile = (props:StylableComponent & IScrapeRequest ) => {
    const removeAction= ()=>{
        console.log("removeAction Fire",props);
    };
    const displayLocation = (props.location == undefined||props.location == null)? "\"Anywhere\"":props.location;

    return (
        <div className={["box tile is-vertical", styles["scrape-tile"], props.className].join(" ")}>
            <div className={[styles["scrape-tile-keyword"]].join(" ")}>
                {props.keyword}
            </div>
            <div >{displayLocation}</div>
            <div className={["columns"].join(" ")}>
                <div className={["column", styles["no-wrap"]].join(" ")}>
                    <div>{props.pageDepth} Pages</div>
                </div>
                <div className={["column", styles["no-wrap"]].join(" ")}>
                    <div style={{ letterSpacing: "-1.1px" }}>{props.uuid}</div>
                </div>
            </div>
        </div>
    );
};
export default RequestTile;