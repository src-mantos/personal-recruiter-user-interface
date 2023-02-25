import React from 'react';
import HudStyles from '../../styles/Components/ScrapeHUD.module.scss';
import ScrapeControls from './ScrapeControls';
import ScrapeDisplay from './ScrapeDisplay';


const ScrapeHUD = ( ) => (
    <div className={['tile is-ancestor', HudStyles["scrape-background"] ].join( " " )}>
        <div className={['tile is-parent is-vertical'].join( " " )}>
            <div className={['tile is-child'].join( " " )} style={{ marginBottom: '0px !important' }}>
                <span style={{ paddingLeft: "0.75rem" }}>Scrape Job Post Data</span>
            </div>
            <div className={['tile is-child columns', HudStyles["scrape-column-height"]].join( " " )}>
                <div className={['column is-two-fifths'].join( " " )}>

                    <ScrapeControls></ScrapeControls>

                </div>
                <div className={['column'].join( " " )} style={{ borderLeft: '1px solid rgb(201 201 201)', overflowX: 'inherit', overflowY: 'hidden' }}>

                    <ScrapeDisplay></ScrapeDisplay>

                </div>
            </div>
        </div>
    </div>
);
export default ScrapeHUD;