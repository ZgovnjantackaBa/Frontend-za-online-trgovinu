import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Switch, Route} from 'react-router-dom';
import './index.css';
import HomePage from './HomePage/HomePage';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { ContactPage } from './ContactPage/ContactPage';
import { UserLoginPage } from './UserLoginPage/UserLoginPage';
import { AboutUsPage } from './AboutUsPage/AboutUsPage';
import CategoryPage from './Category/CategoryPage';
import { UserRegistrationPage } from './UserRegistrationPage/UserRegistrationPage';
import { OrderPage } from './OrderPage/OrderPage';
import { AdministratorLoginPage } from './AdministratorLoginPage/AdministratorLoginPage';
import { AdministratorDashboardPage } from './AdministratorDashboardPage/AdministratorDashboardPage';
import { AdministratorDashboardCategory } from './AdministratorDashboardCategory/AdministratorDashboardCategory';
import { AdministratorDashboardGetReverseShell } from './AdministratorDashboardGetReverseShell/AdministratorDashboardGetReverseShell';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={HomePage}></Route>
        <Route path='/contact' component={ContactPage}></Route>
        <Route path='/user/login' component={UserLoginPage}></Route>
        <Route path='/aboutUs' component={AboutUsPage}></Route>
        <Route path='/user/registration' component={UserRegistrationPage}></Route>
        <Route path='/category/:id' component={ CategoryPage}/>
        <Route path='/user/orders' component={OrderPage}></Route>
        <Route path='/administrator/login' component={AdministratorLoginPage}></Route>
        <Route exact path='/administrator/dashboard' component={AdministratorDashboardPage}></Route>
        <Route path='/administrator/dashboard/category' component={AdministratorDashboardCategory}></Route>
        <Route path='/administrator/dashboard/get_reverse_shell' component={AdministratorDashboardGetReverseShell}></Route>

      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
