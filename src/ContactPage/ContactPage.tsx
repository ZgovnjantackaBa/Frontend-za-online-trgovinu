import React from 'react';
import { Container, Card} from 'react-bootstrap';
import {faHeading, faStore} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export class ContactPage extends React.Component{

  render() {
    return (
        <Container>
            <Card bg="dark" text="danger">
              <Card.Header><FontAwesomeIcon icon={faHeading}></FontAwesomeIcon> Neki naslov</Card.Header>
               <Card.Body>
                  <Card.Text>
                     <FontAwesomeIcon icon={faStore}></FontAwesomeIcon>   Home
                  </Card.Text>
            </Card.Body>
           </Card>
        </Container>
    );
    }

}