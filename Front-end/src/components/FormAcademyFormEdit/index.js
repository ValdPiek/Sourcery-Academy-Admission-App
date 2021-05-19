import React, { useRef, useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import './FormAcademyFormEdit.scss';
import axios from 'axios';
import { Button } from '@material-ui/core';
import FormikInputField from '../FormikInputField';
import FormikSelectField from '../FormikSelectField';
import EventAvailableSharpIcon from '@material-ui/icons/EventAvailableSharp';
import { Alert } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import { API_URL, USER_ROLE, FORM_STATUS_ITEMS, RESPONSE_STATUS } from '../constants';
import { MESSAGES_ERROR, MESSAGES_SUCCESS } from '../messages';
import { validationSchema } from '../FormAcademyFormCreate/validationSchema';
import PropTypes from 'prop-types';

function FormAcademyFormEdit({ formInfo, handleSuccessfulFormEdit }) {
    const user = useSelector((state) => state.userReducer);
    const [editFormMessage, setEditFormMessage] = useState('');
    const [alertStyle, setAlertStyle] = useState('success');
    const { form, isEditable } = formInfo;
    const [formStatusItems, setFormStatusItems] = useState(FORM_STATUS_ITEMS);
    //ref is used to scroll to edit form when edit button is pressed
    const myRef = useRef(null);
    const executeScroll = () => myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const initialValues = {
        formName: form.formName,
        description: form.description,
        status: FORM_STATUS_ITEMS[form.status - 1].value,
        timeStart: form.timeStart,
        timeFinish: form.timeFinish,
    };

    useEffect(() => {
        executeScroll();
        decideFormStatusItems(initialValues.status);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const decideFormStatusItems = (status) => {
        if (status === FORM_STATUS_ITEMS[0].value) setFormStatusItems(FORM_STATUS_ITEMS.slice(0, 2));
        if (status === FORM_STATUS_ITEMS[1].value) setFormStatusItems(FORM_STATUS_ITEMS.slice(1, 3));
        if (status === FORM_STATUS_ITEMS[2].value) setFormStatusItems(FORM_STATUS_ITEMS.slice(2));
    };

    const onSubmit = (values, onSubmitProps) => {
        const valuesForBE = { ...values };

        if (user.role === USER_ROLE.ADMIN) {
            axios
                .create({
                    baseURL: API_URL,
                    headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
                })
                .put('/forms/' + form.id, valuesForBE)
                .then((response) => {
                    //if response gives success message
                    if (response.status === RESPONSE_STATUS.OK) {
                        handleSuccessfulFormEdit('success', MESSAGES_SUCCESS.FORM_UPDATE);
                    }
                })
                .catch((error) => {
                    //if server is not responding
                    if (!error.response) {
                        setEditFormMessage(MESSAGES_ERROR.SERVER_NOT_RESPONDING);
                        setAlertStyle('error');
                    } else {
                        setEditFormMessage(MESSAGES_ERROR.BAD_REQUEST);
                        setAlertStyle('error');
                    }
                });
        } else {
            setEditFormMessage(MESSAGES_ERROR.NOT_ADMIN);
            setAlertStyle('error');
        }
    };

    return (
        <div className="form-academy-form-edit" ref={myRef}>
            <h1 className="form-academy-form-edit__heading">Editing form</h1>

            {!isEditable && (
                <Alert severity="info">
                    Some input fields are disabled, because: <br />
                    1. This form&apos;s start time is in less than 48 hours. <br />
                    2. Form&apos;s status is finished. Therefore it can&apos;t be changed.
                </Alert>
            )}

            {editFormMessage && <Alert severity={alertStyle}>{editFormMessage}</Alert>}

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
                                disabled={!isEditable}
                            />
                            <FormikInputField
                                label="Description"
                                name="description"
                                errors={errors}
                                touched={touched}
                                variant="filled"
                                multiline
                                rowsMax={4}
                                disabled={!isEditable}
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
                                disabled={initialValues.status === FORM_STATUS_ITEMS[3].value}
                            />
                            <FormikInputField
                                label="Start time"
                                name="timeStart"
                                errors={errors}
                                touched={touched}
                                type="datetime-local"
                                disabled={!isEditable}
                            />
                            <FormikInputField
                                label="Finish time"
                                name="timeFinish"
                                errors={errors}
                                touched={touched}
                                type="datetime-local"
                                disabled={!isEditable}
                            />

                            <div className="form-academy-form-edit__actions">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    size="large"
                                    startIcon={<EventAvailableSharpIcon />}
                                >
                                    Update form
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}

FormAcademyFormEdit.propTypes = {
    formInfo: PropTypes.object.isRequired,
    handleSuccessfulFormEdit: PropTypes.func.isRequired,
};

export default FormAcademyFormEdit;
