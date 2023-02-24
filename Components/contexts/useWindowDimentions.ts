/**
 * Clean and minimal implementation attributed to SO community
 * https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
 */
import { useState, useEffect } from 'react';

type WindowDimensions = {width:number, height:number};
function getWindowDimensions() {
    if ( typeof window !== "undefined" ){
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    } else {
        return {
            width : -1,
            height: -1
        };
    }
}
export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>( getWindowDimensions() );

    /**
     * wrapping everything in the useEffect hook to make sure this only runs on client side
     * https://nextjs.org/docs/messages/react-hydration-error
     */
    useEffect( () => {
        function handleResize() {
            setWindowDimensions( getWindowDimensions() );
        }

        window.addEventListener( 'resize', handleResize );
        window.addEventListener( 'load', handleResize );
        return () => {
            window.removeEventListener( 'resize', handleResize );
            window.removeEventListener( 'load', handleResize );
        };
    }, [] );

    return windowDimensions;
}