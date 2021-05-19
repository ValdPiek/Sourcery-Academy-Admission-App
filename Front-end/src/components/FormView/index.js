import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Card, CardContent, Typography, Button, SnackbarContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CreateIcon from '@material-ui/icons/Create';
import { RESPONSE_STATUS, FORM_STATUS_ITEMS, USER_ROLE, API_URL } from '../constants';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import './FormView.scss';
import FormDelete from './../FormDelete/FormDelete';
import FormAcademyFormEdit from '../FormAcademyFormEdit';
import { Alert } from '@material-ui/lab';

const FormView = () => {
    const { id: academyId } = useParams();
    const { id1: formId } = useParams();
    const user = useSelector((state) => state.userReducer);
    const [formInfo, setFormInfo] = useState([]);
    const [respStatus, setRespStatus] = useState(RESPONSE_STATUS.EMPTY);
    const [reqError, setReqError] = useState('');
    //variable which tells if form is currently being edited
    const [isEditMode, setIsEditMode] = useState(false);
    //variable for alert message and style after academy is updated
    const [editFormMessage, setEditFormMessage] = useState('');
    const [alertStyle, setAlertStyle] = useState('success');

    const history = useHistory();

    const handleSuccessfulFormEdit = (alertStyle, alertMessage) => {
        setEditFormMessage(alertMessage);
        setAlertStyle(alertStyle);
        setIsEditMode(false);
    };

    const handleEditButtonClick = () => {
        setEditFormMessage('');
        setIsEditMode(!isEditMode);
    };

    const fetchFormInfo = () => {
        axios
            .create({
                baseURL: API_URL,
                headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
            })
            .get('/forms/' + formId + '?academyId=' + academyId)
            .then((res) => {
                setRespStatus(res.status);
                setFormInfo(res.data);
            })
            .catch((err) => {
                if (
                    err.request.status === RESPONSE_STATUS.FORBIDDEN ||
                    err.request.status === RESPONSE_STATUS.BAD_REQUEST
                ) {
                    history.push('/academies/' + academyId);
                } else if (err.request.status === RESPONSE_STATUS.NOT_FOUND) {
                    setReqError('No form was found. Come back later!');
                } else if (err.request) {
                    setReqError('No connection to server');
                } else if (err.res) {
                    console.log(err.res.data.message);
                }
            });
    };

    useEffect(() => {
        fetchFormInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode]);

    const hoursCalculation = (timeStart, timeFinish) => {
        const start = moment(timeStart);
        const finish = moment(timeFinish);
        const duration = finish.diff(start, 'hours');

        return duration === 1 ? duration + ' hour' : duration + ' hours';
    };

    const renderForm = () => {
        return (
            <div>
                <Card className="card-components">
                    <div className="close-wrapper">
                        <Button component={Link} to={'/academies/' + academyId + '/forms'}>
                            <CloseIcon color="primary"></CloseIcon>
                        </Button>
                    </div>

                    <CardContent>
                        {editFormMessage && <Alert severity={alertStyle}>{editFormMessage}</Alert>}
                        <div className="card-components__form-h-wrapper">
                            <Typography variant="h4">{formInfo.form.formName}</Typography>
                        </div>

                        <div className="card-components__data">
                            <Typography variant="h6" color="textSecondary">
                                Status:
                            </Typography>
                            <Typography className="text-wrapper" variant="h6">
                                {FORM_STATUS_ITEMS[formInfo.form.status - 1].label}
                            </Typography>
                        </div>

                        <div className="card-components__data">
                            <Typography variant="h6" color="textSecondary">
                                Valid:
                            </Typography>
                            <Typography className="text-wrapper" variant="h6">
                                {moment(formInfo.form.timeStart).format('MMMM DD, YYYY HH:mm ')}-
                                {moment(formInfo.form.timeFinish).format(' MMMM DD, YYYY HH:mm')}
                            </Typography>
                        </div>

                        <div className="card-components__data">
                            <Typography variant="h6" color="textSecondary">
                                Duration:
                            </Typography>
                            <Typography className="text-wrapper" variant="h6">
                                {hoursCalculation(formInfo.form.timeStart, formInfo.form.timeFinish)}
                            </Typography>
                        </div>

                        {formInfo.form.description !== '' && (
                            <div className="card-components__description">
                                <Typography variant="body1" component="p">
                                    {formInfo.form.description}
                                </Typography>
                            </div>
                        )}

                        {user.role === USER_ROLE.ADMIN && (
                            <div className="card-components__actions-position-end-wrapper">
                                <div className="action-button-wrapper">
                                    <Button
                                        variant="contained"
                                        color={isEditMode ? 'secondary' : 'primary'}
                                        onClick={handleEditButtonClick}
                                    >
                                        <CreateIcon className="button-icon-wrapper"></CreateIcon>
                                        {isEditMode ? 'CANCEL EDIT' : 'EDIT'}
                                    </Button>
                                </div>
                                <div className="action-button-wrapper">
                                    <FormDelete />
                                </div>
                            </div>
                        )}

                        <div className="card-components__actions-position-center-wrapper">
                            {user.role === USER_ROLE.STUDENT &&
                                FORM_STATUS_ITEMS[formInfo.form.status - 1].value === FORM_STATUS_ITEMS[2].value && (
                                    <Button variant="contained" color="primary">
                                        <CreateIcon className="button-icon-wrapper"></CreateIcon>
                                        START FILLING FORM
                                    </Button>
                                )}
                        </div>
                    </CardContent>

                    {isEditMode && (
                        <FormAcademyFormEdit formInfo={formInfo} handleSuccessfulFormEdit={handleSuccessfulFormEdit} />
                    )}
                </Card>

                {user.role === USER_ROLE.ADMIN && (
                    <Card className="card-question-add-wrapper">
                        <CardContent>{renderQuestionAddButton()}</CardContent>
                    </Card>
                )}
            </div>
        );
    };

    const renderQuestionAddButton = () => {
        return (
            <div className="question-button-wrapper">
                <Button variant="contained" color="primary">
                    + NEW QUESTION
                </Button>
            </div>
        );
    };

    if (respStatus === RESPONSE_STATUS.OK && formInfo.length !== 0) {
        return renderForm();
    } else if (respStatus === RESPONSE_STATUS.OK && formInfo.length === 0) {
        return (
            <div className="response">
                <SnackbarContent message="No form was found. Come back later!" />
            </div>
        );
    } else {
        return <h5>{reqError}</h5>;
    }
};

export default FormView;
