import React from 'react';
import { Container, Card, Col, Form, Button, Alert} from 'react-bootstrap';
import {faSignInAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import api, {ApiResponse, saveToken, saveRefreshToken, saveIdentity, saveId} from '../api/api'
import { Redirect } from "react-router-dom"
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface AdministratorLoginPageState{
    username: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;
}

export class AdministratorLoginPage extends React.Component{

    state: AdministratorLoginPageState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            isLoggedIn: false
        }
    }

    private setErrorMessage(message: string){
        const newState = Object.assign(this.state, {
            errorMessage: message
        });

        this.setState(newState);
    }

    private setLogginState(isLogged: boolean){
        const newState = Object.assign(this.state, {
            isLoggedIn: isLogged
        });

        this.setState(newState);
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>){
        const newState = Object.assign(this.state,
            { [event.target.id]: event.target.value});
        
        this.setState(newState);
    }

    private doLogin(){

        api('auth/administrator/login',
        'post',{
            username: this.state.username,
            password: this.state.password
        }).then((res: ApiResponse) =>{

            if(res.status === 'error'){
                this.setErrorMessage("You made an input misstake, try again!");

                return;
            }
            if(res.status === 'ok'){

                if(res.data.statusCode !== undefined){

                    let message: string = '';

                    switch (res.data.statusCode) {
                        case -3001:
                            message = "Unknown username";
                            break;
                        case -3002:
                            message = "Bad password";
                            break;
                    }

                    this.setErrorMessage(message);
                    return;
                }

                saveToken(res.data.token, 'administrator');
                saveRefreshToken(res.data.refreshToken, 'administrator');
                saveId(res.data.id, 'administrator');
                
                this.setLogginState(true);
            }
        });
    }

    render() {
        if(this.state.isLoggedIn){
            return (
                <Redirect to="/administrator/dashboard" />
            );
        }
    return (
        <Container>
            <RoledMainMenu role='visitor'/>
            <Card bg="dark" text="light">
                <Card.Header><FontAwesomeIcon icon={faSignInAlt}></FontAwesomeIcon>Administrator Logg in</Card.Header>
                <Card.Body>
                   <Col md={ {span: 6, offset: 3} }>
                       <Form>
                           <Form.Group>
                               <Form.Label htmlFor="username">Username</Form.Label>
                               <Form.Control type='text' id='username' value={this.state.username} onChange={(event: any) => this.formInputChanged(event)}></Form.Control>
                           </Form.Group>
                           <Form.Group>
                               <Form.Label htmlFor="password">Password</Form.Label>
                               <Form.Control type='password' id='password' value={this.state.password} onChange={(event: any) => this.formInputChanged(event)}></Form.Control>
                           </Form.Group>
                           <Form.Group>
                               <Button variant="primary" onClick={() => this.doLogin()}>Log in</Button>
                           </Form.Group>
                       </Form>
                       <Alert variant="danger" className={this.state.errorMessage ? '' : 'd-none'}>{this.state.errorMessage}</Alert>
                   </Col>
                </Card.Body>
            </Card>
        </Container>
    );
    }
}
