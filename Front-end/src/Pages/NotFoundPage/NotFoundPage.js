import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';

import './NotFoundPage.scss';
import { applicationRoutes } from '../../components/Routes/routes';

function NotFoundPage() {
    const location = useLocation();
    const routes = applicationRoutes;

    return (
        <div className="not-found">
            <h1 className="not-found__title">404 | Page not found!</h1>
            <hr className="hr" />
            <div>
                <span>
                    Oops... you broke the Internet :) The page &quot;{location.pathname}&quot; has not been found.&nbsp;
                </span>
                <br />
                <p>
                    Checkout &nbsp;
                    <NavLink className="link" to={routes.root.path}>
                        Homepage
                    </NavLink>
                    &nbsp; for more information.
                </p>
            </div>
        </div>
    );
}

export default NotFoundPage;
