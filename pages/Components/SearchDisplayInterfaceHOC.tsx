import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditorPanel from "./SearchDisplayComponents/EditorPanel";
import PostResultPanel from "./SearchDisplayComponents/PostResultPanel";
import { StylableComponent } from "./types";
import styles from '../../styles/Components/Form.module.scss';
import { useRecoilState, useRecoilValue } from "recoil";
import { searchRequestState } from "./contexts/SearchContext";


const SearchDisplayInterfaceHOC = (props:StylableComponent) => {
    // const requestAtom = useRecoilValue(searchRequestState);
    // console.log("HOC", requestAtom);
    return (
        <div className={['tile is-ancestor',  props.className ].join(" ")}>

            <div className={['tile is-parent'].join(" ")} style={{paddingLeft:"0px",paddingRight:"0px"}} >
                <div className={['tile is-child', 'columns', styles["scrape-column-height"]].join(" ")}>
                    <div className={['column'].join(" ")} style={{paddingLeft:"0px"}}>
                        <PostResultPanel></PostResultPanel>
                    </div>
                    <div className={['column is-narrow'].join(" ")}>
                        <FontAwesomeIcon icon={faGripVertical}></FontAwesomeIcon>
                    </div>
                    <div className={['column'].join(" ")}>
                        <EditorPanel></EditorPanel>
                    </div>
                </div>
            </div>

            {/* <div className={['tile is-parent'].join(" ")} >
                <PostResultPanel></PostResultPanel>
            </div>

            <div style={{ width:"20px" }} draggable className={['tile is-parent is-align-self-center'].join(" ")} >
                <FontAwesomeIcon icon={faGripVertical}></FontAwesomeIcon>
            </div>

            <div className={['tile is-parent'].join(" ")} >
                <EditorPanel></EditorPanel>
            </div> */}

        </div>
    );
};
export default SearchDisplayInterfaceHOC;