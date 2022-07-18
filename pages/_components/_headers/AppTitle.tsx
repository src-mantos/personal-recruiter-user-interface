import React from 'react';

const AppTitle = () => { 
    
    return (
        <div className="tile is-ancestor">
            <div className="tile is-parent is-flex-grow-2" style={{padding:"0px"}}>
                <span className='tile is-child primary-font'>
                    Personal Recruter
                </span>
            </div>
            <div className="tile is-parent is-align-items-end" style={{padding:"0px"}}>
                <span className='tile is-child'>
                    Making an informed & data driven choice. 
                </span>
            </div>
        </div>
    );
};
export default AppTitle;
