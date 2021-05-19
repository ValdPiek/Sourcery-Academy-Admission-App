import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { USER_ROLE } from '../constants';
import { Link } from 'react-router-dom';
import { API_URL } from '../constants';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import './Dashboard.scss';
import { MESSAGES_ERROR } from '../messages';

function Dashboard() {
    const user = useSelector((state) => state.userReducer);
    const [counter, setCounter] = useState();
    const counterValuesWhenServerNotResponding = {
        academies: MESSAGES_ERROR.SERVER_ERROR,
        students: MESSAGES_ERROR.SERVER_ERROR,
        forms: MESSAGES_ERROR.SERVER_ERROR,
        questions: MESSAGES_ERROR.SERVER_ERROR,
    };

    const fetchAcademies = () => {
        axios
            .create({
                baseURL: API_URL,
                headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
            })
            .get('/stats/counter')
            .then((res) => {
                setCounter(res.data);
            })
            .catch((err) => {
                if (err.request) {
                    setCounter(counterValuesWhenServerNotResponding);
                } else if (err.res) {
                    console.log(err.res.data.message);
                }
            });
    };

    useEffect(() => {
        fetchAcademies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const responseAdmin = () => {
        return (
            <div className="dashboard">
                <h3 className="dashboard__heading">{user.firstName}, welcome to dashboard!</h3>
                <div className="dashboard__blocks-small">
                    <div className="dashboard__block-item-small">
                        <Link to="/academies">
                            <h4>Academies</h4>
                            <h1>{counter ? counter.academies : <CircularProgress color="secondary" />}</h1>
                        </Link>
                    </div>

                    <div className="dashboard__block-item-small">
                        <Link to="/dashboard">
                            <h4>Students</h4>
                            <h1>{counter ? counter.students : <CircularProgress color="secondary" />}</h1>
                        </Link>
                    </div>

                    <div className="dashboard__block-item-small">
                        <Link to="/dashboard">
                            <h4>Forms</h4>
                            <h1>{counter ? counter.forms : <CircularProgress color="secondary" />}</h1>
                        </Link>
                    </div>
                    <div className="dashboard__block-item-small">
                        <Link to="/dashboard">
                            <h4>Questions</h4>
                            <h1>{counter ? counter.questions : <CircularProgress color="secondary" />}</h1>
                        </Link>
                    </div>
                </div>

                <div className="dashboard__blocks-medium">
                    <div className="dashboard__block-item-medium">
                        <h2>New registrations</h2>
                        <p>A list of 10 students who recently registered on page.</p>
                    </div>

                    <div className="dashboard__block-item-medium">
                        <h2>Upcoming and active academies</h2>
                        <p>1-5 academies cards (title, city, status, start and finish time).</p>
                    </div>
                </div>
            </div>
        );
    };

    const responseStudent = () => {
        return (
            <div className="dashboard">
                <h3 className="dashboard__heading">{user.firstName}, welcome to dashboard!</h3>
                <div className="dashboard__blocks-medium">
                    <div className="dashboard__block-item-medium">
                        <h2>Academies you applied</h2>
                        <p>1-5 academies cards (title, city, status, start and finish time).</p>
                    </div>

                    <div className="dashboard__block-item-medium">
                        <h2>Upcoming academies</h2>
                        <p>1-5 academies cards (title, city, status, start and finish time).</p>
                    </div>
                </div>
            </div>
        );
    };

    return user.role === USER_ROLE.ADMIN ? responseAdmin() : responseStudent();
}

export default Dashboard;
