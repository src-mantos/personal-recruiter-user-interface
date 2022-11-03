import { faSearch, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import { scrapeRequestState } from "../contexts/ScrapeContext";
import { onEnterHandler, inputFocusSelectAll, onKeyPress } from "../FormUtils";

const PrimaryScrapeForm = () => {
    const [request, setScrapeReuest] = useRecoilState(scrapeRequestState);

    const requestKeywords = useRef<HTMLInputElement>(null);
    const setKeywords = ()=>{
        if(requestKeywords.current?.value !== undefined && requestKeywords.current?.value !== ''){
            setScrapeReuest({ ...request, keyword: requestKeywords.current.value });
        }
    };
    const keywordKeyListner = onKeyPress(['Tab','Enter'],setKeywords);

    const requestLocation = useRef<HTMLInputElement>(null);
    const setLocation = ()=>{
        if(request != undefined && requestLocation.current?.value !== undefined && requestLocation.current?.value !== ''){
            setScrapeReuest({ ...request, location: requestLocation.current.value });
        }
    };
    const locationKeyListner = onKeyPress(['Tab','Enter'],setLocation);
    return (
        <div className={['column is-vertical','is-4'].join(" ")}>
            <div className={['control has-icons-right'].join(" ")} >
                <input className={["input"].join(" ")} 
                    ref={requestKeywords} 
                    type="text" 
                    onFocus={inputFocusSelectAll} 
                    onKeyDown={keywordKeyListner}
                    onBlur={setKeywords}
                    tabIndex={1}
                    placeholder='Job Post Keywords'/>
                <span className={["icon is-small is-right"].join(" ")}>
                    <FontAwesomeIcon icon={faSearch}/>
                </span>
            </div>
            <div className={['control has-icons-right'].join(" ")} title='Location (Optional)'>
                <input className={["input"].join(" ")}
                    ref={requestLocation}
                    type="text" 
                    onFocus={inputFocusSelectAll} 
                    onKeyDown={locationKeyListner} 
                    onBlur={setLocation}
                    tabIndex={2}
                    placeholder='Job Location'/>
                <span className={["icon is-small is-right"].join(" ")}>
                    <FontAwesomeIcon icon={faMapLocationDot}/>
                </span>
            </div>
        </div>
    );
};
export default PrimaryScrapeForm;