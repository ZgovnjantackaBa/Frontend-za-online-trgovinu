import { faArchive, faArrowsAlt, faDatabase, faFileArchive, faListAlt, faPlus, faPlusCircle, faPlusSquare, faSave, faStore, faStoreAlt, faStoreAltSlash, faToolbox, faTools, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Container, Form, Modal, Row, Table} from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { ApiResponse } from "../api/api";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";
import FeatureType from "../Types/FeatureType";

interface AdministratorDashboardFeatureState{
    features: FeatureType[];
    isLoggedIn: boolean;
    addModal: {
      visible: boolean;
      name: string;
      message: string;
    };
    editModal: {
      visible: boolean;
      featureId: number | null;
      name: string;
      message: string;
  };
}

export interface FeatureDto{
  featureId: number;
  name: string;
  categoryId: number;
}

export interface AdministratorDashboardFeatureProperties{
  match: {
    params: {
      cId: number;
    }
  }
}

export class AdministratorDashboardFeature extends React.Component<AdministratorDashboardFeatureProperties> {

    state: AdministratorDashboardFeatureState;

    constructor(props: Readonly<AdministratorDashboardFeatureProperties>){
        super(props);

        this.state = {
            isLoggedIn: true,
            features: [],
            addModal: {
              visible: false,
              name: '',
              message: ''
            },
            editModal: {
              visible: false,
              featureId: null,
              name: '',
              message: ''
            }
        }
    }

    private setAddModalVisibleState(newState: boolean) {
      this.setState(Object.assign(this.state,
          Object.assign(this.state.addModal, {
              visible: newState,
          })
      ));
  }

  private setAddModalStringFieldState(fieldName: string, newValue: string) {
      this.setState(Object.assign(this.state,
          Object.assign(this.state.addModal, {
              [ fieldName ]: newValue,
          })
      ));
  }
  
