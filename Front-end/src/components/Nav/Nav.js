import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { USER_ROLE } from '../constants';
import './Nav.scss';
import { applicationRoutes } from '../Routes/routes';

function Nav() {
    const user = useSelector((state) => state.userReducer);
    const isLoggedIn = user.role !== '';
    const navItems = applicationRoutes;

    return (
        <nav className="nav">
            <ul className="nav__list">
                {Object.keys(navItems).map((i, key) => {
                    const item = navItems[i];
                    const shouldRenderRoute =
                        item.allowFor.includes(user.role) || (item.allowFor.includes(USER_ROLE.PUBLIC) && !isLoggedIn);

                    if (shouldRenderRoute) {
                        return (
                            <li className="nav__item" key={key}>
                                {item.path === '/' ? (
                                    <NavLink activeClassName="is-active" to={item.path} className="nav__link" exact>
                                        {item.label}
                                    </NavLink>
                                ) : (
                                    <NavLink activeClassName="is-active" to={item.path} className="nav__link">
                                        {item.label}
                                    </NavLink>
                                )}
                            </li>
                        );
                    } else {
                        return null;
                    }
                })}
            </ul>
        </nav>
    );
}

export default Nav;
