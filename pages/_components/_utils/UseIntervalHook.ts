import { useRef, useEffect } from 'react';
/**
 * Credit to the original author
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export const useInterval = (callback: { (): Promise<any> }, delay: number) => {
    const savedCallback = useRef<{ (): Promise<any> }>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            if (savedCallback.current != undefined) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};
