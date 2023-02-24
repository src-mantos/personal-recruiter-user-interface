import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes } from 'react';
import styles from '../../styles/Components/EditorPanel.module.scss';
import { IPostData } from 'data-service/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faFloppyDisk, faExternalLink, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { formatLocaleDateString, onEnterHandler, truncEllipsis } from '../FormUtils';
import { useRecoilState } from 'recoil';
import { postDataState } from '../contexts/EditorContext';


interface AnyMap { [key: string]: any }
export interface EditorPanelProps extends AnyMap {
    className?: string;
    showMetadata?: boolean;
    postData?: IPostData;
}

const EditorPanel = ( props:{height:number}) => {
    const [activePostData, setActivePost] = useRecoilState( postDataState );
    

    const title = useRef<HTMLInputElement>( null );
    const organization = useRef<HTMLInputElement>( null );
    const location = useRef<HTMLInputElement>( null );
    const captureTime = useRef<HTMLInputElement>( null );
    const salary = useRef<HTMLInputElement>( null );
    const description = useRef<HTMLTextAreaElement>( null );

    useEffect( () => {
        if ( description.current !== null )
            description.current.scrollTop = 0;

    }, [activePostData] );

    const post = ( activePostData.origState != undefined )? activePostData.origState : {
        captureTime : new Date(),
        description : "",
        directURL   : "",
        location    : "",
        organization: "",
        postedTime  : "",
        title       : "",
    };

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
        console.log( "Update Active Record", activePostData );
    };
    const toggleField = ( el:HTMLInputElement|HTMLTextAreaElement ) => {
        el.readOnly = !el.readOnly;
        el.classList.toggle( "is-static" );
    };

    /** get the current user input state of the active post */
    const getModifiedPost = ():IPostData|null => {
        if ( post.directURL === undefined ||
            title.current === null ||
            organization.current === null ||
            location.current === null ||
            description.current === null )
            return null;
        else
            return {
                directURL   : post.directURL,
                captureTime : post.captureTime,
                title       : title.current.value,
                organization: organization.current.value,
                location    : location.current.value,
                description : description.current.value,
                salary      : ( salary.current )? salary.current.value:"",
                postedTime  : ( post.postedTime !== undefined )?post.postedTime:"",
                userModified: true
            };


    };

    const labelClassStd = ["label", styles["no-margin"], styles['field-label']].join( " " );
    const fieldClassStd = ["input is-static", styles['no-pad'], styles['field-collapse']].join( " " );
    const generateControl = ( icon:IconDefinition, text:string, clickHandler?:{():void}) => (
        <div className={["is-parent"].join( " " )} onClick={clickHandler}>
            <span className={["is-child"].join( " " )}>
                <FontAwesomeIcon icon={icon} size={"1x"}/>
            </span>
            <span className={["is-child", styles.iconLabel].join( " " )}>{text}</span>
        </div>
    );
    const heightStyle = ( props.height > 100 )? { height: props.height } : {};
    return (
        <div className={["tile is-ancestor is-vertical box", styles["editor-panel"]].join( " " )} style={heightStyle}>

            <div className={["is-parent box", styles["floating-control"], styles['no-pad']].join( " " )}>
                <div className={["tile box is-parent is-vertical"].join( " " )} style={{ padding: "10px" }}>
                    {generateControl( faFloppyDisk, "save", () => {
                        const updated = getModifiedPost();
                        console.log( "Save through atom", updated );
                    })}
                    {generateControl( faExternalLink, "link", () => {
                        if ( post.directURL !== undefined && post.directURL !== "" )
                            window.open( post.directURL, "_blank" );
                    })}
                </div>
            </div>

            <div className={["tile is-parent", "is-flex-grow-0", styles["no-pad"], styles["ep-row"]].join( " " )}>
                <div className={['tile is-child'].join( " " )}>
                    <label className={[labelClassStd].join( " " )}>Job Title</label>
                    <span className={["control"].join( " " )}>
                        <input className={[fieldClassStd, "is-large"].join( " " )}
                            readOnly={true} type="text" ref={title} defaultValue={post.title}
                            onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}/>
                    </span>
                </div>
            </div>
            <div className={["tile is-parent", "is-flex-grow-0", styles["no-pad"], styles["ep-row"]].join( " " )}>
                <div className={['tile is-child'].join( " " )}>
                    <label className={[labelClassStd, "is-small"].join( " " )}>Company</label>
                    <span className={["control"].join( " " )}>
                        <input className={[fieldClassStd, styles['field-indent'], styles['field-size']].join( " " )}
                            readOnly={true} type="text" ref={organization} defaultValue={post.organization}
                            onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}/>
                    </span>
                </div>
                <div className={['tile is-child'].join( " " )}>
                    <label className={[labelClassStd, "is-small"].join( " " )}>Location</label>
                    <span className={["control"].join( " " )}>
                        <input className={[fieldClassStd, styles['field-indent'], styles['field-size']].join( " " )}
                            readOnly={true} type="text" ref={location} defaultValue={post.location}
                            onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}/>
                    </span>
                </div>
            </div>
            <div className={["tile is-parent", "is-flex-grow-0", styles["no-pad"], styles["ep-row"]].join( " " )}>
                <div className={['tile is-child', styles["no-margin"]].join( " " )}>
                    <label className={[labelClassStd, "is-small"].join( " " )}>Salary Info</label>
                    <span className={["control"].join( " " )}>
                        <input className={[fieldClassStd, styles['field-indent'], styles['field-size']].join( " " )}
                            readOnly={true} type="text" ref={salary} /*defaultValue={post.salary}*/
                            onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}/>
                    </span>
                </div>
                <div className={['tile is-child'].join( " " )}>
                    <label className={[labelClassStd, "is-small"].join( " " )}>Captured On</label>
                    <span className={["control"].join( " " )}>
                        <input className={[fieldClassStd, styles['field-indent'], styles['field-size']].join( " " )}
                            readOnly={true} type="date" ref={captureTime} /*defaultValue={formatLocaleDateString(post.captureTime,{year: 'numeric', month: 'long', day: 'numeric'})}*/
                            onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}/>
                    </span>
                </div>
            </div>

            <div className={["tile is-parent is-flex-grow-1", styles["no-pad"], styles["ep-row"]].join( " " )}>
                <div className={['tile is-child box is-flex-grow-1'].join( " " )}>
                    <label className={[labelClassStd, "is-small"].join( " " )}>Job Description</label>
                    <span className={["contianer", "control"].join( " " )}>
                        <textarea className={["textarea is-focused is-static", styles["ep-textArea"], styles['no-pad']].join( " " )}
                            readOnly={true} ref={description} defaultValue={post.description}
                            onBlur={fieldBlur} onFocus={fieldFocus}></textarea>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default EditorPanel;