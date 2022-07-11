import React from 'react';
import { styled, css, keyframes } from '@stitches/react';
// import styles from '../../styles/ActionLayout.module.scss';


const Panel = (props:any) => { 
    return (
        <div className="panel">
            <p className="panel-heading">
                {props.title}
            </p>
            <div className="panel-block">
                {props.children}
            </div>
             
            <div className="panel-block">
                <button className="button is-link is-outlined is-fullwidth">
                    Reset all filters
                </button>
            </div>
        </div>
            
    );
};
export default Panel;