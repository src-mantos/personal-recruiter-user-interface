import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, useImperativeHandle } from 'react';
import styles from '../../styles/ToolTip.module.scss';

export interface IToolTip{
    title?:string,
    desc:string,
    hidden:boolean,
}
export interface IToolTipOperations{
    toggleHidden:{():void}
}


const ToolTip = (props:IToolTip)=>{
    const hiddenStyle = (props.hidden)? styles["tooltip-hidden"]:"";
    return (
        <div className={['box', styles["tooltip"], hiddenStyle ].join(" ")}>
            <div className={['message is-info'].join(" ")}>
                {(props.title)? (<div className='message-header'>{props.title}</div>):(<span/>)}
                
                <div className={['message-body', styles["tooltip-body"]].join(" ")}>
                    {props.desc}
                </div>
            </div>
        </div>
    );
};
export default ToolTip;