import React, { useRef, useState, useEffect, DetailedHTMLProps, HTMLAttributes } from 'react';
import QueueTile, {QueueTileProps, QueueTileState} from './QueueTile';
import styles from '../../../styles/scrape/TileChannel.module.scss';
import { IPostDataScrapeRequest } from 'data-service/types';


export interface TileChannelProps {
    className?: string;
    queueData?: IPostDataScrapeRequest[];
    compact?: boolean;
}

const tmp:QueueTileProps = {
    keyword : "full stack engineer",
    location : "Washington DC",
    pageDepth : 2,
    uuid:"65df4gs6df45df4g6d5f4g32",
    state:QueueTileState.ACTIVE,
    className: styles["tile-element"]
};

const TileChannel = (props:TileChannelProps) => {
    const [vizQueue, setVizQueue] = useState<QueueTileProps[]>(props.queueData? props.queueData: []);

    return (
        <div className={["tile is-ancestor", props.className, styles["tile-channel"] ].join(" ")} >
            <div className={["tile", styles["tile-container"] ].join(" ")} >
                <div className={["tile is-parent",styles["tile"]].join(" ")}>
                    <QueueTile {...tmp} state={QueueTileState.COMPLETE} compact={props.compact} />
                </div>
                <div className={["tile is-parent",styles["tile"]].join(" ")}>
                    <QueueTile {...tmp} state={QueueTileState.ACTIVE} compact={props.compact} />
                </div>
                <div className={["tile is-parent",styles["tile"]].join(" ")}>
                    <QueueTile {...tmp} state={QueueTileState.INACTIVE} compact={props.compact} />
                </div>
                
                {vizQueue.map((tile) => {
                    return (
                        <div key={tile.uuid} className={["tile is-parent",styles["tile"]].join(" ")}>
                            <QueueTile {...tmp} state={QueueTileState.INACTIVE} compact={props.compact} />
                        </div>
                    );
                })}
                
            </div>
        </div>
    );
};

export default TileChannel;