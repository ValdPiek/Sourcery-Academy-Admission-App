import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RESPONSE_STATUS, API_URL, FORM_STATUS_ITEMS } from '../constants';
import { Button, Typography, CardContent, Card, SnackbarContent, CardActions } from '@material-ui/core';
import './Forms.scss';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AddBox from '@material-ui/icons/AddBox';
import moment from 'moment';

function Forms() {
    const { id: academyId } = useParams();
    const [forms, setForms] = useState([]);
    const [respStatus, setRespStatus] = useState(RESPONSE_STATUS.EMPTY);
    const [reqError, setReqError] = useState('');
    const user = useSelector((state) => state.userReducer);

    const fetchAcademyForms = () => {
        axios
            .create({
                baseURL: API_URL,
                headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
            })
            .get('/forms/?academyId=' + academyId)
            .then((res) => {
                setRespStatus(res.status);
                setForms(res.data);
            })
            .catch((err) => {
                if (err.request) {
                    setReqError('No connection to server');
                } else if (err.res) {
                    console.log(err.res.data.message);
                }
            });
    };

    useEffect(() => {
        fetchAcademyForms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formListEmpty = () => {
        return (
            <div className="response">
                <SnackbarContent message="Form list is empty." />
            </div>
        );
    };

    const hoursCalculation = (timeStart, timeFinish) => {
        const start = moment(timeStart);
        const finish = moment(timeFinish);
        const duration = finish.diff(start, 'hours');

        return duration === 1 ? duration + ' hour' : duration + ' hours';
    };

    const formList = () => {
        return forms.map((form) => {
            return (
                <div className="card-form" key={form.id}>
                    <Card className="card-form__content">
                        <CardContent>
                            <div className="card-form__title-box">
                                <Typography variant="h5">
                                    <Link
                                        to={`/academies/${academyId}/forms/${form.id}`}
                                        className="card-form__title-link"
                                    >
                                        {form.formName}
                                    </Link>
                                </Typography>

                                <Typography color="textSecondary">
                                    Status: {FORM_STATUS_ITEMS[form.status - 1].label}
                                </Typography>
                            </div>

                            <Typography color="textSecondary" className="card-form__datetime">
                                When: {moment(form.timeStart).format('MMMM DD, YYYY, HH:mm ')} -
                                {moment(form.timeFinish).format('HH:mm ')}
                            </Typography>

                            <Typography color="textSecondary" className="card-form__datetime">
                                Duration: {hoursCalculation(form.timeStart, form.timeFinish)}
                            </Typography>

                            <Typography variant="body2" component="p" className="card-form__description">
                                {form.description}
                            </Typography>
                        </CardContent>

                        <CardActions className="card-form__button">
                            <Button
                                component={Link}
                                to={`/academies/${academyId}/forms/${form.id}`}
                                size="medium"
                                variant="outlined"
                                color="primary"
                            >
                                Show Form
                            </Button>
                        </CardActions>
                    </Card>
                </div>
            );
        });
    };

    const responseHeader = () => {
        return (
            <>
                <div className="list-forms__header-box">
                    <h1 className="list-form__heading">List of all forms</h1>
                    <Button
                        component={Link}
                        to={`/academies/${academyId}/forms/create`}
                        variant="contained"
                        color="secondary"
                        className="add-button"
                        startIcon={<AddBox />}
                    >
                        Create form
                    </Button>
                </div>

                <div className="list-academies__info-description">
                    <p>In this page you are presented with list of forms. Here you can do the following:</p>

                    <ol>
                        <li>Go to selected form.</li>
                        <li>
                            View main information about form and check the form view, which will be presented for
                            students.
                        </li>
                        <li>
                            By clicking button &quot;Create Form&quot; you will create a new form and add all necessary
                            information.
                        </li>
                    </ol>
                </div>
            </>
        );
    };

    if (respStatus === RESPONSE_STATUS.OK) {
        //if response from backend status 200 , returning list with academies or a message, if list is empty
        return (
            <div>
                {responseHeader()}
                {forms.length === 0 ? formListEmpty() : formList()}
            </div>
        );
    } else {
        //if server is not responding, returning server error message
        return (
            <>
                <h5>{reqError}</h5>
            </>
        );
    }
}

export default Forms;
