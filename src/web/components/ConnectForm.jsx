/* eslint-disable jsx-a11y/label-has-associated-control, react/jsx-props-no-spreading */
import { useForm } from '@folklore/forms';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

const propTypes = {
    online: PropTypes.bool,
    networks: PropTypes.arrayOf(
        PropTypes.shape({
            ssid: PropTypes.string,
        }),
    ),
    onClickRefresh: PropTypes.func,
    className: PropTypes.string,
};

const defaultProps = {
    online: false,
    networks: [],
    onClickRefresh: null,
    className: null,
};

function ConnectForm({ online, networks, className, onClickRefresh }) {
    const ssids = useMemo(
        () =>
            networks.reduce(
                (names, { ssid }) => (names.indexOf(ssid) === -1 ? [...names, ssid] : names),
                [],
            ),
        [networks],
    );
    const getFieldValue = useCallback(({ currentTarget }) => currentTarget.value, []);
    const { fields, onSubmit, status } = useForm({
        fields: ['ssid', 'password'],
        action: '/connect',
        initialValue:
            ssids.length > 0
                ? {
                      ssid: ssids[0],
                  }
                : null,
        getFieldValue,
    });
    return (
        <div
            className={classNames([
                'card',
                {
                    [className]: className !== null,
                },
            ])}
        >
            <div className="card-body">
                {online ? (
                    <h4 className="mb-4">
                        <FormattedMessage defaultMessage="Switch Wi-Fi" description="Form title" />
                    </h4>
                ) : (
                    <h4 className="mb-4">
                        <FormattedMessage
                            defaultMessage="Connect to Wi-Fi"
                            description="Form title"
                        />
                    </h4>
                )}
                <form action="/connect" method="post" onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="ssid">
                            <FormattedMessage
                                defaultMessage="Wi-Fi network:"
                                description="Field label"
                            />
                        </label>
                        <div className="input-group">
                            <select
                                name="ssid"
                                className="form-control form-control-lg"
                                required
                                disabled={ssids.length === 0}
                                {...fields.ssid}
                            >
                                {ssids.length > 0 ? (
                                    ssids.map((ssid) => (
                                        <option value={ssid} key={`option-${ssid}`}>
                                            {ssid}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No network found.</option>
                                )}
                            </select>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onClickRefresh}
                            >
                                <i className="bi bi-arrow-clockwise" />
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label" htmlFor="password">
                            <FormattedMessage
                                defaultMessage="Wi-Fi password:"
                                description="Field label"
                            />
                        </label>
                        <input
                            type="text"
                            name="password"
                            className="form-control form-control-lg"
                            required
                            {...fields.password}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="btn btn-lg btn-primary"
                            disabled={status === 'loading'}
                        >
                            <FormattedMessage defaultMessage="Connect" description="Button label" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

ConnectForm.propTypes = propTypes;
ConnectForm.defaultProps = defaultProps;

export default ConnectForm;
