import { faAnchor } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Container, Card, Form, Alert, Col, Row } from 'react-bootstrap';
import { Link } from "react-router-dom"
import api, { ApiResponse } from '../api/api'


interface UserRegistrationPageState{

    formData: {
        email: string;
        password: string;
        forename: string;
        surname: string;
        phoneNumber: string;
        postalAddress: string;
    },
    message: string,
    repeatPass: string,
    isRegistrationDone: boolean;
}

export class UserRegistrationPage extends React.Component{
    
    state: UserRegistrationPageState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            formData: {
                email: '',
                password: '',
                forename: '',
                surname: '',
                phoneNumber: '',
                postalAddress: ''
            },
            message: '',
            repeatPass: '',
            isRegistrationDone: false
        }
    }

    private setMessage(message: string){
        const newState = Object.assign(this.state, {
            message: message
        })
        this.setState(newState);
    }

    private setIsRegistred(isRegistred: boolean){
        const newState = Object.assign(this.state, {
            isRegistrationDone: isRegistred
        })
        this.setState(newState);
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>){

        const newState = Object.assign(this.state.formData,
            { [event.target.id]: event.target.value});

            this.setState(newState);
    }

    private registerUser(){

        const data = {
            email: this.state.formData.email,
            password: this.state.formData.password,
            forename: this.state.formData.forename,
            surname: this.state.formData.surname,
            phoneNumber: this.state.formData.phoneNumber,
            postalAddress: this.state.formData.postalAddress
        }

        api('auth/user/register',
        'put',
        data).then((res: ApiResponse) =>{
            if(res.status === 'error'){
                this.setMessage("You made an input misstake, try again!");

                return;
            }

            if(res.status === 'ok'){
                if(this.state.repeatPass === this.state.formData.password){
                    this.setIsRegistred(true);
                }
            }
        });
    }

    render() {
        if(this.state.isRegistrationDone){
            return(
                <Link to="/"></Link>
            );
        }
        return(
            <Container>
            <Card bg="light" text="dark">
                <Card.Header><FontAwesomeIcon icon={faAnchor}></FontAwesomeIcon> Sign up</Card.Header>
                <Card.Body>
                   <Col md={ {span: 9, offset: 2} }>
                       <Form>
                                <Form.Group>
                                    <Form.Label htmlFor="email">E-mail</Form.Label>
                                    <Form.Control type='email' id='email' value={this.state.formData.email} onChange={(event: any) => this.formInputChanged(event)}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password">Password</Form.Label>
                                    <Form.Control type='password' id='password' value={this.state.formData.password} onChange={(event: any) => this.formInputChanged(event)}></Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password">Repeat password</Form.Label>
                                    <Form.Control type='password' id='repeatPass' value={this.state.repeatPass} onChange={(event: any) => this.formInputChanged(event)}></Form.Control>
                                </Form.Group>
                               <Form.Group>
                                   <Form.Label>Forename</Form.Label>
                                   <Form.Control type="text" id="forename" value={this.state.formData.forename} onChange={(event: any) => this.formInputChanged(event)}></Form.Control>
                               </Form.Group>
                               <Form.Group>
                                   <Form.Label>Surname</Form.Label>
                                   <Form.Control type="text" id="surname" value={this.state.formData.surname} onChange={(event: any) => this.formInputChanged(event)}></Form.Control>
                               </Form.Group>
                               <Form.Group>
                                   <Form.Label>phoneNumber</Form.Label>
                                   <Form.Control type="phone" id="phoneNumber" value={this.state.formData.phoneNumber} onChange={(event: any) => this.formInputChanged(event)}></Form.Control>
                               </Form.Group>
                               <Form.Group>
                                   <Form.Label>Postal address</Form.Label>
                                   <Form.Control type="textarea" id="postalAddress" value={this.state.formData.postalAddress} onChange={(event: any) => this.formInputChanged(event)}></Form.Control>
                               </Form.Group>
                           <Form.Group>
                               <Button variant="primary" onClick={() => this.registerUser()}>Register</Button>
                           </Form.Group>
                       </Form>
                       <Alert variant="danger" className={this.state.message ? '' : 'd-none'}>{this.state.message}</Alert>
                   </Col>
                </Card.Body>
            </Card>
        </Container>
        );
    }
}