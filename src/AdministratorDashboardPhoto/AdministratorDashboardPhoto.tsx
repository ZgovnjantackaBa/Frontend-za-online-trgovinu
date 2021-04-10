import { faArrowLeft, faImage, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import api, { apiFile, ApiResponse } from "../api/api";
import { ApiConfig } from "../config/ApiConfig";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";
import PhotoType from "../Types/PhotoType";

interface AdministratorDashboardPhotoState{

    isLoggedIn: boolean;
    photos: PhotoType[];
    message: string;
}

interface AdministratorDashboardPhotoProperties{
    match: {
        params: {
            aId: number;
        }
    }
}

export default class AdministratorDashboardPhoto extends React.Component<AdministratorDashboardPhotoProperties> {

    state: AdministratorDashboardPhotoState;

    constructor(props: Readonly<AdministratorDashboardPhotoProperties>){
        super(props);

        this.state = {
            isLoggedIn: true,
            photos: [],
            message: ''
        }
    }

    private setPhotosState(data: PhotoType[]){
        this.setState(Object.assign(this.state, {
            photos: data
        }));
    }

    private setLogginState(state: boolean){
        this.setState(Object.assign(this.state, {
            isLoggedIn: state
        }));
    }

    private setStringState(stateName: string, value: string){
        this.setState(Object.assign(this.state, {
            [stateName]: value
        }));
    }

    private getPhotos(){
        api('/api/article/photos/' + this.props.match.params.aId + '/?join=photos', 'get', {}, 'administrator').then((res: ApiResponse) => {
            if(res.status === 'error'){
                this.setStringState('message', 'Ne mozemo ucitati slike');
                return;
            }
            if(res.status === 'login'){
                this.setLogginState(false);
            }

            this.setPhotosState(res.data.photos);
        })
    }

    private deletePhoto(photoId: number){
        api('/api/article/' + this.props.match.params.aId + '/deletePhoto/' + photoId, 'delete', {}, 'administrator').then((res: ApiResponse) => {
            if(res.status === 'login'){
                this.setLogginState(false);
            }

            if(res.status === 'error'){
                this.setStringState('message', 'You cant delete this photo');
            }

            this.getPhotos();
            this.setStringState('message', 'Message deleted successefull');
            setTimeout(() =>{
                this.setStringState('message', '');
              }, 2000);
        });
    }

    private async aadPhoto(){
    
    const filePicker: any = document.getElementById('image');

    if (filePicker?.files.length === 0) {
        this.setStringState('message', 'You must select a file to upload!');
        return;
    }

    const file = filePicker.files[0];
    await this.uploadPhoto(this.props.match.params.aId, file);

    const alert = document.getElementById('alert');

    this.setStringState('message', 'Photo uploaded successefull');

    if(alert){
        alert.className = "text-success";
        console.log(alert);
      }

    setTimeout(() =>{
        this.setStringState('message', '');
        filePicker.value = '';
      }, 2000);

    this.getPhotos();
    }

    private async uploadPhoto(articleId: number, file: File){
        return await apiFile('/api/article/' + articleId + '/uploadPhoto', 'photo', file, 'administrator');
      }

    private showSingleImage(photo: PhotoType){
        return(
            <Col xs="12" sm="6" lg="3">
                <Card>
                    <Card.Body>
                        <img src={ApiConfig.PHOTO_PATH + 'thumb/' +photo.imagePath } className="w-100"/>
                    </Card.Body>
                    <Card.Footer>
                        <Button className={this.state.photos.length > 1 ? 'w-100' : 'd-none'} variant="danger" onClick={() => this.deletePhoto(photo.photoId)}>Delete</Button>
                    </Card.Footer>
                </Card>
            </Col>
        );
    }

    render(){

        if(this.state.isLoggedIn === false){
            return(
            <Redirect to="/administrator/login/" />
            );
          }
          
        return(
            <Container>
                <RoledMainMenu role="admin"></RoledMainMenu>
                <Card bg="dark" text="white">
                    <Card.Header>
                        <Card.Title> <FontAwesomeIcon icon={faImage}/> Article photos</Card.Title>
                        <Link to='/administrator/dashboard/article' className="btn btn-info"><FontAwesomeIcon icon ={faArrowLeft}/> Go back to articles</Link>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            {this.state.photos.map(this.showSingleImage, this)}
                        </Row>
                    </Card.Body>
                    <Card.Footer>
                        <Form.Group>
                            <Form.Label htmlFor="image">Select the image</Form.Label>
                            <Form.File id="image"/>
                        </Form.Group>
                        <Form.Group>
                            <Button onClick={() => this.aadPhoto()} className="text-center" style={{width: '100px'}}><FontAwesomeIcon icon={faUpload}/></Button>
                        </Form.Group>
                        <Alert id='alert' className={this.state.message !== '' ? 'text-danger' : 'd-none'}>{this.state.message}</Alert>
                    </Card.Footer>
                </Card>
            </Container>
        );
    }

    componentDidMount(){
        this.getPhotos();
    }

    componentDidUpdate(oldProps: any) {
        if (this.props.match.params.aId === oldProps.match.params.aId) {
            return;
        }

        this.getPhotos();
    }
}