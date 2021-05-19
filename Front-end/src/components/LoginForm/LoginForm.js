import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.scss';
import { Link } from 'react-router-dom';
import { Field, Formik, Form, ErrorMessage } from 'formik';
import { Button, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import PropTypes from 'prop-types';
import { USER_ROLE, RESPONSE_STATUS, API_URL } from '../constants';
import { useDispatch } from 'react-redux';
import { storeUserInfo } from '../../state/actions/user';
import { validationSchema } from './validationSchema';
import { MESSAGES_ERROR } from '../messages';

FormLogin.propTypes = {
    history: PropTypes.object,
    push: PropTypes.func,
};

function FormLogin(props) {
    const initialValues = {
        email: '',
        password: '',
    };

    const [isErrorMsg, setIsErrorMsg] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');

    const dispatch = useDispatch();
    let loggedInUser = { credentials: '', id: '', role: '', firstName: '' };

    const handleClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsErrorMsg(false);
    };

    const redirectToDashboard = () => {
        props.history.push('/dashboard');
    };

    const redirectToHome = () => {
        props.history.push('/home');
    };

    const onSubmit = (data) => {
        axios({
            method: 'get',
            url: `${API_URL}/login`,
            data,
            auth: {
                username: data.email,
                password: data.password,
            },
            headers: { 'Content-Type': 'application/json;charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
        })
            .then((response) => {
                if (
                    response.status === RESPONSE_STATUS.OK &&
                    (response.data.role === USER_ROLE.STUDENT || response.data.role === USER_ROLE.ADMIN)
                ) {
                    //set logged in users data into global state
                    loggedInUser.credentials = btoa(data.email + ':' + data.password);
                    loggedInUser.id = response.data.id;
                    loggedInUser.role = response.data.role;
                    loggedInUser.firstName = response.data.firstName;
                    dispatch(storeUserInfo(loggedInUser));
                    redirectToDashboard();
                } else {
                    redirectToHome();
                }
            })

            .catch((error) => {
                //if server is not responding
                if (!error.response) {
                    setIsErrorMsg(true);
                    setLoginMessage(MESSAGES_ERROR.SERVER_NOT_RESPONDING);
                } else {
                    if (error.response.status === RESPONSE_STATUS.UNAUTHORIZED) {
                        setIsErrorMsg(true);
                        setLoginMessage(MESSAGES_ERROR.WRONG_CREDENTIALS);
                    } else if (error.request) {
                        redirectToHome();
                    }
                }
            });
    };

    return (
        <div className="form-login">
            <h1 className="form-login__heading">Login</h1>

            {isErrorMsg && (
                <Alert className="form-login__error" onClose={handleClose} severity="error">
                    {loginMessage}
                </Alert>
            )}

            <Formik {...{ initialValues, validationSchema, onSubmit }}>
                {({ errors, touched }) => {
                    return (
                        <Form>
                            <Field
                                as={TextField}
                                required
                                autoComplete="off"
                                id="email"
                                name="email"
                                type="email"
                                label="Email address"
                                fullWidth
                                error={errors.email && touched.email ? true : false}
                                helperText={<ErrorMessage name="email" />}
                            />

                            <Field
                                as={TextField}
                                required
                                autoComplete="off"
                                id="password"
                                name="password"
                                type="password"
                                label="Password"
                                fullWidth
                                error={errors.password && touched.password ? true : false}
                                helperText={<ErrorMessage name="password" />}
                            />

                            <div className="form-login__actions">
                                <Button type="submit" variant="contained" color="primary">
                                    Login
                                </Button>
                                <br />
                                <Link className="form-login__link" to="/register">
                                    <small>No account? Register</small>
                                </Link>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

export default FormLogin;
