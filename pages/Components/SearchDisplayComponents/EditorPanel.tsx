import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes } from 'react';
import styles from '../../../styles/EditorPanel.module.scss';
import { IPostData } from 'data-service/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { formatLocaleDateString, truncEllipsis } from '../../Components/FormUtils';


interface AnyMap { [key: string]: any }
export interface EditorPanelProps extends AnyMap {
    className?: string;
    showMetadata?: boolean;
    postData?: IPostData;
}

const EditorPanel = (props:EditorPanelProps) => { 

    const title = useRef<HTMLInputElement>(null);
    const organization = useRef<HTMLInputElement>(null);
    const location = useRef<HTMLInputElement>(null);
    const captureTime = useRef<HTMLInputElement>(null);
    const salary = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLTextAreaElement>(null);
    

    const post = (props.postData != undefined)? {...props.postData} : {
        captureTime: new Date(),
        description: "",
        directURL: "",
        location: "",
        organization: "",
        postedTime: "",
        title: "",
    };

    

    
    const fieldBlur = (event:React.FocusEvent<HTMLInputElement, Element>) =>{
        event.preventDefault();
        toggleField(event.target as HTMLInputElement);
        console.log("Active Record",getPostData(), props.postData);
    };
    const looseFocus = (event:React.KeyboardEvent<HTMLInputElement>) =>{
        if(event.key === 'Enter'){
            const el = event.target as HTMLInputElement;
            el.blur();
        }
    };
    const fieldFocus = (event:React.FocusEvent<HTMLInputElement, Element>) =>{
        event.preventDefault();
        toggleField(event.target as HTMLInputElement);
    };
    const descBlur = (event:React.FocusEvent<HTMLTextAreaElement, Element>) =>{
        event.preventDefault();
        toggleField(event.target as HTMLTextAreaElement);
        console.log("Active Record",getPostData(), props.postData);
    };
    const descFocus = (event:React.FocusEvent<HTMLTextAreaElement, Element>) =>{
        event.preventDefault();
        toggleField(event.target as HTMLTextAreaElement);
    };
    const toggleField = (el:HTMLInputElement|HTMLTextAreaElement) => {
        el.readOnly = !el.readOnly;
        el.classList.toggle("is-static");
    };
    const getPostData = ():IPostData=>{
        return {
            directURL: post.directURL,
            captureTime: post.captureTime,
            title: (title.current)? title.current.value:post.title,
            organization: (organization.current)? organization.current.value:post.organization,
            location: (location.current)? location.current.value:post.location,
            description: (description.current)? description.current.value:post.description,
            salary: (salary.current)? salary.current.value:"",
            postedTime: post.postedTime,
            userModified: true
        };
    };

    return (
        <div className={["tile is-ancestor is-vertical box", styles["ep-container"]].join(" ")} >

            <div className={["is-ancestor box", styles["ep-float-control"]].join(" ")}>
                <div className={["tile box is-parent is-vertical"].join(" ")}>
                    <FontAwesomeIcon icon={faLock} size={"1x"} className={["tile is-child"].join(" ")} style={{margin:"0px !important"}} />
                    <span className={["tile is-child",styles.iconLabel].join(" ")} >lock</span>
                </div>
            </div>

            <div className={["tile is-parent","is-flex-grow-0", styles["ep-remove-pad"],styles["ep-row"]].join(" ")}>
                <div className={['tile is-child'].join(" ")}>
                    <label className={["label", styles["ep-remove-marg"]].join(" ")}>Job Title</label>
                    <span className={["control"].join(" ")}>
                        <input className={["input is-static is-large",styles.editorField].join(" ")} 
                            readOnly={true} type="text" ref={title} defaultValue={truncEllipsis(post.title,65)} 
                            onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}/>
                    </span>
                </div>
            </div>
            <div className={["tile is-parent","is-flex-grow-0", styles["ep-remove-pad"],styles["ep-row"]].join(" ")}>
                <div className={['tile is-child'].join(" ")}>
                    <label className={["label is-small", styles["ep-remove-marg"]].join(" ")}>Company</label>
                    <span className={["control"].join(" ")}>
                        <input className={["input is-static",styles.editorField,styles.indentField,styles.fieldSize].join(" ")} 
                            readOnly={true} type="text" ref={organization} defaultValue={post.organization} 
                            onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}/>
                    </span>
                </div>
                <div className={['tile is-child'].join(" ")}>
                    <label className={["label is-small", styles["ep-remove-marg"]].join(" ")}>Location</label>
                    <span className={["control"].join(" ")}>
                        <input className={["input is-static",styles.editorField,styles.indentField,styles.fieldSize].join(" ")} 
                            readOnly={true} type="text" ref={location} defaultValue={post.location} 
                            onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}/>
                    </span>
                </div>
            </div>
            <div className={["tile is-parent","is-flex-grow-0", styles["ep-remove-pad"],styles["ep-row"]].join(" ")}>
                <div className={['tile is-child', styles["ep-remove-marg"]].join(" ")}>
                    <label className={["label is-small"].join(" ")}>Salary Info</label>
                    <span className={["control"].join(" ")}>
                        <input className={["input is-static",styles.editorField,styles.indentField,styles.fieldSize].join(" ")} 
                            readOnly={true} type="text" ref={salary} /*defaultValue={post.salary}*/
                            onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}/>
                    </span>
                </div>
                <div className={['tile is-child'].join(" ")}>
                    <label className={["label is-small", styles["ep-remove-marg"]].join(" ")}>Captured On</label>
                    <span className={["control"].join(" ")}>
                        <input className={["input is-static",styles.editorField,styles.indentField,styles.fieldSize].join(" ")} 
                            readOnly={true} type="date" ref={captureTime} /*defaultValue={formatLocaleDateString(post.captureTime,{year: 'numeric', month: 'long', day: 'numeric'})}*/ 
                            onBlur={fieldBlur} onFocus={fieldFocus} onKeyDown={looseFocus}/>
                    </span>
                </div>
            </div>
            
            <div className={["tile is-parent", styles["ep-remove-pad"],styles["ep-row"]].join(" ")}>
                <div className={['tile is-child box'].join(" ")}>
                    <label className={["label is-small", styles["ep-remove-marg"]].join(" ")}>Job Description</label>
                    <span className={["contianer","control"].join(" ")}>
                        <textarea className={["textarea is-focused is-static",styles["ep-textArea"],styles.editorField].join(" ")} 
                            readOnly={true} ref={description} defaultValue={post.description} 
                            onBlur={descBlur} onFocus={descFocus}></textarea>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default EditorPanel;