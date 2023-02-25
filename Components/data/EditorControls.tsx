import React from 'react';
import EditorStyles from '../../styles/Components/EditorPanel.module.scss';
import { IPostData } from 'data-service/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faFloppyDisk, faExternalLink, faUndo } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState } from 'recoil';
import { remotePostDataState } from '../contexts/EditorContext';

const EditorControls = () => {
    const [editContext, setContext] = useRecoilState( remotePostDataState );
    const activeRec = editContext.record;

    const goToLink = () => {
        const link = activeRec.directURL;
        if ( link !== undefined )
            window.open( link, '_blank' );
    };
    const saveAction = () => {
        console.log( "save", activeRec );
        setContext({ ...editContext, sendRequest: true });
    };
    const resetAction = () => {
        setContext({ ...editContext, fetchRecord: true });
    };
    return (
        <div className={[""].join( " " )} style={{ position: "relative" }}>
            <div className={["tile is-ancestor is-vertical", "box"].join( " " )} style={{ position: "absolute", zIndex: 10, top: 0, right: 0, margin: 0, padding: "2px 5px", border: '1px solid #aaa' }}>
                <div className={["is-parent"].join( " " )}>
                    <a className={["tile is-child"].join( " " )} style={{ color: "black" }} onClick={goToLink}>
                        <FontAwesomeIcon icon={faExternalLink}/> Open Posting
                    </a>
                    <a className={["tile is-child"].join( " " )} style={{ color: "black" }} onClick={saveAction}>
                        <FontAwesomeIcon icon={faFloppyDisk}/> Save
                    </a>
                    <a className={["tile is-child"].join( " " )} style={{ color: "black" }} onClick={resetAction}>
                        <FontAwesomeIcon icon={faUndo}/> Reset
                    </a>
                </div>
            </div>
        </div>
    );
};
export default EditorControls;