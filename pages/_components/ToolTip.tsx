import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, useImperativeHandle, useMemo, useCallback } from 'react';
import styles from '../../styles/ToolTip.module.scss';
import { useToolTipContext } from './_utils/ToolTipContext';

export interface ToolTipMessageProps{
    title?:string;
    desc:string;
}
export interface ToolTipLocationProps{
    hidden:boolean;
    location?: HTMLElement|any;
}

export interface ToolTipHandler {
    setMessage: React.Dispatch<React.SetStateAction<ToolTipMessageProps | undefined>>;
    setLocation: React.Dispatch<React.SetStateAction<ToolTipLocationProps | undefined>>;
}



const ToolTip = (_props: ToolTipMessageProps & ToolTipLocationProps)=>{
    const {ToolTipContext} = useToolTipContext();
    return (
        <ToolTipContext.Consumer>
            {value => {
                let location = value.locData?.location;
                if(location == undefined) location = {pageX:0,pageY:0};

                const props = value.msgData;
                return (
                    <div className={['box', styles["tooltip"] ].join(" ")} style={{left:location.pageX, top:location.pageY}}>
                        <div className={['message is-info'].join(" ")} style={{margin:"0px",padding:"0px"}}>
                            {(props.title)? (<div className='message-header'>{props.title}</div>):""}
                
                            <div className={['message-body', styles["tooltip-body"]].join(" ")} style={{margin:"0px"}} >
                                {(props)?props.desc:""}
                            </div>
                        </div>
                    </div>
                );
            }}
        </ToolTipContext.Consumer>
    );
};
export default ToolTip;