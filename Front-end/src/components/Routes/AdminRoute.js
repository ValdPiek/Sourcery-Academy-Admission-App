import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { USER_ROLE } from '../constants';
import { applicationRoutes } from './routes';

// eslint-disable-next-line react/prop-types
const AdminRoute = ({ component: Component, ...rest }) => {
    const user = useSelector((state) => state.userReducer);
    const routes = applicationRoutes;

    return (
        <Route
            {...rest}
            render={(props) => {
                if (user.role === USER_ROLE.ADMIN) {
                    return <Component {...props} />;
                }
                return <Redirect to={routes.root.path} />;
            }}
        />
    );
};

export default AdminRoute;
