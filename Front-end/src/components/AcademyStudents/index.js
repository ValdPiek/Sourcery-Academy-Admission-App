import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, SnackbarContent } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';
import './AcademyStudents.scss';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RESPONSE_STATUS, API_URL, GENDERS } from '../constants';
import { MESSAGES_ERROR, MESSAGES_SUCCESS } from '../messages';
import axios from 'axios';
import { Alert } from '@material-ui/lab';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const AcademyStudents = () => {
    const { id: academyId } = useParams();
    const history = useHistory();
    const user = useSelector((state) => state.userReducer);
    const [academyStudents, setAcademyStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [paginationButtons, setPaginationButtons] = useState([]);
    const [studentsListMessage, setStudentsListMessage] = useState('');
    const [studentsListMessageStyle, setStudentsListMessageStyle] = useState('success');
    const [isSuspendPromptActive, setIsSuspendPromptActive] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});

    const createPaginationButtonsArray = (numOfButtons) => {
        let paginationButtons = [];
        for (let i = 0; i < numOfButtons; i++) {
            let paginationButton = {};
            paginationButton.id = i;
            paginationButton.param = '?page=' + i;
            paginationButtons.push(paginationButton);
        }
        return paginationButtons;
    };

    const fetchAcademyStudents = (urlParams) => {
        axios
            .create({
                baseURL: API_URL,
                headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
            })
            .get('academies/' + academyId + '/students' + urlParams)
            .then((response) => {
                if (response.status === RESPONSE_STATUS.OK) {
                    setAcademyStudents(response.data.content);
                    setCurrentPage(response.data.pageable.pageNumber);
                    setNumberOfPages(response.data.totalPages);
                    setPaginationButtons(createPaginationButtonsArray(response.data.totalPages));
                    setDataLoaded(true);
                }
            })
            .catch((error) => {
                //if server is not responding
                if (!error.response) {
                    setStudentsListMessage(MESSAGES_ERROR.SERVER_NOT_RESPONDING);
                    setStudentsListMessageStyle('error');
                } else {
                    if (
                        error.request.status === RESPONSE_STATUS.NOT_FOUND ||
                        error.request.status === RESPONSE_STATUS.BAD_REQUEST
                    ) {
                        history.push('/academies');
                    }
                }
            });
    };

    useEffect(() => {
        fetchAcademyStudents('?page=0');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderAcademyStudentsList = () => {
        return (
            <div className="table-academy-students__container">
                {/* display error or success message from back end here */}
                {studentsListMessage && <Alert severity={studentsListMessageStyle}>{studentsListMessage}</Alert>}

                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="left">Full name</TableCell>
                            <TableCell align="left">Gender</TableCell>
                            <TableCell align="left">Year of birth</TableCell>
                            <TableCell align="left">Score</TableCell>
                            <TableCell align="right">Suspend from academy</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {academyStudents.map((student) => (
                            <TableRow key={student.id} className="table-academy-students__rows">
                                <TableCell component="th" scope="row">
                                    {student.id}
                                </TableCell>
                                <TableCell align="left">
                                    {/* TODO: change this link when user profile page is added it was (`/users/${student.id}`) */}
                                    <Link to={'#'} className={'table-academy-students__user-link'}>
                                        {student.firstName} {student.lastName}
                                    </Link>
                                </TableCell>
                                <TableCell align="left">
                                    {student.gender === GENDERS.MALE && 'Male'}
                                    {student.gender === GENDERS.FEMALE && 'Female'}
                                    {student.gender === GENDERS.OTHER && 'Other'}
                                </TableCell>
                                <TableCell align="left">{student.yearOfBirth}</TableCell>
                                <TableCell align="left">0</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="secondary"
                                        startIcon={<BackspaceIcon />}
                                        onClick={() => handleSuspendPromptOpen(student)}
                                    >
                                        Suspend
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {numberOfPages > 1 && (
                    <div className="table-academy-students__pagination">
                        <h3>Select page:</h3>
                        {paginationButtons.map((button) => (
                            <Button
                                key={button.id}
                                variant="contained"
                                color={button.id === currentPage ? 'primary' : 'default'}
                                onClick={() => fetchAcademyStudents(button.param)}
                            >
                                {button.id + 1}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const handleSuspendPromptClose = (suspendUser) => {
        suspendUser && handleUserSuspend();
        setIsSuspendPromptActive(false);
        setSelectedUser({});
    };

    const handleSuspendPromptOpen = (user) => {
        setIsSuspendPromptActive(true);
        setSelectedUser(user);
    };

    const handleUserSuspend = () => {
        axios
            .create({
                baseURL: API_URL,
                headers: { Authorization: 'Basic ' + user.credentials, 'X-Requested-With': 'XMLHttpRequest' },
            })
            .delete('/academies/' + academyId + '/membership/' + selectedUser.id)
            .then((response) => {
                //if response gives success message
                if (response.status === RESPONSE_STATUS.OK) {
                    setStudentsListMessage(MESSAGES_SUCCESS.USER_ACADEMY_SUSPEND);
                    setStudentsListMessageStyle('info');
                    if (academyStudents.length === 1 && currentPage !== 0) {
                        fetchAcademyStudents('?page=' + (currentPage - 1));
                    } else {
                        fetchAcademyStudents('?page=' + currentPage);
                    }
                }
            })
            .catch((error) => {
                if (!error.response) {
                    //if server is not responding
                    setStudentsListMessage(MESSAGES_ERROR.SERVER_NOT_RESPONDING);
                    setStudentsListMessageStyle('error');
                } else {
                    //if there are other errors from server side
                    setStudentsListMessage(MESSAGES_ERROR.BAD_REQUEST);
                    setStudentsListMessageStyle('error');
                }
            });
    };

    return (
        <div className="table-academy-students">
            <div className="table-academy-students__header-div">
                <h1 className="table-academy-students__heading">List of students who applied the selected academy</h1>
                <Button
                    component={Link}
                    to={`/academies/${academyId}`}
                    variant="contained"
                    color="primary"
                    className="table-academy-students__back-button"
                    startIcon={<ArrowBackIosIcon />}
                >
                    Back to academy page
                </Button>
            </div>

            <div className="table-academy-students__info-div">
                <p>
                    In this page you are presented with list of users who have applied your selected academy. Here you
                    can do the following:
                </p>
                <ol>
                    <li>Go to selected user&apos;s profile page by clicking on their name.</li>
                    <li>
                        View various information about users (id, full name, gender, points from the latest test, etc.)
                    </li>
                    <li>By clicking button &quot;Suspend&quot; you will permanently remove user from this academy.</li>
                </ol>
            </div>

            {academyStudents.length > 0 && dataLoaded && renderAcademyStudentsList()}

            {academyStudents.length === 0 && dataLoaded && (
                <SnackbarContent message="No students have applied to this academy yet. Come back later!" />
            )}

            <Dialog open={isSuspendPromptActive} onClose={() => handleSuspendPromptClose(false)}>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to suspend{' '}
                        <b>
                            {selectedUser.firstName} {selectedUser.lastName}{' '}
                        </b>
                        from this academy?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleSuspendPromptClose(true)} color="secondary">
                        Yes, suspend
                    </Button>
                    <Button onClick={() => handleSuspendPromptClose(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AcademyStudents;
