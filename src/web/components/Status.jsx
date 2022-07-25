import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const propTypes = {
    networks: PropTypes.arrayOf(
        PropTypes.shape({
            ssid: PropTypes.string,
            connected: PropTypes.bool,
        }),
    ),
    online: PropTypes.bool,
    className: PropTypes.string,
};

const defaultProps = {
    networks: [],
    online: true,
    className: null,
};

function Status({ online, networks, className }) {
    const { ssid: connectedNetwork = null } =
        networks.find(({ connected = false }) => connected) || {};
    return (
        <div
            className={classNames([
                'card',
                {
                    'text-bg-success': online,
                    'text-bg-danger': !online,
                    [className]: className !== null,
                },
            ])}
        >
            <div className="card-body text-center">
                <div className="h4 m-4 text-bold">
                    <i
                        className={classNames([
                            'bi',
                            'me-4',
                            {
                                'bi-hand-thumbs-up': online,
                                'bi-x-circle': !online,
                            },
                        ])}
                    />
                    {online ? (
                        <FormattedMessage
                            defaultMessage="Connected to Wi-Fi {network}"
                            description="Status label"
                            values={{
                                network: connectedNetwork,
                            }}
                        />
                    ) : (
                        <FormattedMessage
                            defaultMessage="Not connected"
                            description="Status label"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

Status.propTypes = propTypes;
Status.defaultProps = defaultProps;

export default Status;
