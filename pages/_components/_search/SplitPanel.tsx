import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { StylableComponent } from '../types';
import EditorPanel from '../_editor/EditorPanel';
import ResultPanel from './_table/ResultPanel';

const SplitPanel = (props:StylableComponent)=>{
    const wrapper = useRef<HTMLDivElement>(null);
    const lhs = useRef<HTMLDivElement>(null);
    const rhs = useRef<HTMLDivElement>(null);
    const handle = useRef<HTMLDivElement>(null);
    const [x,setX] = useState(0);
    const [dragging,setDrag] = useState(false);
    const onDragStart = (event:React.MouseEvent|React.DragEvent) => {
        setDrag(true); console.log("start drag");
        setX(event.screenX);
    };
    const onDragStop = (event:React.MouseEvent|React.DragEvent) => {
        setDrag(false); console.log("end drag");
        setX(event.screenX);
    };
    const onDragMove = (event:React.MouseEvent|React.DragEvent) => {
        if(dragging)
            setX(event.screenX);
    };
    
    const [width,setWidthStep] = useState({ //12 columns defined by css
        lhs:7,
        rhs:5,
    });

    useEffect(()=>{
        if( wrapper.current && x > 0 ){
            
            const widthRatio = x/wrapper.current.clientWidth;
            let breaks = Math.round(widthRatio*10);
            if(breaks < 3) breaks = 3;
            if(breaks > 9) breaks = 9;
            
            setWidthStep({ //12 columns defined by css
                lhs:breaks,
                rhs:12-breaks,
            });
            console.log({ //12 columns defined by css
                lhs:breaks,
                rhs:12-breaks,
            })
        }
    },[x]);

    const lhsClassname = 'is-'+width.lhs;
    const rhsClassname = 'is-'+width.rhs;
    return (
        <div ref={wrapper} className={['tile is-parent', props.className ].join(" ")}>

            <div ref={lhs} className={['tile is-parent',lhsClassname].join(" ")} style={{padding:"0px"}}>
                <ResultPanel layoutWidth={width.lhs}></ResultPanel>
                <div ref={handle} draggable className={['tile is-child is-align-self-center'].join(" ")} onDragStart={onDragStart} onDragEnd={onDragStop} >
                    <FontAwesomeIcon icon={faGripVertical}></FontAwesomeIcon>
                </div>
            </div>

            

            <div ref={rhs} className={['tile is-parent',rhsClassname].join(" ")} >
                <EditorPanel></EditorPanel>
            </div>

        </div>
    );
};
export default SplitPanel;