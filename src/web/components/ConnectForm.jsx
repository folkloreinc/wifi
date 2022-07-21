/* eslint-disable jsx-a11y/label-has-associated-control, react/jsx-props-no-spreading */
import { useForm } from '@folklore/forms';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo, useCallback } from 'react';

import styles from '../styles/connect-form.module.scss';

const propTypes = {
    networks: PropTypes.arrayOf(
        PropTypes.shape({
            ssid: PropTypes.string,
        }),
    ),
    className: PropTypes.string,
};

const defaultProps = {
    networks: [],
    className: null,
};

function ConnectForm({ networks, className }) {
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
        initialValue: ssids.length > 0 ? {
            ssid: ssids[0]
         } : null,
        getFieldValue,
    });
    return (
        <form
            className={classNames([
                styles.container,
                {
                    [className]: className !== null,
                },
            ])}
            action="/connect"
            method="post"
            onSubmit={onSubmit}
        >
            <div className="mb-3">
                <label className="form-label" htmlFor="ssid">
                    Réseau
                </label>
                <select
                    name="ssid"
                    className="form-control form-control-lg"
                    required
                    {...fields.ssid}
                >
                    {ssids.map((ssid) => (
                        <option value={ssid}>{ssid}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="form-label" htmlFor="password">
                    Mot de passe
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
                <button type="submit" className="btn btn-lg btn-primary" disabled={status === 'loading'}>
                    Se connecter
                </button>
            </div>
        </form>
    );
}

ConnectForm.propTypes = propTypes;
ConnectForm.defaultProps = defaultProps;

export default ConnectForm;
