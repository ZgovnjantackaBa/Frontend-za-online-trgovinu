import React from 'react';
import { Container, Card} from 'react-bootstrap';
import {faPhone, faMedal} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

export class AboutUsPage extends React.Component{

    render() {
    return (
        <Container>
            <RoledMainMenu role='user'/>
            <Card bg="dark" text="white">
                <Card.Header>
                    <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon> Kontaktirajte nas
                </Card.Header>
                <Card.Body>
                    < Card.Text>
                        <FontAwesomeIcon icon={faMedal}></FontAwesomeIcon>   Ovo je nas kontakt
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
    }
}
