import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Switch, Route} from 'react-router-dom';

import './index.css';

import HomePage from './HomePage';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';

import { MainMenu, MainMenuItem } from './MainMenu/MainMenu';
import { ContactPage } from './ContactPage/ContactPage';
import { LoginPage } from './UserLoginPage/UserLoginPage';
import { AboutUsPage } from './AboutUsPage/AboutUsPage';
import CategoryPage from './Category/CategoryPage';
import { UserRegistrationPage } from './UserRegistrationPage/UserRegistrationPage';
import { OrderPage } from './OrderPage/OrderPage';

const menuItems = [
    new MainMenuItem("", "Home"),
    new MainMenuItem("contact", "Contact"),
    new MainMenuItem("aboutUs", "About us"),
    new MainMenuItem('login', "Log in"),
    new MainMenuItem('registration', 'User registration'),
    new MainMenuItem('user/orders', "My orders")
]

ReactDOM.render(
  <React.StrictMode>
    <MainMenu items={ menuItems }></MainMenu>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={HomePage}></Route>
        <Route path='/contact' component={ContactPage}></Route>
        <Route path='/login' component={LoginPage}></Route>
        <Route path='/aboutUs' component={AboutUsPage}></Route>
        <Route path='/registration' component={UserRegistrationPage}></Route>
        <Route path='/category/:id' component={ CategoryPage}/>
        <Route path='/user/orders' component={OrderPage}></Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
