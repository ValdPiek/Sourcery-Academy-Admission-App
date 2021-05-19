import { isLocalhost } from '../serviceWorker';

export const AUTO_HIDE_DURATION = 3000;
export const REDIRECT_DELAY = 4000;

export const API_URL = isLocalhost ? 'http://localhost:8080' : 'https://saaa.devbstaging.com/api';

export const USER_ROLE = {
    PUBLIC: 'PUBLIC',
    STUDENT: 'STUDENT',
    ADMIN: 'ADMIN',
};

export const GENDERS = {
    MALE: 'M',
    FEMALE: 'F',
    OTHER: 'O',
};

export const RESPONSE_STATUS = {
    OK: 200,
    CREATED: 201,
    EMPTY: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

export const AcademyStatus = ['Draft', 'Open for applications', 'Active', 'Finished', 'Cancelled'];

export const CITY_ITEMS = [
    {
        label: 'Klaipėda',
        value: 'Klaipėda',
    },
    {
        label: 'Kaunas',
        value: 'Kaunas',
    },
    {
        label: 'Vilnius',
        value: 'Vilnius',
    },
];

export const ACADEMY_STATUS_ITEMS = [
    {
        label: 'Draft',
        value: '1',
    },
    {
        label: 'Published',
        value: '2',
    },
    {
        label: 'Active',
        value: '3',
    },
    {
        label: 'Finished',
        value: '4',
    },
    {
        label: 'Cancelled',
        value: '5',
    },
];

export const FORM_STATUS_ITEMS = [
    {
        label: 'Draft',
        value: '1',
    },
    {
        label: 'Published',
        value: '2',
    },
    {
        label: 'Active',
        value: '3',
    },
    {
        label: 'Finished',
        value: '4',
    },
];
