import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { useOnline, useNetworks } from '../contexts/NetworkContext';
import ConnectForm from './ConnectForm';
import Status from './Status';

import '../styles/styles.scss';

const propTypes = {
    className: PropTypes.string,
    onRefreshNetworks: PropTypes.func,
};

const defaultProps = {
    className: null,
    onRefreshNetworks: null,
};

function Interface({ className, onRefreshNetworks }) {
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
                <div
                    className={classNames([
                        'col-lg-5',
                        'd-flex',
                        {
                            'flex-column-reverse': !online,
                            'flex-column': online,
                        },
                    ])}
                >
                    <Status
                        online={online}
                        networks={networks}
                        className={classNames([
                            {
                                'mb-4': online,
                                'mt-4': !online,
                            },
                        ])}
                    />
                    <ConnectForm networks={networks} onClickRefresh={onRefreshNetworks} />
                </div>
            </div>
        </div>
    );
}

Interface.propTypes = propTypes;
Interface.defaultProps = defaultProps;

export default Interface;
