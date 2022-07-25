import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { useOnline, useNetworks } from '../contexts/NetworkContext';
import ConnectForm from './ConnectForm';
import Status from './Status';

import '../styles/styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: null,
};

function Interface({ className }) {
    const online = useOnline();
    const networks = useNetworks();
    return (
        <div
            className={classNames([
                'container',
                {
                    [className]: className !== null,
                },
            ])}
        >
            <div className="row justify-content-center mt-4">
                <div className="col-lg-6">
                    <Status online={online} networks={networks} />
                </div>
            </div>
            <div className="row justify-content-center mt-4">
                <div className="col-lg-6">
                    <ConnectForm networks={networks} />
                </div>
            </div>
        </div>
    );
}

Interface.propTypes = propTypes;
Interface.defaultProps = defaultProps;

export default Interface;
