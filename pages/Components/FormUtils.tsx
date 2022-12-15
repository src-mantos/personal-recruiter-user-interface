import { IPostData } from 'data-service/types';
import React from 'react';

interface AnyMap { [key: string]: any }

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

export const inputFocusSelectAll = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();

export function domValueGetter<T>(el:React.RefObject<HTMLInputElement>, defaultValue:T):T {
    const hasValue = el.current?.value != undefined && el.current?.value != null && el.current?.value.trim() != "";
    if(hasValue){
        const value = el.current.value;
        switch (typeof defaultValue) {
        case "number":
            return parseInt(value) as unknown as T;
        case "object":
            if(defaultValue instanceof Date){
                return new Date(value) as unknown as T;
            }
        case "symbol":
        case "string":
        case "undefined":
        default:
            return value as unknown as T;
        }
    }
    return defaultValue;
};


export const urlBuilder = (baseURI: string) => {
    const uri = baseURI;
    const params: { param: string; value: string }[] = [];
    const addGetParam = (param: string, value: string) => {
        params.push({ param, value });
    };
    const generateParams = () => {
        return params.map((value, _index, _all) => {
            const { param, value: val } = value;
            return encodeURIComponent(param) + '=' + encodeURIComponent(val);
        });
    };
    const toString = () => {
        const paramArray = generateParams();
        if (paramArray.length > 0) {
            return uri + '?' + paramArray.join('&');
        }
        return uri;
    };
    return { getURL: toString, addGetParam };
};

export const onEnterHandler = (action:{(event: React.KeyboardEvent):void}|{():void}):{(event: React.KeyboardEvent):void} =>{
    return (event: React.KeyboardEvent) => {
        if(event.key === 'Enter'){
            action(event);
        }
    };
};
export const onTabHandler = (action:{():void}):{(event: React.KeyboardEvent):void} =>{
    return (event: React.KeyboardEvent) => {
        if(event.key === 'Tab'){
            action();
        }
    };
};

export const onKeyPress = (keys:string[], action:{():void}):{(event: React.KeyboardEvent):void} =>{
    return (event: React.KeyboardEvent) => {
        if(keys.indexOf(event.key) !== -1){
            action();
        }
    };
};