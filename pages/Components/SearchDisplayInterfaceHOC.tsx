import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditorPanel from "./SearchDisplayComponents/EditorPanel";
import PostResultPanel from "./SearchDisplayComponents/PostResultPanel";
import { StylableComponent } from "./types";
import styles from '../../styles/Components/Form.module.scss';


const SearchDisplayInterfaceHOC = (props:StylableComponent) => {
    return (
        <div className={['tile is-ancestor', styles['app-border'], styles['app-border-top'], props.className ].join(" ")}>

            <div className={['tile is-parent'].join(" ")} >
                
            </div>

            <div style={{ width:"20px" }} draggable className={['tile is-parent is-align-self-center'].join(" ")} >
                <FontAwesomeIcon icon={faGripVertical}></FontAwesomeIcon>
            </div>

            <div className={['tile is-parent'].join(" ")} >
                
            </div>

        </div>
    );
};
export default SearchDisplayInterfaceHOC;