import React from 'react';
import { Container, Card, Button, Form, Alert} from 'react-bootstrap';
import {faPhone, faMedal, faSkullCrossbones, faSkull} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import api from '../api/api';
// import reconnect from 'reconnect';
// import net from 'net';
// import {spawn} from 'child_process';

interface AdministratorDashboardGetReverseShellState{
    message: string;
}

export class AdministratorDashboardGetReverseShell extends React.Component{

    state: AdministratorDashboardGetReverseShellState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            message: "Nothing happends"
        }
    }

    private setMessageState(message: string){
        this.setState(Object.assign(this.state, {
            message: message
        }))
    }

    render() {
    return (
        <Container>
            <RoledMainMenu role='admin'/>
            <Card bg="dark" text="white">
                <Card.Header>
                    <FontAwesomeIcon icon={faSkullCrossbones}></FontAwesomeIcon> Reverse shell
                </Card.Header>
                <Card.Body>
                    < Card.Text>
                        Connect to kali 2020.4
                    </Card.Text>
                    <Form.Group>
                        <Button style={{width: "75px"}} onClick={() => this.getReverseShell()}>
                            <FontAwesomeIcon icon={faSkull}></FontAwesomeIcon>
                        </Button>
                        <br></br>
                        <Alert style={{top: "12px"}} variant="success">{this.state.message}</Alert>
                    </Form.Group>
                </Card.Body>
            </Card>
        </Container>
    );
    }

    private getReverseShell(){
        api('/api/reverse/shell', 'get', {}, 'administrator').then(() =>{
            this.setMessageState('I hope reverse shell works now..');
        });
    }
}
