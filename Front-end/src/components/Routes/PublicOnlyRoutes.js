import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { applicationRoutes } from './routes';

// eslint-disable-next-line react/prop-types
const PublicOnlyRoute = ({ component: Component, ...rest }) => {
    const user = useSelector((state) => state.userReducer);
    const routes = applicationRoutes;

    return (
        <Route
            {...rest}
            render={(props) => {
                if (user.role === '' || !user.role) {
                    return <Component {...props} />;
                } else {
                    return <Redirect to={routes.dashboard.path} />;
                }
            }}
        />
    );
};

export default PublicOnlyRoute;
