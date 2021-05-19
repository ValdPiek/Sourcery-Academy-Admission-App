import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import './AcademyFormCreate.scss';
import axios from 'axios';
import { Button } from '@material-ui/core';
import FormikInputField from '../FormikInputField';
import FormikSelectField from '../FormikSelectField';
import EventAvailableSharpIcon from '@material-ui/icons/EventAvailableSharp';
import { Alert } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import { API_URL, USER_ROLE, CITY_ITEMS, ACADEMY_STATUS_ITEMS, REDIRECT_DELAY } from '../constants';
import { MESSAGES_ERROR, MESSAGES_SUCCESS } from '../messages';
import { validationSchema } from './validationSchema';
import { useHistory } from 'react-router-dom';

//default start and finish times, default start is 4 weeks later than today, default finish is 8 weeks later than today
let now = new Date();
now.setDate(now.getDate() + 4 * 7);
const defaultTimeStart =
    now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + 'T00:00';
now.setDate(now.getDate() + 4 * 7);
const defaultTimeFinish =
    now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + 'T00:00';

const initialValues = {
    academyName: '',
    description: '',
    city: '',
    email: '',
    telephone: '',
    timeStart: defaultTimeStart,
    timeFinish: defaultTimeFinish,
};

const academyStatusItems = ACADEMY_STATUS_ITEMS.slice(0, 2);

function CreateAcademyForm() {
    const user = useSelector((state) => state.userReducer);
    const [createAcademyMessage, setCreateAcademyMessage] = useState('');
    const [alertStyle, setAlertStyle] = useState('success');
    const history = useHistory();

    const onSubmit = (values, onSubmitProps) => {
        const valuesForBE = { ...values };
        valuesForBE.city = valuesForBE.city.join(', ');

        if (user.role === USER_ROLE.ADMIN) {
            axios
                .create({
                    baseURL: API_URL,
                    headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
                })
                .post('/academies', valuesForBE)
                .then((response) => {
                    //if response gives success message
                    if (response.status === 201) {
                        setCreateAcademyMessage(MESSAGES_SUCCESS.ACADEMY_CREATE);
                        setAlertStyle('success');
                        onSubmitProps.resetForm();
                        //user is redirected to created academy's view page after set amount of time
                        setTimeout(() => history.push(`/academies/${response.data.id}`), REDIRECT_DELAY);
                    }
                })
                .catch((error) => {
                    //if server is not responding
                    if (!error.response) {
                        setCreateAcademyMessage(MESSAGES_ERROR.SERVER_NOT_RESPONDING);
                        setAlertStyle('error');
                    } else {
                        setCreateAcademyMessage(MESSAGES_ERROR.BAD_REQUEST);
                        setAlertStyle('error');
                    }
                });
        } else {
            setCreateAcademyMessage(MESSAGES_ERROR.NOT_ADMIN);
            setAlertStyle('error');
        }
    };

    return (
        <div className="form-create-academy">
            <h1 className="form-create-academy__heading">Create new academy</h1>

            {createAcademyMessage && <Alert severity={alertStyle}>{createAcademyMessage}</Alert>}

            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                {({ dirty, isValid, errors, touched, setFieldValue }) => {
                    return (
                        <Form noValidate>
                            <FormikInputField
                                label="Academy name"
                                name="academyName"
                                required
                                errors={errors}
                                touched={touched}
                                variant="filled"
                            />
                            <FormikInputField
                                label="Description"
                                name="description"
                                errors={errors}
                                touched={touched}
                                variant="filled"
                                multiline
                                rowsMax={4}
                            />
                            <FormikSelectField
                                label="Status"
                                name="status"
                                items={academyStatusItems}
                                required
                                errors={errors}
                                touched={touched}
                                setFieldValue={setFieldValue}
                            />
                            <FormikSelectField
                                name="city"
                                label="City"
                                items={CITY_ITEMS}
                                required
                                errors={errors}
                                touched={touched}
                                setFieldValue={setFieldValue}
                                multiple
                            />
                            <FormikInputField
                                label="Start time"
                                name="timeStart"
                                errors={errors}
                                touched={touched}
                                type="datetime-local"
                            />
                            <FormikInputField
                                label="Finish time"
                                name="timeFinish"
                                errors={errors}
                                touched={touched}
                                type="datetime-local"
                            />
                            <FormikInputField
                                label="Email"
                                name="email"
                                errors={errors}
                                touched={touched}
                                variant="filled"
                            />
                            <FormikInputField
                                label="Phone"
                                name="telephone"
                                errors={errors}
                                touched={touched}
                                variant="filled"
                            />

                            <div className="form-create-academy__actions">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    size="large"
                                    startIcon={<EventAvailableSharpIcon />}
                                >
                                    Create academy
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

export default CreateAcademyForm;
