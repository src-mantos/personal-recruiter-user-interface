import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditorPanel from "./SearchDisplayComponents/EditorPanel";
import PostResultPanel from "./SearchDisplayComponents/PostResultPanel";
import { StylableComponent } from "./types";
import styles from '../../styles/Components/Form.module.scss';
import { useRecoilState, useRecoilValue } from "recoil";
import { searchRequestState } from "./contexts/SearchContext";
import useWindowDimensions from "./contexts/useWindowDimentions";
import { CSSProperties } from "react";


const SearchDisplayInterfaceHOC = (props:StylableComponent) => {
    const dimentions = useWindowDimensions();
    let wrapperStyle:CSSProperties = {};
    let childHeight = 0;
    if(dimentions !== undefined){
        const { width, height } = dimentions;
        const panelHeight = 180;
        wrapperStyle.height = height-panelHeight;
        childHeight = wrapperStyle.height - (wrapperStyle.height*.01);
    }
    
    return (
        <div className={['tile is-ancestor',  props.className ].join(" ")} style={wrapperStyle}>

            <div className={['tile is-parent'].join(" ")} style={{ paddingLeft:"0px",paddingRight:"0px" }} >
                <div className={['tile is-child', 'columns', styles["scrape-column-height"]].join(" ")}>
                    <div className={['column'].join(" ")} style={{ paddingLeft:"0px" }}>
                        <PostResultPanel height={childHeight}></PostResultPanel>
                    </div>
                    <div className={['column'].join(" ")}>
                        <EditorPanel height={childHeight}></EditorPanel>
                    </div>
                </div>
            </div>

        </div>
    );
};
export default SearchDisplayInterfaceHOC;