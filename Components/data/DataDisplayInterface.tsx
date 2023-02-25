import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditorPanel from "./EditorPanel";
// import PostResultPanel from "../SearchDisplayComponents/PostResultPanel";
import { AsyncState, PostDataProps, StylableComponent } from "../types";
import styles from '../../styles/Components/Form.module.scss';
import { useRecoilState, useRecoilValue } from "recoil";
import { postDisplayListState, convertToUI, searchRequestState } from "../contexts/SearchContext";
import useWindowDimensions from "../contexts/useWindowDimentions";
import { CSSProperties, useEffect, useMemo } from "react";
import { remotePostDataState } from "../contexts/EditorContext";
import PostDataList from "./PostDataList";
import { IPostData } from "data-service/types";


const DataDisplayInterface = ( props:StylableComponent ) => {
    const dimentions = useWindowDimensions();
    const childHeight = ( dimentions.height > 200 )? dimentions.height * .95 : 600;
    let wrapperStyle:CSSProperties = { height: ( dimentions.height > 200 )? dimentions.height * .9 : 666 };

    const [viewData, setDataset] = useRecoilState<PostDataProps[]>( postDisplayListState );
    const searchQuery = useRecoilValue( searchRequestState );
    const [editContext, setContext] = useRecoilState( remotePostDataState );

    // synchronizing atom's
    useEffect( () => {
        if ( searchQuery.asyncState == AsyncState.Complete )
            setDataset( convertToUI( searchQuery.dataset ) );

    }, [searchQuery, setDataset] );

    // Handle Editor updates
    useEffect( () => {
        if ( editContext.updateList && editContext.index >= 0 ){
            let original = viewData[editContext.index];
            console.log( "effect", { editContext, row: original });
            setContext({ ...editContext, updateList: false });
            setDataset( [
                ...viewData.slice( 0, editContext.index ),
                { ...original, record: editContext.record },
                ...viewData.slice( editContext.index+1 )
            ] );
        }
    }, [editContext, viewData, setDataset, setContext] );

    return (
        <div className={['tile is-ancestor', props.className ].join( " " )} style={wrapperStyle}>

            <div className={['tile is-parent'].join( " " )} style={{ paddingLeft: "0px", paddingRight: "0px" }} >
                <div className={['tile is-child', 'columns', styles["scrape-column-height"]].join( " " )}>
                    <div className={['column'].join( " " )} style={{ paddingLeft: "0px" }}>
                        <PostDataList height={childHeight}></PostDataList>
                    </div>
                    <div className={['column'].join( " " )}>
                        <EditorPanel height={childHeight}></EditorPanel>
                    </div>
                </div>
            </div>

        </div>
    );
};
export default DataDisplayInterface;