import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';

enum AsyncStatus {
    INIT = 'initialized',
    REQ = 'requested',
    RUN = 'running',
    DONE = 'complete',
}
interface AsyncState {
    status: AsyncStatus;
    props: any;
    output: any | undefined;
}
interface AsyncAction {
    type: string;
    param: any;
}

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

export const useAsyncWaterfall = (functionChain: { (props?: any): Promise<any> }[], initProps?: any) => {
    interface Registry extends Record<number, any> {}

    const [chain, _setFunCh] = useState(functionChain);
    const [index, setIndex] = useState(-1);
    const [registry, setRegistry] = useState<Registry>({});

    const executeLink = useCallback(async () => {
        const param = registry[index - 1];
        registry[index] = await chain[index](param);
        setRegistry({ ...registry });
        setIndex(index + 1);
    }, [chain, index, registry, setRegistry, setIndex]);

    useEffect(() => {
        if (index >= 0) executeLink();
    }, [executeLink, index]);

    const run = useCallback(() => {
        setIndex(0);
    }, [setIndex]);
    const stop = useCallback(() => {
        setIndex(-1);
    }, [setIndex]);

    return [run, stop];
};

export const useAsync = <T extends {}>(fn: { (props?: T): Promise<any> }, defaultProps?: T) => {
    // *execute *dispatch fn *update props

    const [status, setStatus] = useState(AsyncStatus.INIT);
    const [properties, setProps] = useState(defaultProps);
    const [output, setOutput] = useState(undefined);

    const func = useCallback(() => {
        (async () => {
            const result = await fn(properties);
            setOutput(result);
            setStatus(AsyncStatus.DONE);
        })();
    }, [fn, properties, setOutput, setStatus]);

    useEffect(() => {
        if (status == AsyncStatus.REQ) {
            console.log('Fire Async', properties);
            setStatus(AsyncStatus.RUN);
            func();
        }
    }, [status, properties, func, setStatus]);

    const run = (props?: T) => {
        if (props != undefined) {
            setProps(props);
        }
        if (status == AsyncStatus.INIT) {
            setStatus(AsyncStatus.REQ);
        } else {
            setStatus(AsyncStatus.INIT);
            setStatus(AsyncStatus.REQ);
        }
    };
    const reset = () => {
        setStatus(AsyncStatus.INIT);
        setOutput(undefined);
    };

    return {
        run,
        reset,
        status,
        output,
        setProps,
    };
};
