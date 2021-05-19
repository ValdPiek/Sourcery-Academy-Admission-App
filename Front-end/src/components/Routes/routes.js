import { USER_ROLE } from '../constants';
import FormLogin from '../LoginForm/LoginForm';
import FormRegister from '../RegisterForm/RegisterForm';
import Dashboard from '../Dashboard/Dashboard';
import Academies from '../Academies/Academies';
import Home from '../../Pages/Home/Home';

export const applicationRoutes = {
    root: {
        label: 'Home',
        path: '/',
        allowFor: [USER_ROLE.PUBLIC],
        component: Home,
    },
    login: { label: 'Login', path: '/login', allowFor: [USER_ROLE.PUBLIC], component: FormLogin },
    register: { label: 'Register', path: '/register', allowFor: [USER_ROLE.PUBLIC], component: FormRegister },
    dashboard: {
        label: 'Dashboard',
        path: '/dashboard',
        allowFor: [USER_ROLE.ADMIN, USER_ROLE.STUDENT],
        component: Dashboard,
    },
    academies: {
        label: 'Academies',
        path: '/academies',
        allowFor: [USER_ROLE.ADMIN, USER_ROLE.STUDENT],
        component: Academies,
    },
    forms: { label: 'Forms', path: '/forms', allowFor: [USER_ROLE.ADMIN], component: undefined },
    questions: { label: 'Questions', path: '/questions', allowFor: [USER_ROLE.ADMIN], component: undefined },
    answers: { label: 'Answers', path: '/answers', allowFor: [], component: undefined },
    profile: { label: 'Profile', path: '/profile', allowFor: [USER_ROLE.ADMIN], component: undefined },
    logout: { label: 'Logout', path: '/logout', allowFor: [USER_ROLE.ADMIN, USER_ROLE.STUDENT], component: undefined },
};
