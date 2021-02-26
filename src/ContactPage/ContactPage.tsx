import React from 'react';
import { Container, Button, Card, Form} from 'react-bootstrap';
import {faHeading, faStore} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import axios, { AxiosRequestConfig } from "axios";

interface HackTheBoxinfo{
  data?: any;
  anythingElse?: string;
}

export class ContactPage extends React.Component{

  state: HackTheBoxinfo;

  constructor(props: Readonly<{}>){
    super(props);

    this.state = {

    }
  }
  

  private getThem(){

    const requestData: AxiosRequestConfig = {
      method: 'post',
      url: "https://www.hackthebox.eu/api/invite/generate",
      headers: {
        'Access-Control-Allow-Origin': 'app.https://hackthebox.eu'
      }
    };


    axios(requestData).then(res =>{
      console.log(res);
    }
    );
  }

  render() {
    return (
        <Container>
            <Card bg="dark" text="danger">
              <Card.Header><FontAwesomeIcon icon={faHeading}></FontAwesomeIcon> Neki naslov</Card.Header>
               <Card.Body>
                  <Card.Text>
                     <FontAwesomeIcon icon={faStore}></FontAwesomeIcon>   Home

                  </Card.Text>
                  <Card.Text>

                  </Card.Text>
                  <Form>
                    <Form.Group>
                      <Button variant="primary" onClick={() => this.getThem()}>Get them</Button>
                    </Form.Group>
                  </Form>
            </Card.Body>
           </Card>
        </Container>
    );
    }

}