import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes } from 'react';
import EditorStyles from '../../styles/Components/EditorPanel.module.scss';
import { IPostData } from 'data-service/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faFloppyDisk, faExternalLink, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { onEnterHandler, truncEllipsis } from '../FormUtils';
import { useRecoilState } from 'recoil';
import { remotePostDataState } from '../contexts/EditorContext';
import EditorControls from './EditorControls';


type IPostKeys = keyof IPostData;

const EditorPanel = ( props:{height:number}) => {
    const descArea = useRef<HTMLTextAreaElement>( null );
    const [editContext, setContext] = useRecoilState( remotePostDataState );
    const { record: activeState } = editContext;
    const updateEntity = ( record:Partial<IPostData> ) => {
        setContext({ ...editContext, record });
    };
    // console.log("EditorPanel:",editContext)

    const fieldFocus = ( event:React.FocusEvent<HTMLInputElement, Element> | React.FocusEvent<HTMLTextAreaElement, Element> ) => {
        event.preventDefault();
        toggleField( event.target );
    };
    const looseFocus = onEnterHandler( ( event:React.KeyboardEvent<Element> ) => {
        ( event.target as HTMLInputElement ).blur();
    });
    const fieldBlur = ( event:React.FocusEvent<HTMLInputElement, Element> | React.FocusEvent<HTMLTextAreaElement, Element> ) => {
        event.preventDefault();
        toggleField( event.target );
    };
    const toggleField = ( el:HTMLInputElement|HTMLTextAreaElement ) => {
        el.readOnly = !el.readOnly;
        el.classList.toggle( "is-static" );
    };
    const getRecordValue = ( attr:IPostKeys ) => {
        const recVal = ( activeState as any )[attr];
        return ( recVal === undefined )? "" : recVal;
    };


    const labelClassStd = ["label", EditorStyles["no-margin"], EditorStyles['field-label']].join( " " );
    const fieldClassStd = ["input is-static", EditorStyles['field-input'], EditorStyles['no-pad'], EditorStyles['no-margin']].join( " " );
    const changeHandler = ( event: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement> ) => {
        const field = event.currentTarget.getAttribute( 'data-field' );
        const value = event.currentTarget.value;
        if ( field !== null ){
            const updateObj:Partial<IPostData> = { ...activeState, userModified: true };
            ( updateObj as any )[field] = value;
            // console.log("update",field,value)
            updateEntity( updateObj );
        }
    };

    //scroll to top of the textarea on "reload"
    useEffect( () => {
        if ( descArea.current )
            descArea.current.scrollTo({ top: 0 });
    }, [descArea, activeState] );
    return (
        <div className={["box", EditorStyles['editor-panel']].join( " " )} style={{ height: props.height }}>
            <EditorControls></EditorControls>

            <div className={["block", EditorStyles["no-margin"]].join( " " )} style={{ width: "82%" }}>
                <label className={[labelClassStd].join( " " )}>Job Title</label>
                <input className={[fieldClassStd, "is-large"].join( " " )}
                    readOnly={true} type="text"
                    value={getRecordValue( "title" )}
                    data-field="title"
                    onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}
                    onChange={changeHandler}
                />
            </div>
            <div className={["columns", EditorStyles["no-margin"]].join( " " )}>
                <div className={['column'].join( " " )}>
                    <label className={[labelClassStd, "is-small"].join( " " )}>Company</label>
                    <input className={[fieldClassStd].join( " " )}
                        readOnly={true} type="text"
                        value={getRecordValue( "organization" )}
                        data-field="organization"
                        onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}
                        onChange={changeHandler}
                    />
                </div>
                <div className={['column'].join( " " )}>
                    <label className={[labelClassStd, "is-small"].join( " " )}>Location</label>
                    <input className={[fieldClassStd].join( " " )}
                        readOnly={true} type="text"
                        value={getRecordValue( "location" )}
                        data-field="location"
                        onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}
                        onChange={changeHandler}
                    />
                </div>
            </div>
            <div className={["columns", EditorStyles["no-margin"]].join( " " )}>
                <div className={['column'].join( " " )}>
                    <label className={[labelClassStd, "is-small"].join( " " )}>Salary Info</label>
                    <input className={[fieldClassStd].join( " " )}
                        readOnly={true} type="text"
                        value={getRecordValue( "salary" )}
                        data-field="salary"
                        onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}
                        onChange={changeHandler}
                    />
                </div>
                <div className={['column'].join( " " )}>
                    <label className={[labelClassStd, "is-small"].join( " " )}>Post Updated</label>
                    <input className={[fieldClassStd].join( " " )}
                        readOnly={true} type="text"
                        value={getRecordValue( "postedTime" )}
                        data-field="postedTime"
                        onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}
                        onChange={changeHandler}
                    />
                </div>
            </div>

            <div className={["block", EditorStyles["no-margin"]].join( " " )} style={{ height: props.height-210 }}>
                <label className={[labelClassStd, "is-small"].join( " " )}>Job Description</label>
                <span className={["contianer", "control"].join( " " )}>
                    <textarea className={["textarea is-focused is-static", EditorStyles["ep-textArea"], EditorStyles['no-pad']].join( " " )}
                        ref={descArea}
                        readOnly={true}
                        value={getRecordValue( "description" )}
                        data-field="description"
                        onBlur={fieldBlur} onFocus={fieldFocus}
                        onChange={changeHandler}
                    ></textarea>
                </span>
            </div>
        </div>
    );
};

export default EditorPanel;