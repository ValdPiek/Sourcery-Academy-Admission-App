import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RESPONSE_STATUS, API_URL, AcademyStatus } from '../constants';
import { Button, Typography, CardContent, Card, SnackbarContent, CardActions } from '@material-ui/core';
import './Academies.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AddBox from '@material-ui/icons/AddBox';
import { USER_ROLE } from '../constants';

function Academies() {
    const [academies, setAcademies] = useState([]);
    const [respStatus, setRespStatus] = useState(RESPONSE_STATUS.EMPTY);
    const [reqError, setReqError] = useState('');
    const user = useSelector((state) => state.userReducer);

    const fetchAcademies = () => {
        axios
            .create({
                baseURL: API_URL,
                headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
            })
            .get('/academies')
            .then((res) => {
                setRespStatus(res.status);
                setAcademies(res.data);
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
        fetchAcademies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const academyList = () => {
        return academies.map((academy) => {
            return (
                <div className="card-academy" key={academy.id}>
                    <Card className="card-academy__content">
                        <CardContent>
                            <div className="card-academy__title-box">
                                <Typography variant="h5">
                                    <Link to={`/academies/${academy.id}`} className="card-academy__title-link">
                                        {academy.academyName}
                                    </Link>
                                </Typography>

                                <Typography color="textSecondary">
                                    Status: {AcademyStatus[academy.status - 1]}
                                </Typography>
                            </div>

                            <Typography color="textSecondary" className="card-academy__city">
                                City: {academy.city}
                            </Typography>

                            <Typography variant="body2" component="p" className="card-academy__description">
                                {academy.description}
                            </Typography>
                        </CardContent>

                        <CardActions className="card-academy__button">
                            <Button
                                component={Link}
                                to={`/academies/${academy.id}`}
                                size="medium"
                                variant="outlined"
                                color="primary"
                            >
                                Learn More
                            </Button>
                        </CardActions>
                    </Card>
                </div>
            );
        });
    };

    const responseAdmin = () => {
        return (
            <>
                <div className="list-academies__header-box">
                    <h1 className="list-academies__heading">List of all academies</h1>
                    <Button
                        component={Link}
                        to={`/academies/create`}
                        variant="contained"
                        color="secondary"
                        className="add-button"
                        startIcon={<AddBox />}
                    >
                        Create academy
                    </Button>
                </div>

                <div className="list-academies__info-description">
                    <p>In this page you are presented with list of academies. Here you can do the following:</p>

                    <ol>
                        <li>Go to selected academy page.</li>
                        <li>
                            View main information about academies and check the academy card view, which will be
                            presented for students.
                        </li>
                        <li>
                            By clicking button &quot;Create Academy&quot; you will create a new academy and add all
                            necessary information.
                        </li>
                    </ol>
                </div>
            </>
        );
    };

    const responseStudent = () => {
        return (
            <div>
                <div className="list-academies">
                    <h1 className="list-academies__heading">List of upcoming and active academies</h1>
                </div>

                <div className="list-academies__info-description">
                    <p>In this page you are presented with list of all upcoming and already active academies:</p>

                    <ol>
                        <li>Choose an upcoming academy.</li>
                        <li>Go to selected academy page.</li>
                        <li>
                            View main information about academy: start time, finish time and technologies which will be
                            used during academy.
                        </li>
                        <li>
                            By clicking &quot;Apply&quot; button you will join our academy. Just check the start time
                            and come back for the exam.
                        </li>
                    </ol>
                </div>
            </div>
        );
    };

    const responseListEmpty = () => {
        return (
            <div className="response">
                <SnackbarContent message="No academies found. Come back later!" />
            </div>
        );
    };

    if (respStatus === RESPONSE_STATUS.OK) {
        if (user.role === USER_ROLE.ADMIN && academies.length !== 0) {
            return (
                <div>
                    {responseAdmin()}
                    {academyList()}
                </div>
            );
        } else if (user.role === USER_ROLE.ADMIN && academies.length === 0) {
            return (
                <div>
                    {responseAdmin()}
                    {responseListEmpty()}
                </div>
            );
        } else if (user.role === USER_ROLE.STUDENT && academies.length !== 0) {
            return (
                <div>
                    {responseStudent()}
                    {academyList()}
                </div>
            );
        } else {
            return (
                <div>
                    {responseStudent()}
                    {responseListEmpty()}
                </div>
            );
        }
    } else {
        return (
            <>
                <h5>{reqError}</h5>
            </>
        );
    }
}

export default Academies;
