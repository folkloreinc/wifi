import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import io from 'socket.io-client';

import { NetworkProvider } from '../contexts/NetworkContext';
import Interface from './Interface';

import '../styles/styles.scss';

const socket = io();

const propTypes = {
    networks: PropTypes.arrayOf(
        PropTypes.shape({
            ssid: PropTypes.string,
        }),
    ),
    online: PropTypes.bool,
    locale: PropTypes.string,
};

const defaultProps = {
    networks: [],
    online: false,
    locale: 'en',
};

function App({ online: initialOnline, networks: initialNetworks, locale }) {
    const [online, setOnline] = useState(initialOnline);
    const [networks, setNetworks] = useState(initialNetworks);

    useEffect(() => {
        socket.on('status', ({ online: newOnline, networks: newNetworks }) => {
            setOnline(newOnline);
            setNetworks(newNetworks);
        });

        socket.on('online', (newOnline) => {
            setOnline(newOnline);
        });

        socket.on('networks', (newNetworks) => {
            setNetworks(newNetworks);
        });

        return () => {
            socket.off('status');
            socket.off('online');
            socket.off('networks');
        };
    }, [setOnline, setNetworks]);

    return (
        <NetworkProvider online={online} networks={networks}>
            <IntlProvider locale={locale}>
                <Interface />
            </IntlProvider>
        </NetworkProvider>
    );
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
