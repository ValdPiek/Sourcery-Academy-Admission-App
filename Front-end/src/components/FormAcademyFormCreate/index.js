import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import './FormAcademyFormCreate.scss';
import axios from 'axios';
import { Button } from '@material-ui/core';
import FormikInputField from '../FormikInputField';
import FormikSelectField from '../FormikSelectField';
import EventAvailableSharpIcon from '@material-ui/icons/EventAvailableSharp';
import { Alert } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import { API_URL, USER_ROLE, FORM_STATUS_ITEMS, REDIRECT_DELAY } from '../constants';
import { MESSAGES_ERROR, MESSAGES_SUCCESS } from '../messages';
import { validationSchema } from './validationSchema';
import { useHistory, useParams } from 'react-router-dom';

//default start and finish times, default start is 4 weeks later than today at 4pm, default finish is 2 hours later than start time
let now = new Date();
now.setDate(now.getDate() + 4 * 7);
const defaultTimeStart =
    now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + 'T16:00';
const defaultTimeFinish =
    now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + 'T18:00';

const initialValues = {
    formName: '',
    description: '',
    status: FORM_STATUS_ITEMS[0].value,
    timeStart: defaultTimeStart,
    timeFinish: defaultTimeFinish,
};

const formStatusItems = FORM_STATUS_ITEMS.slice(0, 2);

function FormFormCreate() {
    const { id: academyId } = useParams();
    const user = useSelector((state) => state.userReducer);
    const [createFormMessage, setCreateFormMessage] = useState('');
    const [alertStyle, setAlertStyle] = useState('success');
    const history = useHistory();

    const onSubmit = (values, onSubmitProps) => {
        const valuesForBE = { ...values };

        if (user.role === USER_ROLE.ADMIN) {
            axios
                .create({
                    baseURL: API_URL,
                    headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
                })
                .post('/forms?academyId=' + academyId, valuesForBE)
                .then((response) => {
                    //if response gives success message
                    if (response.status === 201) {
                        setCreateFormMessage(MESSAGES_SUCCESS.FORM_CREATE);
                        setAlertStyle('success');
                        onSubmitProps.resetForm();
                        //user is redirected to created form's view page after set amount of time
                        setTimeout(
                            () => history.push(`/academies/${academyId}/forms/${response.data.id}`),
                            REDIRECT_DELAY
                        );
                    }
                })
                .catch((error) => {
                    //if server is not responding
                    if (!error.response) {
                        setCreateFormMessage(MESSAGES_ERROR.SERVER_NOT_RESPONDING);
                        setAlertStyle('error');
                    } else {
                        setCreateFormMessage(MESSAGES_ERROR.BAD_REQUEST);
                        setAlertStyle('error');
                    }
                });
        } else {
            setCreateFormMessage(MESSAGES_ERROR.NOT_ADMIN);
            setAlertStyle('error');
        }
    };

    return (
        <div className="form-academy-form-create">
            <h1 className="form-academy-form-create__heading">Create new form</h1>

            {createFormMessage && <Alert severity={alertStyle}>{createFormMessage}</Alert>}

            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                {({ dirty, isValid, errors, touched, setFieldValue }) => {
                    return (
                        <Form noValidate>
                            <FormikInputField
                                label="Form title"
                                name="formName"
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
                                items={formStatusItems}
                                required
                                errors={errors}
                                touched={touched}
                                setFieldValue={setFieldValue}
                                value={initialValues.status}
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

                            <div className="form-academy-form-create__actions">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    size="large"
                                    startIcon={<EventAvailableSharpIcon />}
                                >
                                    Create form
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

export default FormFormCreate;
