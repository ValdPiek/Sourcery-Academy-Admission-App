import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { API_URL, RESPONSE_STATUS } from '../constants';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { MESSAGES_ERROR } from './../messages';

export default function AcademyDelete() {
    const history = useHistory();
    const { id } = useParams();
    const user = useSelector((state) => state.userReducer);

    const [isAcademyDialogOpen, setIsAcademyDialogOpen] = useState(false);
    const [isAcademyNotDeletable, setIsAcademyNotDeletable] = useState(false);
    const [isConnectionError, setIsConnectionError] = useState(false);

    const handleNotDeletableAcademy = () => {
        setIsAcademyNotDeletable(true);
    };
    const handleDeletableAcademy = () => {
        setIsAcademyNotDeletable(false);
        history.push('/academies');
    };

    const handleDialogOpen = () => {
        setIsAcademyDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsAcademyDialogOpen(false);
    };

    const handleConnectionError = () => {
        setIsAcademyDialogOpen(false);
        setIsConnectionError(true);
        history.push('/academies');
    };

    const deleteAcademy = () => {
        axios
            .create({
                baseURL: API_URL,
                headers: { Authorization: 'Basic ' + user.credentials },
                'X-Requested-With': 'XMLHttpRequest',
            })
            .delete('academies/' + id)
            .then((res) => {
                if (res.status === RESPONSE_STATUS.OK) {
                    history.push('/academies');
                }
            })
            .catch((err) => {
                if (err.response.status === RESPONSE_STATUS.BAD_REQUEST) {
                    handleDialogClose(true);
                    handleNotDeletableAcademy(true);
                } else if (err.request) {
                    setIsConnectionError(true);
                }
            });
    };

    return (
        <div>
            <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={handleDialogOpen}>
                DELETE
            </Button>

            <Dialog open={isAcademyDialogOpen} onClose={handleDialogClose}>
                <DialogContent>
                    <DialogContentText>Please confirm that you want to delete this academy</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={deleteAcademy} color="primary">
                        Delete
                    </Button>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isAcademyNotDeletable}>
                <DialogContent>
                    <DialogContentText>
                        Only Academies that have Draft and Cancelled status can be deleted!
                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={handleDeletableAcademy} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

            <Dialog open={isConnectionError}>
                <DialogContent>
                    <DialogContentText>{MESSAGES_ERROR.SERVER_NOT_RESPONDING}</DialogContentText>
                    <DialogActions>
                        <Button onClick={handleConnectionError} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
}
