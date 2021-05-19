import React, { useRef, useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import './AcademyFormEdit.scss';
import axios from 'axios';
import { Button } from '@material-ui/core';
import FormikInputField from '../FormikInputField';
import FormikSelectField from '../FormikSelectField';
import EventAvailableSharpIcon from '@material-ui/icons/EventAvailableSharp';
import { Alert } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import { API_URL, USER_ROLE, RESPONSE_STATUS, CITY_ITEMS, ACADEMY_STATUS_ITEMS } from '../constants';
import { MESSAGES_ERROR } from '../messages';
import { validationSchema } from '../AcademyFormCreate/validationSchema';
import PropTypes from 'prop-types';

function FormEditAcademy({ academy, handleSuccessfullAcademyEdit }) {
    const user = useSelector((state) => state.userReducer);
    const [editAcademyMessage, setEditAcademyMessage] = useState('');
    const [alertStyle, setAlertStyle] = useState('success');
    //ref is used to scroll to edit dorm when edit button is pressed
    const myRef = useRef(null);
    const executeScroll = () => myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

    useEffect(() => {
        executeScroll();
    }, []);

    const initialValues = {
        academyName: academy.academyName,
        description: academy.description,
        city: academy.city.split(', '),
        status: academy.status.toString(),
        email: academy.email,
        telephone: academy.telephone,
        timeStart: academy.timeStart,
        timeFinish: academy.timeFinish,
    };

    const onSubmit = (values, onSubmitProps) => {
        const valuesForBE = { ...values };
        valuesForBE.city = valuesForBE.city.join(', ');

        if (user.role === USER_ROLE.ADMIN) {
            axios
                .create({
                    baseURL: API_URL,
                    headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
                })
                .put('/academies/' + academy.id, valuesForBE)
                .then((response) => {
                    //if response gives success message
                    if (response.status === RESPONSE_STATUS.OK) {
                        handleSuccessfullAcademyEdit('success', response.data);
                    }
                })
                .catch((error) => {
                    //if server is not responding
                    if (!error.response) {
                        setEditAcademyMessage(MESSAGES_ERROR.SERVER_NOT_RESPONDING);
                        setAlertStyle('error');
                    } else {
                        setEditAcademyMessage(MESSAGES_ERROR.BAD_REQUEST);
                        setAlertStyle('error');
                    }
                });
        } else {
            setEditAcademyMessage(MESSAGES_ERROR.NOT_ADMIN);
            setAlertStyle('error');
        }
    };

    return (
        <div className="form-edit-academy" ref={myRef}>
            <h1 className="form-edit-academy__heading">Editing academy</h1>

            {editAcademyMessage && <Alert severity={alertStyle}>{editAcademyMessage}</Alert>}

            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                {({ errors, touched, setFieldValue }) => {
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
                                items={ACADEMY_STATUS_ITEMS}
                                required
                                errors={errors}
                                touched={touched}
                                setFieldValue={setFieldValue}
                                value={initialValues.status}
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
                                value={initialValues.city}
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

                            <div className="form-edit-academy__actions">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    size="large"
                                    startIcon={<EventAvailableSharpIcon />}
                                >
                                    Update academy
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

FormEditAcademy.propTypes = {
    academy: PropTypes.object.isRequired,
    handleSuccessfullAcademyEdit: PropTypes.func.isRequired,
};
export default FormEditAcademy;
