import { IPostDataScrapeRequest } from 'data-service/types';
import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes } from 'react';
import styles from '../../../styles/scrape/QueueTile.module.scss';

export interface QueueTileProps extends IPostDataScrapeRequest{
    className?: string;
    state?: QueueTileState;
    compact?: boolean;
}

export enum QueueTileState {
    ACTIVE = "qt-active",
    COMPLETE = "qt-done",
    INACTIVE = "qt-pending",
}



const QueueTile = (props:QueueTileProps)=>{

    // const [compact, setCompact] = useState( (props.compact)? props.compact : false);
    const [state, setState] = useState( (props.state)? props.state : QueueTileState.INACTIVE);

    const compactStyle = (className:string):string =>{
        return (props.compact === undefined || !props.compact)? styles[className]: styles[className+"-compact"];
    };

    return (
        <div className={['tile is-ancestor', props.className].join(" ")}>
            <div className={['box is-parent is-vertical', styles['qt'], styles[state] ].join(" ")}>
                <div className={['tile is-child', compactStyle('qt-text-primary') ].join(" ")}>
                    {props.keyword}
                </div>
                <div className={['tile is-child', compactStyle('qt-text-secondary') ].join(" ")}>
                    {props.location}
                </div>
                <div className={['tile is-child', compactStyle('qt-text-secondary'), props.compact? styles['qt-hidden']:"" ].join(" ")}>
                    {props.uuid}
                </div>
            </div>
        </div>
    );
};

export default QueueTile;