import { Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeUserInfo } from '../../state/actions/user';
import { useHistory } from 'react-router-dom';
import './LogOut.scss';

function LogOut() {
    const dispatch = useDispatch();
    const [loggedOut, setLoggedOut] = useState(false);
    const history = useHistory();

    const logOut = () => {
        setLoggedOut(true);
        dispatch(removeUserInfo());
    };

    if (loggedOut) {
        return <Redirect to="/login" />;
    }

    return (
        <div>
            <h2 className="logout-components__title"> Here you can log out or return to previous page</h2>

            <div className="logout-components">
                <div className="logout-components__heading">
                    <h3>Do you really want to logout?</h3>
                </div>
                <div className="logout-components__actions">
                    <Button onClick={logOut} variant="contained" color="secondary">
                        Log Out
                    </Button>

                    <Button
                        onClick={() => {
                            history.goBack();
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LogOut;
