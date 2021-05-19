import React from 'react';
import Home from './Pages/Home/Home';
import AcademyView from './components/AcademyView';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import './styles/index.scss';
import Dashboard from './components/Dashboard/Dashboard';
import LogOut from './components/LogOut/LogOut';
import Academies from './components/Academies/Academies';
import RegisterForm from './components/RegisterForm/RegisterForm';
import LoginForm from './components/LoginForm/LoginForm';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import PublicOnlyRoute from './components/Routes/PublicOnlyRoutes';
import AdminRoute from './components/Routes/AdminRoute';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';
import { useSelector } from 'react-redux';
import { applicationRoutes } from './components/Routes/routes';
import AcademyFormCreate from './components/AcademyFormCreate';
import AcademyStudents from './components/AcademyStudents';
import FormView from './components/FormView';
import FormAcademyFormCreate from './components/FormAcademyFormCreate';
import Forms from './components/Forms/Forms';
import {
    PlaceholderForms,
    PlaceholderProfile,
    PlaceholderQuestions,
} from './components/TemporaryPlaceholders/TemporaryPlaceholders';

function App() {
    const currentUser = useSelector((state) => state.userReducer);
    const routes = applicationRoutes;

    return (
        <Router>
            <Layout>
                <Switch>
                    <PublicOnlyRoute path={routes.root.path} exact component={Home} hasRole={currentUser.role} />
                    <PublicOnlyRoute
                        path={routes.register.path}
                        exact
                        component={RegisterForm}
                        hasRole={currentUser.role}
                    />
                    <PublicOnlyRoute path={routes.login.path} exact component={LoginForm} hasRole={currentUser.role} />
                    <ProtectedRoute path={routes.logout.path} exact component={LogOut} hasRole={currentUser.role} />
                    <ProtectedRoute
                        path={routes.dashboard.path}
                        exact
                        component={Dashboard}
                        hasRole={currentUser.role}
                    />
                    <ProtectedRoute
                        path={routes.academies.path}
                        exact
                        component={Academies}
                        hasRole={currentUser.role}
                    />
                    <AdminRoute
                        path={`${routes.academies.path}/create`}
                        exact
                        component={AcademyFormCreate}
                        hasRole={currentUser.role}
                    />
                    <ProtectedRoute
                        path={`${routes.academies.path}/:id`}
                        exact
                        component={AcademyView}
                        hasRole={currentUser.role}
                    />
                    <AdminRoute
                        path="/academies/:id/students"
                        exact
                        component={AcademyStudents}
                        hasRole={currentUser.role}
                    />
                    <AdminRoute
                        path="/academies/:id/forms/create"
                        exact
                        component={FormAcademyFormCreate}
                        hasRole={currentUser.role}
                    />
                    <AdminRoute path="/academies/:id/forms" exact component={Forms} hasRole={currentUser.role} />
                    {/* <AdminRoute path="/users" exact component={Users} hasRole={currentUser.role} /> */}
                    {/* <AdminRoute path="/users/create" exact component={CreateUser} hasRole={currentUser.role} /> */}
                    {/* <AdminRoute path="/users/:id" exact component={User} hasRole={currentUser.role} /> */}
                    <ProtectedRoute
                        path="/academies/:id/forms/:id1"
                        exact
                        component={FormView}
                        hasRole={currentUser.role}
                    />
                    <AdminRoute path="/forms" exact component={PlaceholderForms} hasRole={currentUser.role} />
                    <ProtectedRoute path="/profile" exact component={PlaceholderProfile} hasRole={currentUser.role} />
                    <AdminRoute path="/questions" exact component={PlaceholderQuestions} hasRole={currentUser.role} />
                    {/* <AdminRoute path="/questions/create" exact component={CreateQuestion} hasRole={currentUser.role} /> */}
                    {/* <AdminRoute path="/questions/:id" exact component={Question} hasRole={currentUser.role} /> */}
                    {/* <AdminRoute path="/answers" exact component={Answers} hasRole={currentUser.role} /> */}
                    {/* <AdminRoute path="/answers/create" exact component={CreateAnswer} hasRole={currentUser.role} /> */}
                    {/* <AdminRoute path="/answers/:id" exact component={Answer} hasRole={currentUser.role} /> */}
                    <Route path="*" exact component={NotFoundPage} />
                </Switch>
            </Layout>
        </Router>
    );
}

export default App;
