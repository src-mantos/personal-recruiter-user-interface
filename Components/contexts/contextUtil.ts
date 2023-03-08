import { AtomEffect } from 'recoil';
import { ActiveScrapeRequest, AsyncState, MakeRequest, ScrapeQueue, UserScrapeRequest } from '../types';


export const baseUrl = ( process.env.NEXT_PUBLIC_DATA_URL )? process.env.NEXT_PUBLIC_DATA_URL : 'http://localhost:8080/dataservice/';
console.log( "init check", { baseUrl, envVar: process.env.NEXT_PUBLIC_DATA_URL });

export const requestLog:{( key:string ):AtomEffect<any>} = ( key:string ) => ({ onSet }) => {
    onSet( ( newVal ) => {
        if ( newVal.sendRequest )
            console.info( "Request: "+key, newVal );
    });
};
export const recoilLog:{( key:string ):AtomEffect<any>} = ( key:string ) => ({ onSet }) => {
    onSet( ( newVal ) => {
        console.info( "SET "+key, newVal );
    });
};

export const resetAsyncStatus:AtomEffect<any> = ({ onSet, setSelf }) => {
    onSet( ( hasRequest ) => {
        if ( hasRequest.asyncState && hasRequest.asyncState == AsyncState.Complete )
            setTimeout( () => {
                setSelf({ ...hasRequest, asyncState: AsyncState.Pending });
                console.log( "resetting search state", AsyncState.Pending );
            }, 500 );
    });
};