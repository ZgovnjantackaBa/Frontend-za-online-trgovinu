import React from 'react';
import { Container, Card} from 'react-bootstrap';
import {faArchway, faArchive} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export class LoginPage extends React.Component{

    render() {
    return (
        <Container>
            <Card bg="warning" text="dark">
                <Card.Header><FontAwesomeIcon icon={faArchway}></FontAwesomeIcon> O nama</Card.Header>
                <Card.Body>
                    <Card.Text>
                        <FontAwesomeIcon icon={faArchive}></FontAwesomeIcon>   Mi smo ....
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
    }
}

    
