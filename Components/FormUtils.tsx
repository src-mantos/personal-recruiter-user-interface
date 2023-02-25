import { IPostData } from 'data-service/types';
import React from 'react';


export const truncEllipsis = ( str:string|undefined, limit:number ):string|undefined => {
    if ( str !== undefined && str.length && str.length+3 > limit )
        return str.slice( 0, limit )+" ...";

    return str;
};

export const onEnterHandler = ( action:{( event: React.KeyboardEvent ):void}|{():void}):{( event: React.KeyboardEvent ):void} => ( event: React.KeyboardEvent ) => {
    if ( event.key === 'Enter' )
        action( event );
};