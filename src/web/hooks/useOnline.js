import { useWindowEvent } from '@folklore/hooks';
import { useState, useCallback } from 'react';

function useOnline() {
    const [online, setOnline] = useState(
        typeof window !== 'undefined' ? window.navigator.onLine : null,
    );
    const onOnline = useCallback(() => {
        setOnline(true);
    }, [setOnline]);
    const onOffline = useCallback(() => {
        setOnline(false);
    }, []);
    useWindowEvent('online', onOnline);
    useWindowEvent('offline', onOffline);
    return online;
}

export default useOnline;
