import React from "react";
import { Redirect } from "react-router";
import { removeTokenData } from "../api/api";

interface UserLogoutPageState {
    done: boolean;
}

export default class UserLogoutPage extends React.Component {

    state: UserLogoutPageState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            done: false
        }
    }

    componentDidMount(){
        this.doLogout();
    }

    componentDidUpdate(){
        this.doLogout();
    }

    finished(){
        this.setState({done: true});
    }

    doLogout(){
        removeTokenData('user');
        this.finished();
    }

    render(){
        if(this.state.done){
            return(<Redirect to="/user/login/"/>);
        }

        return("Doing logout..");
    }
}