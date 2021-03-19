import { faBook, faListAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, CardImg, Container, Row } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { idText } from "typescript";
import api, { ApiResponse, getId } from "../api/api";
import { ApiConfig } from "../config/ApiConfig";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface AdministratorDashboardPageState {
    logginState: boolean;
    id: number;
    username: string;
    alert: string;
}

export class AdministratorDashboardPage extends React.Component {

    state: AdministratorDashboardPageState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            logginState: false,
            id: 0,
            username: '',
            alert: ''
        }
    }

    private setAlertState(message: string){
        this.setState(Object.assign(this.state, {
            alert: message
        }))
    }

    private setADminDataState(id: number, username: string){
        this.setState(Object.assign(this.state, {
            id: id,
            username: username
        }))
    }

    private setLogginState(logginState: boolean){
        this.setState(Object.assign(this.state, { logginState: logginState }));
    }

    
    private getMyData(){

        const administratorid = Number(getId('administrator'));

        api('/api/administrator/' + administratorid, 'get', {}, 'administrator').then((res: ApiResponse) => {

            if(res.status === 'error' || res.status === 'login'){
                this.setAlertState('Your loggin doesnt workout, please try again!');
                return;
            }

            this.setADminDataState(Number(res.data.administratorId), res.data.username);
        });
    }

    componentWillMount(){
        this.getMyData();
    }

    componentWillUpdate(){
        this.getMyData();
    }



    render(){

        if(this.state.logginState === false){
          <Redirect to="/administrator/login"></Redirect>
        }
      
        return(
          <Container>
            <RoledMainMenu role='admin'/>
            <Card bg="dark" text="primary">
            <Card.Header className="text-center" style={{color: 'white'}}>
              <FontAwesomeIcon style={{height: '40px', width: "40px"}} icon={faBook}></FontAwesomeIcon> 
              <strong style={{fontSize: "30px"}}>Administrator Dashboard</strong>
            </Card.Header>
            <Card.Body>
                <Card>
                    <Card.Title>
                        Hello {this.state.username}
                        <CardImg width="100%" height="400px" src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_the_Republika_Srpska_%28unoff%29.jpg" />
                    </Card.Title>
                </Card>
                <Card.Text>Your id is {this.state.id}</Card.Text>
                <ul>
                    <li style={{color: '#dc0001'}}><Link style={{color: '#dc0001'}} to='/administrator/dashboard/category'>Category</Link></li>
                    <li style={{color: '#2f54ff'}}><Link style={{color: '#2f54ff'}} to='/administrator/dashboard/Article'>Article</Link></li>
                    <li style={{color: 'white'}}><Link style={{color: 'white'}} to='/administrator/dashboard/feature'>Feature</Link></li>
                    <li style={{color: 'white'}}><Link style={{color: 'white'}} to='/administrator/dashboard/get_reverse_shell'> Get hacked</Link></li>
                </ul>
            </Card.Body>
            </Card>
          </Container>
        );
      }



}
//, border: '1px solid black'