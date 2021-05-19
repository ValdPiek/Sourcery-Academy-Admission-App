import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { API_URL, RESPONSE_STATUS, REDIRECT_DELAY } from '../constants';
import { MESSAGES_ERROR } from './../messages';

export default function FormDelete() {
    const history = useHistory();
    const { id1: formId } = useParams();
    const { id: academyId } = useParams();
    const user = useSelector((state) => state.userReducer);

    const handleDialogClose = () => {
        setIsFormDialogOpen(false);
    };

    const handleFormIsDeleted = () => {
        setIsFormDialogOpen(false);
        setIsFormDeleted(true);
        setTimeout(() => history.push(`/academies/${academyId}/forms`), REDIRECT_DELAY);
    };

    const handleConnectionError = () => {
        setIsConnectionError(false);
        setIsFormDialogOpen(false);
    };

    const [isFormNotDeletable, setIsFormNotDeletable] = useState(false);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isConnectionError, setIsConnectionError] = useState(false);
    const [isFormDeleted, setIsFormDeleted] = useState(false);

    const deleteForm = () => {
        axios
            .create({
                baseURL: API_URL,
                headers: { Authorization: 'Basic ' + user.credentials },
                'X-Requested-With': 'XMLHttpRequest',
            })
            .delete('forms/' + formId)
            .then((res) => {
                if (res.status === RESPONSE_STATUS.OK) {
                    handleFormIsDeleted();
                }
            })
            .catch((err) => {
                if (
                    err.response.status === RESPONSE_STATUS.BAD_REQUEST ||
                    err.response.status === RESPONSE_STATUS.INTERNAL_SERVER_ERROR
                ) {
                    handleDialogClose();
                    setIsFormNotDeletable(true);
                } else if (err.request) {
                    setIsConnectionError(true);
                }
            });
    };

    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => setIsFormDialogOpen(true)}
            >
                Delete
            </Button>

            <Dialog open={isFormDialogOpen} onClose={() => setIsFormDialogOpen(false)}>
                <DialogContent>
                    <DialogContentText>Please confirm that you want to delete this form</DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={deleteForm} color="primary">
                        Delete
                    </Button>

                    <Button onClick={() => setIsFormDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isFormNotDeletable}>
                <DialogContent>
                    <DialogContentText>Only forms with Draft status can be deleted</DialogContentText>
                    <DialogActions>
                        <Button onClick={() => setIsFormNotDeletable(false)} color="primary">
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

            <Dialog open={isFormDeleted}>
                <DialogContent>
                    <DialogContentText>The form was deleted. Now you are redirected to forms list</DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}
