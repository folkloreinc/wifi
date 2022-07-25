/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';

const NetworkContext = React.createContext({
    online: false,
    networks: [],
});

export function useNetworkContext() {
    return useContext(NetworkContext);
}

export function useOnline() {
    const { online } = useNetworkContext();
    return online;
}

export function useNetworks() {
    const { networks } = useNetworkContext();
    return networks;
}

export function useCurrentNetwork() {
    const { networks } = useNetworkContext();
    return networks.find(({ connected = false }) => connected) || null;
}

const propTypes = {
    online: PropTypes.bool.isRequired,
    networks: PropTypes.arrayOf(
        PropTypes.shape({
            ssid: PropTypes.string,
            online: PropTypes.bool,
        }),
    ).isRequired,
    children: PropTypes.node.isRequired,
};

const defaultProps = {};

export function NetworkProvider({ online, networks, children }) {
    const value = useMemo(
        () => ({
            online,
            networks,
        }),
        [online, networks],
    );
    return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

NetworkProvider.propTypes = propTypes;
NetworkProvider.defaultProps = defaultProps;

export default NetworkContext;
