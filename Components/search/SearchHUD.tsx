import React from 'react';
import FormStyles from '../../styles/Components/Form.module.scss';

import SearchControls from './SearchControls';
import FilterDisplay from './FilterDisplay';


const SearchHUD = ( ) => (
    <div className={['tile is-ancestor', FormStyles['app-border'], FormStyles['app-border-top'], FormStyles['app-border-break'] ].join( " " )}>
        <div className={['tile is-parent is-vertical'].join( " " )}>

            <div className={['tile is-child'].join( " " )} style={{ marginBottom: "0 !important" }}>
                <span style={{ paddingLeft: "0.75rem" }}>Post Data Search</span>
            </div>
            <div className={['tile is-child', 'columns'].join( " " )}>

                <SearchControls></SearchControls>

                <div className={['column is-vertical is-half', 'control'].join( " " )}
                    style={{ overflow: "auto", maxHeight: "400px", padding: 0 }}>
                    <FilterDisplay></FilterDisplay>
                </div>

            </div>
        </div>
    </div>
);
export default SearchHUD;