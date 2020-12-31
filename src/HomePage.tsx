import React from 'react';
import { Container, Card} from 'react-bootstrap';
import {faHome, faAnchor} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function HomePage() {
  return (
    <Container>
      <Card bg="primary" text="white">
        <Card.Header><FontAwesomeIcon icon={faAnchor}></FontAwesomeIcon> Neki naslov</Card.Header>
        <Card.Body>
          <Card.Text>
            <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>   Home
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default HomePage;
