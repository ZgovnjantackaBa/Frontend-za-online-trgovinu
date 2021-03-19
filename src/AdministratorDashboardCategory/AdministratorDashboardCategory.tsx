import { faArchive, faArrowsAlt, faDatabase, faFileArchive, faListAlt, faPlus, faPlusCircle, faPlusSquare, faSave, faStore, faStoreAlt, faStoreAltSlash, faToolbox, faTools, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Container, Form, Modal, Row, Table} from "react-bootstrap";
import { Redirect } from "react-router-dom";
import api, { ApiResponse } from "../api/api";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";
import CategoryType from "../Types/CategoryType";

interface AdministratorDashboardCategoryState{
    visible: boolean;
    categories: CategoryDto[];
    isLoggedIn: boolean;
    addModal: {
      visible: boolean;
      name: string;
      imagePath: string;
      parentCategoryId: number | null;
      message: string;
    };
    editModal: {
      categoryId?: number;
      visible: boolean;
      name: string;
      imagePath: string;
      parentCategoryId: number | null;
      message: string;
  };
}

interface CategoryDto{
  categoryId: number
  name: string;
  imagePath: string;
  parentCategoryId: number | null;
}

export class AdministratorDashboardCategory extends React.Component {

    state: AdministratorDashboardCategoryState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            visible: false,
            isLoggedIn: true,
            categories: [],
            addModal: {
              visible: false,
              name: '',
              imagePath: '',
              parentCategoryId: null,
              message: ''
            },
            editModal: {
              visible: false,
              name: '',
              imagePath: '',
              parentCategoryId: null,
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

    // componentWillMount(){
    //     this.getCategories();
    // }

    // componentWillUpdate(){
    //     this.getCategories();
    // }

    componentDidMount(){
      this.getCategories();
    }

    private setCategoriesState(categories: CategoryType[]){
        this.setState(Object.assign(this.state, {
            categories: categories
        }));
    }

    private setLogginState(isLoggedIn: boolean){
      this.setState(Object.assign(this.state, {
          isLoggedIn: isLoggedIn
      }));
  }

  private postCategory(){

    api('/api/category/', 'post', {
      name: this.state.addModal.name,
      imagePath: this.state.addModal.imagePath,
      parentCategoryId: this.state.addModal.parentCategoryId
    }, 'administrator').then((res: ApiResponse) => {

      if(res.status === 'login'){
        return this.setAddModalVisibleState(false);
      }

      const alert = document.getElementById('alert');

      if(alert){
        alert.style.color = "#22dc77";
      }
      

      if(res.status === 'error'){

        if(alert){
          alert.style.color = "#dc0001";
        }

        setTimeout(() =>{
          this.clearFields();
        }, 2000);
        this.setAddModalStringFieldState("message", res.data);
      }

      this.setAddModalStringFieldState('message', "CategoryAdded succesefull");

      setTimeout(() =>{
        this.clearFields();
      }, 2000);
    });
  }

  private clearFields(){
    this.setAddModalVisibleState(false);
    this.setAddModalStringFieldState('name', '');
    this.setAddModalStringFieldState('imagePath', '');
    this.setAddModalStringFieldState('message', '');
    this.setAddModalNumberFieldState('parentCategoryId', null);
  }

  private editCategory(){

    const category = {
      name: this.state.editModal.name,
      imagePath: this.state.editModal.imagePath,
      parentCategoryId: this.state.editModal.parentCategoryId
    }

    api('/api/category/' + this.state.editModal.categoryId, 'patch', category, "administrator").then((res: ApiResponse) => {
            
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
    this.getCategories();
}

    private getCategories(){
        api('/api/category/', 'get', {}, "administrator").then((res: ApiResponse) => {
            
            if(res.status === 'login' || res.status === 'error'){
              return this.setLogginState(false);
            }

            this.setCategoriesState(res.data);
        });
    }

    private showEditModal(category: CategoryDto){
      this.setEditModalNumberFieldState('categoryId', category.categoryId);
      this.setEditModalStringFieldState('name', category.name);
      this.setEditModalStringFieldState('imagePath', category.imagePath);
      this.setEditModalNumberFieldState('parentCategoryId', category.parentCategoryId);
      this.setEditModalVisibleState(true)
    }

    private removeCategory(categoryId: number){
      api('/api/category/' + categoryId, 'delete', [], 'administrator').then((res: ApiResponse) => {
        if(res.status === 'login' || res.status === 'error'){
          return this.setLogginState(false);
        }
      });
      this.getCategories();
    }

    private clearEditModal(){
      this.setEditModalNumberFieldState('categoryId', null);
      this.setEditModalStringFieldState('name', '');
      this.setEditModalStringFieldState('message', '');
      this.setEditModalStringFieldState('imagePath', '');
      this.setEditModalNumberFieldState('parentCategoryId', '');
      this.setEditModalVisibleState(false)
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
              <FontAwesomeIcon style={{height: '40px', width: "40px"}} icon={faListAlt}></FontAwesomeIcon> <strong style={{fontSize: "30px"}}>Category managment</strong>
            </Card.Header>
            <Card.Body>
              <Table hover size="lg" style={{color: "#dddddd"}}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>imagePath</th>
                    <th>Parent category</th>
                    <th colSpan={2}><Button variant="success" style={{width: "100%", height: "100%"}} onClick={() => this.setAddModalVisibleState(true)}><FontAwesomeIcon icon={faSave}/></Button></th>
                  </tr>
                </thead>
                  <tbody>
                    {this.state.categories.map(category => {
                      return(
                        <tr>
                          <td>{category.name}</td>
                          <td>{category.imagePath}</td>
                          <td className="text-center">{category.parentCategoryId}</td>
                          <td className="text-center"><Button style={{width: "100%", height: "100%"}} onClick={() => this.showEditModal(category)}>
                            <FontAwesomeIcon icon={faTools}/></Button></td>
                          <td className="text-center"><Button variant="danger" style={{width: "100%", height: "100%"}} onClick={() => this.removeCategory(category.categoryId)}>
                            <FontAwesomeIcon icon={faTrash}/></Button></td>
                        </tr>
                      );
                    }, this)}
                  </tbody>
              </Table>
              <Modal size="lg" centered show={this.state.addModal.visible} onHide={() => this.setAddModalVisibleState(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>
                   Add category
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                      <Form.Label htmlFor="name">Name</Form.Label>
                      <Form.Control id="name" type="text" value={this.state.addModal.name} onChange={(e) => this.setAddModalStringFieldState("name", e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="imagePath">Image path</Form.Label>
                      <Form.Control id="imagePath" type="text" value={this.state.addModal.imagePath} onChange={(e) => this.setAddModalStringFieldState("imagePath", e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="parentCategoryId">Parent category id</Form.Label>
                      <Form.Control id="parentCategoryId" as="select" onChange={(e) => this.setAddModalNumberFieldState("parentCategoryId", Number(e.target.value))}>
                        <option value={"0"}>null</option>
                        {this.state.categories.map(cat => {
                          return(
                            <option value={cat.categoryId?.toString()}>{cat.name}</option>
                          );
                        }, this)}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Button style={{width: '80px', height: '40px'}} variant="primary" onClick={() => this.postCategory()}><FontAwesomeIcon icon={faDatabase}></FontAwesomeIcon></Button>
                    </Form.Group>
                    <Alert id='alert' className={this.state.addModal.message ? '': 'd-none'}>{this.state.addModal.message}</Alert>
                </Modal.Body>
              </Modal>

              <Modal size="lg" centered show={this.state.editModal.visible} onHide={() => this.clearEditModal()}>
                <Modal.Header closeButton>
                  <Modal.Title>
                   Edit category
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                      <Form.Label htmlFor="name">Name</Form.Label>
                      <Form.Control id="name" type="text" value={this.state.editModal.name} onChange={(e) => this.setEditModalStringFieldState("name", e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="imagePath">Image path</Form.Label>
                      <Form.Control id="imagePath" type="text" value={this.state.editModal.imagePath} onChange={(e) => this.setEditModalStringFieldState("imagePath", e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="parentCategoryId">Parent category id</Form.Label>
                      <Form.Control id="parentCategoryId" as="select" onChange={(e) => this.setEditModalNumberFieldState("parentCategoryId", Number(e.target.value))}>
                        <option value={"0"}>null</option>
                        {this.state.categories.map(cat => {
                          return(
                            <option value={cat.categoryId?.toString()}>{cat.name}</option>
                          );
                        }, this)}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Button variant="primary" onClick={() => this.editCategory()}>Save</Button>
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