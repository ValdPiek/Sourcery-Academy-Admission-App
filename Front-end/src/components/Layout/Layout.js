import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Nav from '../Nav/Nav';

import './Layout.scss';
import { applicationRoutes } from '../Routes/routes';
import logo from '../../assets/img/logo-sourcery.png';

Layout.propTypes = {
    children: PropTypes.node,
};

function Layout({ children }) {
    const routes = applicationRoutes;

    return (
        <div className="page-wrapper">
            <header className="header">
                <Link to={routes.root.path}>
                    <img
                        src={logo}
                        alt="A transparent cube with colored edges and text Sourcery Academy next to it"
                        className="header__logo"
                    />
                </Link>
                <Nav />
            </header>

            <main className="main">{children}</main>

            <footer className="footer">Devbridge &copy; 2020</footer>
        </div>
    );
}

export default Layout;
