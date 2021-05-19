import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import './AcademyView.scss';
import { Card, CardContent, Typography, Button, SnackbarContent } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CreateIcon from '@material-ui/icons/Create';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { RESPONSE_STATUS, AcademyStatus, USER_ROLE, API_URL } from '../constants';
import { MESSAGES_ERROR, MESSAGES_SUCCESS } from '../messages';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import FormEditAcademy from '../AcademyFormEdit';
import { Alert } from '@material-ui/lab';
import AcademyDelete from './../AcademyDelete/AcademyDelete';

const AcademyView = () => {
    const { id } = useParams();
    const user = useSelector((state) => state.userReducer);
    const [academy, setAcademyInfo] = useState([]);
    const [respStatus, setRespStatus] = useState(RESPONSE_STATUS.EMPTY);
    const [reqError, setReqError] = useState('');
    //variable which tells if form is currently being edited
    const [isEditMode, setIsEditMode] = useState(false);
    //variable for alert message and style after academy is updated
    const [editAcademyMessage, setEditAcademyMessage] = useState('');
    const [alertStyle, setAlertStyle] = useState('success');
    const history = useHistory();
    //academy membership variables
    const [membershipMessage, setMembershipMessage] = useState('');
    const [isStudentApplied, setIsStudentApplied] = useState(null);
    const [shouldAcademyRender, setShouldAcademyRender] = useState(false);
    const [userMembershipChange, setUserMembershipChange] = useState(false);

    const handleSuccessfulAcademyEdit = (alertStyle, alertMessage) => {
        setEditAcademyMessage(alertMessage);
        setAlertStyle(alertStyle);
        setIsEditMode(false);
    };

    const handleEditButtonClick = () => {
        setEditAcademyMessage('');
        setIsEditMode(!isEditMode);
    };

    const fetchAcademyInfo = () => {
        axios
            .create({
                baseURL: API_URL,
                headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
            })
            .get('academies/' + id)
            .then((res) => {
                setRespStatus(res.status);
                setAcademyInfo(res.data);
            })
            .catch((err) => {
                if (
                    err.request.status === RESPONSE_STATUS.NOT_FOUND ||
                    err.request.status === RESPONSE_STATUS.BAD_REQUEST
                ) {
                    history.push('/academies');
                } else if (err.request) {
                    setReqError('No connection to server');
                } else if (err.res) {
                    console.log(err.res.data.message);
                }
            });
    };

    useEffect(() => {
        fetchAcademyInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode]);

    useEffect(() => {
        checkUserIsMember();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [academy, userMembershipChange]);

    const checkUserIsMember = () => {
        if (respStatus === RESPONSE_STATUS.OK && academy.length !== 0) {
            axios
                .create({
                    baseURL: API_URL,
                    headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
                })
                .get('/academies/' + academy.id + '/membership/' + user.id)
                .then((response) => {
                    //if response gives success message
                    if (response.data === true) {
                        setIsStudentApplied(true);
                    } else if (response.data === false) {
                        setIsStudentApplied(false);
                    }
                    setShouldAcademyRender(true);
                })
                .catch((error) => {
                    if (!error.response) {
                        //if server is not responding
                        setMembershipMessage(MESSAGES_ERROR.SERVER_NOT_RESPONDING);
                        setAlertStyle('error');
                    } else {
                        //if user was removed by admin
                        if (error.response.status === RESPONSE_STATUS.CONFLICT) {
                            setMembershipMessage(error.response.data.message);
                            setAlertStyle('error');
                            setShouldAcademyRender(true);
                        }
                        //if there are other errors from server side
                        if (error.response.status === RESPONSE_STATUS.BAD_REQUEST) {
                            setMembershipMessage(MESSAGES_ERROR.BAD_REQUEST);
                            setAlertStyle('error');
                        }
                    }
                });
        }
    };

    const handleUserSignUp = () => {
        axios
            .create({
                baseURL: API_URL,
                headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
            })
            .post('/academies/' + academy.id + '/membership')
            .then((response) => {
                //if response gives success message
                if (response.status === RESPONSE_STATUS.OK) {
                    setMembershipMessage(MESSAGES_SUCCESS.MEMBERSHIP_CREATE);
                    setAlertStyle('success');
                    setUserMembershipChange(!userMembershipChange);
                }
            })
            .catch((error) => {
                if (!error.response) {
                    //if server is not responding
                    setMembershipMessage(MESSAGES_ERROR.SERVER_NOT_RESPONDING);
                    setAlertStyle('error');
                } else {
                    //if there are other errors from server side
                    setMembershipMessage(MESSAGES_ERROR.BAD_REQUEST);
                    setAlertStyle('error');
                }
            });
    };

    const handleUserLeave = () => {
        axios
            .create({
                baseURL: API_URL,
                headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
            })
            .delete('/academies/' + academy.id + '/membership/' + user.id)
            .then((response) => {
                //if response gives success message
                if (response.status === RESPONSE_STATUS.OK) {
                    setMembershipMessage(MESSAGES_SUCCESS.MEMBERSHIP_DELETE);
                    setAlertStyle('info');
                    setUserMembershipChange(!userMembershipChange);
                }
            })
            .catch((error) => {
                if (!error.response) {
                    //if server is not responding
                    setMembershipMessage(MESSAGES_ERROR.SERVER_NOT_RESPONDING);
                    setAlertStyle('error');
                } else {
                    //if there are other errors from server side
                    setMembershipMessage(MESSAGES_ERROR.BAD_REQUEST);
                    setAlertStyle('error');
                }
            });
    };

    const renderAcademy = () => {
        return (
            <Card className="card-components">
                <div className="close-wrapper">
                    <Button component={Link} to={`/academies`}>
                        <CloseIcon color="primary"></CloseIcon>
                    </Button>
                </div>

                <CardContent>
                    {editAcademyMessage && <Alert severity={alertStyle}>{editAcademyMessage}</Alert>}

                    {membershipMessage && <Alert severity={alertStyle}>{membershipMessage}</Alert>}

                    <div className="card-components__academy-h">
                        <Typography variant="h4">{academy.academyName}</Typography>
                    </div>

                    <div className="card-components__data">
                        <Typography variant="h6" color="textSecondary">
                            Status:
                        </Typography>
                        <Typography className="text-wrapper" variant="h6">
                            {AcademyStatus[academy.status - 1]}
                        </Typography>
                    </div>

                    <div className="card-components__data">
                        <Typography variant="h6" color="textSecondary">
                            City:
                        </Typography>
                        <Typography className="text-wrapper" variant="h6">
                            {academy.city}
                        </Typography>
                    </div>

                    {academy.timeStart !== null && (
                        <div className="card-components__data">
                            <Typography variant="h6" color="textSecondary">
                                Admission:
                            </Typography>
                            <Typography className="text-wrapper" variant="h6">
                                {moment(academy.timeStart).format('MMMM DD, YYYY ')}-
                                {academy.timeFinish !== null
                                    ? moment(academy.timeFinish).format(' MMMM DD, YYYY')
                                    : ' end time'}
                            </Typography>
                        </div>
                    )}

                    {academy.description !== '' && (
                        <div className="card-components__description">
                            <Typography variant="body1" component="p">
                                {academy.description}
                            </Typography>
                        </div>
                    )}

                    {(academy.email !== '' || academy.telephone !== '') && (
                        <div className="card-components__data contact-text-wrapper">
                            <Typography color="textSecondary">Still have a question? Contact us:</Typography>
                            <Typography className="text-wrapper">
                                {academy.email} {academy.telephone}
                            </Typography>
                        </div>
                    )}

                    {user.role === USER_ROLE.ADMIN && (
                        <div className="card-components__actions-position-end">
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
                                <Button
                                    component={Link}
                                    to={`/academies/${academy.id}/forms`}
                                    variant="contained"
                                    color="primary"
                                >
                                    <ListAltIcon className="button-icon-wrapper"></ListAltIcon>
                                    Forms
                                </Button>
                            </div>

                            <div className="action-button-wrapper">
                                <Button
                                    component={Link}
                                    to={`/academies/${academy.id}/students`}
                                    variant="contained"
                                    color="primary"
                                >
                                    <HowToRegIcon className="button-icon-wrapper"></HowToRegIcon>
                                    Students
                                </Button>
                            </div>

                            <div className="action-button-wrapper">
                                <AcademyDelete />{' '}
                            </div>
                        </div>
                    )}

                    <div className="card-components__actions-position-center">
                        {user.role === USER_ROLE.STUDENT &&
                            isStudentApplied === false &&
                            AcademyStatus[academy.status - 1] === AcademyStatus[1] && (
                                <Button variant="contained" color="primary" onClick={() => handleUserSignUp()}>
                                    Sign Up to Academy
                                </Button>
                            )}

                        {user.role === USER_ROLE.STUDENT && isStudentApplied === true && (
                            <Button variant="contained" color="secondary" onClick={() => handleUserLeave()}>
                                Leave Academy
                            </Button>
                        )}
                    </div>
                </CardContent>

                {isEditMode && (
                    <FormEditAcademy academy={academy} handleSuccessfullAcademyEdit={handleSuccessfulAcademyEdit} />
                )}
            </Card>
        );
    };

    if (respStatus === RESPONSE_STATUS.OK && academy.length !== 0) {
        if (user.role === USER_ROLE.STUDENT && shouldAcademyRender === true) {
            return renderAcademy();
        }

        if (user.role === USER_ROLE.ADMIN) {
            return renderAcademy();
        }
    }
    if (respStatus === RESPONSE_STATUS.OK && academy.length === 0) {
        return (
            <div className="response">
                <SnackbarContent message="No academy found. Come back later!" />
            </div>
        );
    } else {
        return <h5>{reqError}</h5>;
    }
};

export default AcademyView;
