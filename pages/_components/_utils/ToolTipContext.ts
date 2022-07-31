import React, { useState } from 'react';
import { ToolTipMessageProps, ToolTipLocationProps } from '../ToolTip';

let ToolTipContext: React.Context<any>;
let msgData: ToolTipMessageProps;
let locData: ToolTipLocationProps;
const dispatcher: { (context: any): void }[] = [];

const getToolTipData = (): any => {
    return { msgData, locData };
};
const setToolTipMessage = (props: ToolTipMessageProps) => {
    msgData = props;
    for (let fn of dispatcher) {
        fn(getToolTipData());
    }
};
const setToolTipLocation = (props: ToolTipLocationProps) => {
    locData = props;
    for (let fn of dispatcher) {
        fn(getToolTipData());
    }
};

export const useToolTipContext = (onChangeHandler?: { (context: any): void }) => {
    if (ToolTipContext === undefined) {
        ToolTipContext = React.createContext(getToolTipData());
    }

    if (onChangeHandler != undefined) dispatcher.push(onChangeHandler);

    return {
        ToolTipContext,
        setMessage: setToolTipMessage,
        setLocData: setToolTipLocation,
        getContextValue: getToolTipData,
    };
};
