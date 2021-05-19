import React from 'react';
import { Link } from 'react-router-dom';
import { applicationRoutes } from '../../components/Routes/routes';
import { Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

import './Home.scss';

const Home = () => {
    const routes = applicationRoutes;

    return (
        <div className="home-container">
            <div className="home-container__flex-item--left">
                <h1>Sourcery Academy is our free of charge internal education program</h1>

                <p>
                    Created to allow students to improve their skills and prepare for a career in the IT industry.
                    Create free account now and enjoy the following benefits:
                </p>

                <hr className="home-container__hr" />

                <div>
                    <ul className="no-bullets">
                        <li>{<CheckIcon />} Register for Academies</li>
                        <li>{<CheckIcon />} Be notified about upcoming academy tests</li>
                        <li>{<CheckIcon />} Participate in online tests</li>
                        <li>{<CheckIcon />} View test results</li>
                    </ul>
                </div>

                <hr className="home-container__hr" />

                <div className="home-container__actions home-container__flex-item--full-width">
                    <Button
                        component={Link}
                        to={routes.register.path}
                        variant="contained"
                        color="secondary"
                        size="medium"
                        startIcon={<CheckIcon />}
                    >
                        <div className="home-container__action-button-text">Join us now!</div>
                    </Button>
                </div>
            </div>

            <div className="home-container__flex-item--right">
                <div className="responsive-container">
                    <iframe
                        className="responsive-container__responsive-iframe"
                        src="https://www.youtube.com/embed/leg_esOX4rw"
                        allowFullScreen
                        title="Academy video"
                    ></iframe>
                </div>
            </div>

            <div className="home-container__flex-item--one-third-width">
                <h2 className="home-container__bottom-info-block-heading">Professional teachers</h2>
                <p>
                    The participants learn the latest technologies and how to create software using the best tools on
                    the market. Students have to attend three-hour long weekly lectures (once per week) where experts of
                    Devbridge are teaching them of React, JPA and Spring Boot master cutting-edge web technologies for
                    three months during the Fall semester.
                </p>
            </div>

            <div className="home-container__flex-item--one-third-width">
                <h2 className="home-container__bottom-info-block-heading">Build projects in teams</h2>
                <p>
                    Devbridge assigns a mentor to each student to serve as a resource for their custom development
                    projects. For the Fall semester, Sourcery Academy begin in the beginning of October and end in Mid
                    December. This is JAVA technology based semester. Academy&apos;s students need to dedicate at least
                    10-15 hours per week in order to graduate the academy successfully. At the end of term all students
                    receive recognition for completing the course.
                </p>
            </div>

            <div className="home-container__flex-item--one-third-width">
                <h2 className="home-container__bottom-info-block-heading">Be the best and join us!</h2>
                <p>
                    The participants are observed throughout the course by assigned mentors who represent 70% of the
                    overall score that reflects student&apos;s progress. An assessment of the final exam consists 30% of
                    the final grade. Only the TOP highest performing graduates are invited for an interview to become
                    junior Software Engineers at Devbridge.
                </p>
            </div>
        </div>
    );
};

export default Home;