  private setAddModalNumberFieldState(fieldName: string, newValue: any) {
      this.setState(Object.assign(this.state,
          Object.assign(this.state.addModal, {
              [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
          })
      ));
  }

  private setEditModalVisibleState(newState: boolean) {
      this.setState(Object.assign(this.state,
          Object.assign(this.state.editModal, {
              visible: newState,
          })
      ));
  }

  private setEditModalStringFieldState(fieldName: string, newValue: string) {
      this.setState(Object.assign(this.state,
          Object.assign(this.state.editModal, {
              [ fieldName ]: newValue,
          })
      ));
  }
  
  private setEditModalNumberFieldState(fieldName: string, newValue: any) {
      this.setState(Object.assign(this.state,
          Object.assign(this.state.editModal, {
              [ fieldName ]: (newValue === 'null') ? null : Number(newValue),
          })
      ));
  }

  private putFeaturesInState(data: FeatureDto[]) {
    // Moze i ovako samo u slučaju da se poklapaju interfejsi ApiFeatureDto i FeatureType:
    // const features: FeatureType[] = data.map(feature => (feature));

    const features: FeatureType[] = data.map(feature => {
      return {
        featureId: feature.featureId,
        name: feature.name,
        categoryId: feature.categoryId
      }
    });

    this.setState(Object.assign(this.state, {
        features: features,
    }));
}


    private setFeatureState(features: FeatureType[]){
        this.setState(Object.assign(this.state, {
            features: features
        }));
    }

    private setLogginState(isLoggedIn: boolean){
      this.setState(Object.assign(this.state, {
          isLoggedIn: isLoggedIn
      }));
  }

  private addFeature(){

    api('/api/feature/', 'post', {
      name: this.state.addModal.name,
      categoryId: this.props.match.params.cId
    }, 'administrator').then((res: ApiResponse) => {

      if(res.status === 'login'){
        return this.setAddModalVisibleState(false);
      }

      const alert = document.getElementById('alert');

      if(alert){
        alert.style.color = "#28a745";
      }
      

      if(res.status === 'error'){

        if(alert){
          alert.style.color = "#dc0001";
        }

        setTimeout(() =>{
          this.clearAddModalFields();
        }, 2000);
        this.setAddModalStringFieldState("message", res.data);
      }

      this.setAddModalStringFieldState('message', "CategoryAdded succesefull");

      setTimeout(() =>{
        this.clearAddModalFields();
      }, 2000);
    });
  }

  private clearAddModalFields(){
    this.setAddModalVisibleState(false);
    this.setAddModalStringFieldState('name', '');
    this.setAddModalStringFieldState('message', '');
    this.setAddModalNumberFieldState('categoryId', null);
  }

  private editFeature(){

    const category = {
      name: this.state.editModal.name
    }

    api('/api/feature/' + String(this.state.editModal.featureId) + '/', 'patch', category, "administrator").then((res: ApiResponse) => {
            
      if(res.status === 'login'){
        return this.setLogginState(false);
      }

      if(res.status === 'error'){
        this.setEditModalStringFieldState("message", res.data);
      }

      this.setEditModalStringFieldState('message', "success");
      
      setTimeout(() =>{
        this.clearEditModal();
      }, 2000);
  });
    this.getFeatures();
}

private getFeatures() {
  api('/api/feature/by_category_id/' + this.props.match.params.cId , 'get', {}, 'administrator')
  .then((res: ApiResponse) => {
      if (res.status === "error" || res.status === "login") {
          this.setLogginState(false);
          return;
      }

      this.putFeaturesInState(res.data);
  });
}

    private showEditModal(feature: FeatureDto){
      this.setEditModalStringFieldState('name', feature.name);
      this.setEditModalNumberFieldState('featureId', feature.featureId);
      this.setEditModalVisibleState(true)
    }

    private removeFeature(featureId: number){
      api('/api/feature/' + featureId, 'delete', [], 'administrator').then((res: ApiResponse) => {
        if(res.status === 'login' || res.status === 'error'){
          return this.setLogginState(false);
        }
      });
      this.getFeatures();
    }

    private clearEditModal(){
      this.setEditModalStringFieldState('name', '');
      this.setEditModalStringFieldState('message', '');
      this.setEditModalVisibleState(false)
    }

    componentDidMount() {
      this.getFeatures();
  }

  componentDidUpdate(oldProps: any) {
      if (this.props.match.params.cId === oldProps.match.params.cId) {
          return;
      }

      this.getFeatures();
  }

    render(){

        if(this.state.isLoggedIn === false){
          return(
          <Redirect to="/administrator/login/" />
          );
        }
      
        return(
          <Container>
            <RoledMainMenu role='admin'/>
            <Card bg="dark" text="white">
            <Card.Header className="text-center">
              <FontAwesomeIcon style={{height: '40px', width: "40px"}} icon={faListAlt}></FontAwesomeIcon> <strong style={{fontSize: "30px"}}>Feature managment</strong>
            </Card.Header>
            <Card.Body>
              <Table hover size="lg" style={{color: "#dddddd"}}>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Category id</th>
                    <th colSpan={2}><Button variant="success" style={{width: "100%", height: "100%"}} onClick={() => this.setAddModalVisibleState(true)}><FontAwesomeIcon icon={faSave}/></Button></th>
                  </tr>
                </thead>
                  <tbody>
                    {this.state.features.map(feature => {
                      return(
                        <tr>
                          <td>{feature.featureId}</td>
                          <td>{feature.name}</td>
                          <td className="text-center">{feature.featureId}</td>
                          <td className="text-center"><Button style={{width: "100%", height: "100%"}} onClick={() => this.showEditModal(feature)}>
                            <FontAwesomeIcon icon={faTools}/></Button></td>
                          <td className="text-center"><Button variant="danger" style={{width: "100%", height: "100%"}} onClick={() => this.removeFeature(feature.featureId)}>
                            <FontAwesomeIcon icon={faTrash}/></Button></td>
                        </tr>
                      );
                    }, this)}
                  </tbody>
              </Table>
              <Modal size="lg" centered show={this.state.addModal.visible} onHide={() => this.setAddModalVisibleState(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>
                   Add feature
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                      <Form.Label htmlFor="name">Name</Form.Label>
                      <Form.Control id="name" type="text" value={this.state.addModal.name} onChange={(e) => this.setAddModalStringFieldState("name", e.target.value)}></Form.Control>
                    </Form.Group>
                   
                    <Form.Group>
                      <Button style={{width: '80px', height: '40px'}} variant="primary" onClick={() => this.addFeature()}><FontAwesomeIcon icon={faDatabase}></FontAwesomeIcon></Button>
                    </Form.Group>
                    <Alert id='alert' className={this.state.addModal.message ? '': 'd-none'}>{this.state.addModal.message}</Alert>
                </Modal.Body>
              </Modal>

              <Modal size="lg" centered show={this.state.editModal.visible} onHide={() => this.clearEditModal()}>
                <Modal.Header closeButton>
                  <Modal.Title>
                   Edit feature
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                      <Form.Label htmlFor="name">Name</Form.Label>
                      <Form.Control id="name" type="text" value={this.state.editModal.name} onChange={(e) => this.setEditModalStringFieldState("name", e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Button variant="primary" onClick={() => this.editFeature()}>Save</Button>
                    </Form.Group>
                    <Alert id='alert' className={this.state.editModal.message ? '': 'd-none'}>{this.state.editModal.message}</Alert>
                </Modal.Body>
              </Modal>

            </Card.Body>
            </Card>
          </Container>
        );
      }
      
      }



//#2f34d8