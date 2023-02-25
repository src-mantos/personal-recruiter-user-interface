import React, { useEffect, useState } from 'react';
import { ActiveScrapeRequest, DelayedTask, StylableComponent } from '../types';
import FormStyles from '../../styles/Components/Form.module.scss';
import { useRecoilState } from 'recoil';
import { queueState, scrapeRequestState } from '../contexts/ScrapeContext';
import { faSearch, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ScrapeControls = ( props?:StylableComponent ) => {
    const [reqScrape, setScrapeRequest] = useRecoilState( scrapeRequestState );
    const [queueObj, setQueueState] = useRecoilState( queueState );


    const fetchQueueState = new DelayedTask( () => { setQueueState({ ...queueObj, sendRequest: true, queue: [...queueObj.queue, reqScrape as ActiveScrapeRequest]}) }, 200 );
    const queueAction = () => {
        if ( reqScrape.keyword !== undefined && reqScrape.keyword !== '' ){
            /*TODO: remove stubb*/
            setScrapeRequest({ ...reqScrape, sendRequest: true, uuid: "stub-"+Math.random().toString(), requestTime: new Date() });
            fetchQueueState.execute();
        }
    };


    const inputHandler = ( event:React.ChangeEvent<HTMLInputElement>|React.KeyboardEvent<HTMLInputElement> ) => {
        const valueObj:Record<string, string|number|undefined> = {};
        const dataKey = event.currentTarget.getAttribute( 'data-key' );
        const dataType = event.currentTarget.getAttribute( 'data-type' );
        if ( dataKey !== null && dataType !== null ){
            const val = event.currentTarget.value;
            switch ( dataType ){
                case "string":
                    valueObj[dataKey] = ( val !== '' )? val : undefined;
                    break;
                case "number":
                    valueObj[dataKey] = ( isNaN( parseInt( val ) ) )? undefined : parseInt( val );
                    break;
                default:
                    valueObj[dataKey] = val;
            }

            if ( valueObj[dataKey] !== undefined )
                if ( event.type === 'change' ){
                    setScrapeRequest({ ...reqScrape, ...valueObj });
                } else {
                    const ev = event as React.KeyboardEvent<HTMLInputElement>;
                    if ( ['Tab', 'Enter'].indexOf( ev.key ) !== -1 ){
                        setScrapeRequest({ ...reqScrape, ...valueObj });
                        if ( ev.key === 'Enter' && dataKey === 'keyword' )
                            queueAction();
                    }
                }

        }
    };

    const controlSpaceStyle:React.CSSProperties = { marginBottom: ".1em" };
    return (
        <div className={['columns'].join( " " )}>

            <div className={['column is-vertical is-four-fifths'].join( " " )} style={{ paddingRight: "5px" }}>
                <div className={['control has-icons-right'].join( " " )} style={controlSpaceStyle}>
                    <input
                        className={["input"].join( " " )}
                        type="text"
                        tabIndex={1}
                        placeholder="Job Post Keywords"
                        data-key="keyword"
                        data-type="any"
                        onChange={inputHandler}
                        onKeyDown={inputHandler}
                    />
                    <span className={["icon is-small is-right"].join( " " )}>
                        <FontAwesomeIcon icon={faSearch}/>
                    </span>
                </div>
                <div className={['control has-icons-right'].join( " " )} title="Location (Optional)">
                    <input
                        className={["input"].join( " " )}
                        type="text"
                        tabIndex={2}
                        placeholder="Job Location"
                        data-key="location"
                        data-type="string"
                        onChange={inputHandler}
                        onKeyDown={inputHandler}
                        onFocus={( event:React.FocusEvent<HTMLInputElement, Element> ) => {
                            event.target.select();
                        }}
                    />
                    <span className={["icon is-small is-right"].join( " " )}>
                        <FontAwesomeIcon icon={faMapLocationDot}/>
                    </span>
                </div>
            </div>

            <div className={['column is-vertical is-one-fifth'].join( " " )} style={{ paddingLeft: "5px" }}>
                <div className={['control'].join( " " )} style={controlSpaceStyle}>
                    <button
                        className={['button is-info is-fullwidth'].join( " " )}
                        tabIndex={4}
                        onClick={queueAction}
                    >
                        Queue
                    </button>
                </div>
                <div className={['control'].join( " " )} >
                    <input
                        className={["input", FormStyles["ssf-btn-width"] ].join( " " )}
                        placeholder="Page Depth"
                        defaultValue={"3 Pages"}
                        data-key="pageDepth"
                        data-type="number"
                        tabIndex={3}
                        style={{ padding: "0 0 0 10px" }}
                        onChange={inputHandler}
                        onKeyDown={inputHandler}
                        onFocus={( event:React.FocusEvent<HTMLInputElement, Element> ) => {
                            const val = event.target.value;
                            event.target.value = val.replaceAll( /\D/g, '' );
                            event.target.select();
                        }}
                        onBlur={( event:React.FocusEvent<HTMLInputElement, Element> ) => {
                            const val = event.target.value;
                            let p:number = parseInt( val.replaceAll( /\D/g, '' ) );

                            if ( isNaN( p ) )
                                p=( reqScrape.pageDepth !== undefined )? reqScrape.pageDepth : -1;
                            let dv:string = ''+p;
                            if ( p>1 ) dv+= " Pages"; else dv+= " Page";
                            event.target.value = dv;
                        }}
                    />
                </div>
            </div>

        </div>
    );
};
export default ScrapeControls;