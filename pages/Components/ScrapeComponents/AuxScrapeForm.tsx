import { useRef } from "react";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { scrapeRequestState } from "../contexts/ScrapeContext";
import styles from '../../../styles/Components/Form.module.scss';
import { inputFocusSelectAll, onKeyPress, onEnterHandler } from "../FormUtils";

const AuxScrapeForm = () => {
    const [request, setScrapeReuest] = useRecoilState(scrapeRequestState);
    // useRecoilValueLoadable(makeRequestSelector);

    const requestPageDepth = useRef<HTMLInputElement>(null);
    const setPageDepth = ()=>{
        if(requestPageDepth.current?.value !== undefined){
            const pageDepth = parseInt(requestPageDepth.current.value);
            setScrapeReuest({ ...request, pageDepth });
        }
    };
    const updateKeyListener = onKeyPress(['Tab','Enter'],setPageDepth);

    const makeQueueRequest = ()=>{
        if(request.keyword !== undefined && request.keyword.length > 1 
            && request.pageDepth !== undefined && request.pageDepth > 0){
            setScrapeReuest({ ...request, sendRequest:true });
        }
    };
    return (
        <div className={['column is-vertical is-1','is-flex-grow-0'].join(" ")}>
            <div className={['control'].join(" ")} >
                <button className={['button is-info is-fullwidth'].join(" ")} 
                    tabIndex={4}
                    onKeyDown={onEnterHandler(makeQueueRequest)}
                    onClick={makeQueueRequest}>
                    Queue
                </button>
            </div>
            <div className={['control'].join(" ")} >
                <input className={["input", styles["ssf-btn-width"] ].join(" ")}
                    ref={requestPageDepth} 
                    placeholder='Page Depth' 
                    defaultValue={request.pageDepth}
                    type="number"
                    tabIndex={3}
                    onFocus={inputFocusSelectAll} 
                    onBlur={setPageDepth}
                    onKeyDown={updateKeyListener}
                    style={{ padding:"0 0 0 10px" }}/>
            </div>
        </div>
    );
};
export default AuxScrapeForm;