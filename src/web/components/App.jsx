import PropTypes from 'prop-types';
import React from 'react';

import ConnectForm from './ConnectForm';

import styles from '../styles/app.module.scss';
import '../styles/styles.scss';

const propTypes = {
    networks: PropTypes.arrayOf(
        PropTypes.shape({
            ssid: PropTypes.string,
        }),
    ),
    online: PropTypes.bool,
};

const defaultProps = {
    networks: [],
    online: true,
};

function App({ online, networks }) {
    const { ssid: connectedNetwork = null } =
        networks.find(({ connected = false }) => connected) || {};
    return (
        <div className={styles.container}>
            <div className="container">
                {online ? (
                    <div className="row justify-content-center mt-4">
                        <div className="col-6">
                            <div className="card text-bg-success">
                                <div className="card-body  text-center p-4">
                                    <div className="h4 m-4 text-bold">
                                        <i className="bi bi-hand-thumbs-up" /> Connecté
                                        au réseau {connectedNetwork}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
                <div className="row justify-content-center mt-4">
                    <div className="col-6">
                        <div className="card">
                            <div className="card-body">
                                {online ? <h4 className="mb-4">Modifier le réseau</h4> : null}
                                <ConnectForm networks={networks} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
