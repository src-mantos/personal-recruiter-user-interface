import React from 'react';
import { styled, css, keyframes } from '@stitches/react';
import { theme } from '../../stitches.config';
import styles from '../../styles/ActionLayout.module.scss';


const AppHeader = () => { 
    
    return (
        <div className="columns">
            <div className="column is-two-fifths">
                <span className='primary-font' style={{display:"inline-block"}}>Personal Recruter</span>
                
            </div>
            <div className="column">
                <span style={{display:"inline-block"}}>Making an informed data driven choice.</span>
            </div>
            
        </div>
    );
};
export default AppHeader;
