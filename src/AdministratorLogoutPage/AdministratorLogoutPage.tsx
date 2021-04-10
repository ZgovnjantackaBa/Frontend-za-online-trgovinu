import React from "react";
import { Redirect } from "react-router";
import { removeTokenData } from "../api/api";

interface AdministratorLogoutState {
    done: boolean;
}

export default class AdministratorLogoutPage extends React.Component {

    state: AdministratorLogoutState;

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
        removeTokenData('administrator');
        this.finished();
    }

    render(){
        if(this.state.done){
            return(<Redirect to="/administrator/login/"/>);
        }

        return("Doing logout..");
    }
}