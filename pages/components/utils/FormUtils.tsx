import { IPostData } from 'data-service/types';
import React from 'react';

export const truncEllipsis = (str:string, limit:number):string => {
    if(str && str.length && str.length > limit){
        return str.slice(0, limit)+" ...";
    }
    return str;
};

export const formatLocaleDateString = (dt:Date, opts?:Intl.DateTimeFormatOptions):string => {
    return new Date(dt).toLocaleDateString(
        'en-us',
        (opts)? opts: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour12: true,
            hour: 'numeric',
            minute: '2-digit'
        }
    );
};