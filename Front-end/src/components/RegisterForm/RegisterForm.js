import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import FormikInputField from '../FormikInputField';
import FormikSelectField from '../FormikSelectField';
import CreateIcon from '@material-ui/icons/Create';
import { Alert } from '@material-ui/lab/';
import './RegisterForm.scss';
import { validationSchema } from './validationSchema';
import { API_URL, REDIRECT_DELAY, RESPONSE_STATUS } from '../constants';
import { MESSAGES_ERROR, MESSAGES_SUCCESS } from '../messages';

const initialValues = {
    firstName: '',
    lastName: '',
    telephone: '',
    email: '',
    gender: '',
    education: '',
    yearOfBirth: '',
    password: '',
    password2: '',
};

const genderItems = [
    {
        label: 'Male',
        value: 'M',
    },
    {
        label: 'Female',
        value: 'F',
    },
    {
        label: 'Other',
        value: 'O',
    },
];

function FormRegister() {
    const [signUpMessage, setSignUpMessage] = useState('');
    const [signUpMessageStyle, setSignUpMessageStyle] = useState('success');
    const history = useHistory();

    const onSubmit = (values, onSubmitProps) => {
        const valuesForBE = { ...values };
        delete valuesForBE.password2;

        axios
            .create({
                baseURL: API_URL,
                headers: { 'Content-Type': 'application/json;charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
            })
            .post('/public/register', valuesForBE)
            .then((response) => {
                //if response gives success message
                if (response.status === RESPONSE_STATUS.CREATED) {
                    setSignUpMessage(MESSAGES_SUCCESS.USER_CREATE);
                    setSignUpMessageStyle('success');
                    onSubmitProps.resetForm();
                    //user is redirected to login page after set amount of time
                    setTimeout(() => history.push('/login'), REDIRECT_DELAY);
                }
            })
            .catch((error) => {
                //if server is not responding
                if (!error.response) {
                    setSignUpMessage(MESSAGES_ERROR.SERVER_NOT_RESPONDING);
                    setSignUpMessageStyle('error');
                } else {
                    //if entered email is already registered
                    if (error.response.status === RESPONSE_STATUS.CONFLICT) {
                        setSignUpMessage(error.response.data.message);
                        setSignUpMessageStyle('error');
                    }
                    //if there are other errors from server side
                    if (error.response.status === RESPONSE_STATUS.BAD_REQUEST) {
                        setSignUpMessage(MESSAGES_ERROR.BAD_REQUEST);
                        setSignUpMessageStyle('error');
                    }
                }
            });
    };

    return (
        <div className="form-register">
            <h1 className="form-register__heading">Register</h1>
            {/* display error or success message from back end here */}
            {signUpMessage && <Alert severity={signUpMessageStyle}>{signUpMessage}</Alert>}
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                {({ dirty, isValid, errors, touched, setFieldValue }) => {
                    return (
                        <Form noValidate>
                            <FormikInputField
                                label="Name"
                                name="firstName"
                                required
                                errors={errors}
                                touched={touched}
                            />
                            <FormikInputField
                                label="Surname"
                                name="lastName"
                                required
                                errors={errors}
                                touched={touched}
                            />
                            <FormikInputField label="Phone" name="telephone" errors={errors} touched={touched} />
                            <FormikInputField label="Email" name="email" required errors={errors} touched={touched} />
                            <FormikInputField
                                label="Education"
                                name="education"
                                required
                                errors={errors}
                                touched={touched}
                            />
                            <FormikInputField
                                label="Year of birth"
                                name="yearOfBirth"
                                required
                                errors={errors}
                                touched={touched}
                            />

                            <FormikSelectField
                                name="gender"
                                label="Gender"
                                items={genderItems}
                                required
                                errors={errors}
                                touched={touched}
                                setFieldValue={setFieldValue}
                            />
                            <FormikInputField
                                label="Password"
                                name="password"
                                type="password"
                                required
                                errors={errors}
                                touched={touched}
                            />
                            <FormikInputField
                                label="Confirm your password"
                                name="password2"
                                type="password"
                                required
                                errors={errors}
                                touched={touched}
                            />
                            <div className="form-register__actions">
                                <Button
                                    className="create-account__element"
                                    variant="contained"
                                    color="primary"
                                    disabled={!isValid || !dirty}
                                    type="submit"
                                    startIcon={<CreateIcon />}
                                    size="large"
                                >
                                    Create account
                                </Button>

                                <div>
                                    <Link className="form-register__link" to="/login">
                                        <small>Already have an account? Login</small>
                                    </Link>
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

export default FormRegister;
