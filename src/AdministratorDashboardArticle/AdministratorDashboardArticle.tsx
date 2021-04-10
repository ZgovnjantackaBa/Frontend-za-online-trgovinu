import { faListAlt, faSave, faFeather, faTools, faTrash, faDatabase, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import api, { apiFile, ApiResponse } from "../api/api";
import ArticleDto from "../Dtos/ArticleDto";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";
import ArticleType from "../Types/ArticleType";
import CategoryType from "../Types/CategoryType";

interface FeatureBaseType{
  featureId: number;
  name: string;
}

interface ApiCategoryDto{
  categoryId: number
  name: string;
  imagePath?: string | undefined;
  parentCategoryId: number | null;
}

interface AdministratorDashboardArticleState{
    isLoggedIn: boolean;
    articles: ArticleType[];
    categories: {
      categoryId: number;
      name: string;
      imagePath: string | undefined;
      parentCategoryId: number;
  }[];

    status: 'avalible' | 'visible' | 'hidden';

    addModal: {
      visible: boolean;
      message: string;

      name: string;
      categoryId: number;
      except: string;
      description: string;
      price: number;
      features: FeatureInputType[];
    };

    editModal: {
      visible: boolean;
      message: string;
      
      articleId?: string;
      name: string;
      categoryId: number;
      except: string;
      description: string;
      status: string;
      isPromoted: number;
      price: number;
      features: FeatureInputType[];
  };
}

interface FeatureInputType{
    use: number;
    featureId: number;
    name: string;
    value: string;
}


export class AdministratorDashboardArticle extends React.Component{

    state: AdministratorDashboardArticleState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
          isLoggedIn: true,
          articles: [],
          categories: [],
          status: 'avalible',

            addModal: {
              visible: false,
              message: '',
        
              name: '',
              categoryId: 1,
              except: '',
              description: '',
              price: 0.01,
              features: [],
            },
            editModal: {
              visible: false,
              message: '',
        
              name: '',
              categoryId: 1,
              except: '',
              description: '',
              status: 'avalible',
              isPromoted: 0,
              price: 0.01,
              features: [],
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
              [ fieldName ]: (newValue === 'null') ? null : (Number(newValue) + 0.00),
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
              [ fieldName ]: (newValue === 'null') ? null : (Number(newValue) + 0.00),
          })
      ));
  }

  setLogginState(isLogged: boolean) {
    this.setState(Object.assign(this.state, {
      isLogged: isLogged
    }))
  }

  private putArticlesInState(data?: ArticleDto[]){
    const articles: ArticleType[] | undefined = data?.map(article => {
      return {
        articleId: article?.articleId,
        name: article.name,
        categoryId: article.categoryId,
        excerpt: article.except,
        description: article.description,
        imageUrl: article.photos[0]?.imagePath,
        status: article.status,
        isPromoted: article?.isPromoted,
        price: article.articlePrices[article.articlePrices.length -1].price,
        category: article.category,
        articleFeatures: article.articleFeatures,
        features: article.features,
        articlePrices: article.articlePrices,
        photos: article.photos
      }
    }, this);

    this.setState(Object.assign(this.state, {
      articles: articles
    }))
  }

  private putCategoriesInState(data?: ApiCategoryDto[]) {
    const categories: CategoryType[] | undefined = data?.map(category => {
        return {
            categoryId: category.categoryId,
            name: category.name,
            imagePath: category?.imagePath,
            parentCategoryId: category.parentCategoryId,
        };
    });

    this.setState(Object.assign(this.state, {
        categories: categories,
    }));
}

private async addModalCategoryChanged(event: React.ChangeEvent<HTMLSelectElement>){
  this.setAddModalNumberFieldState('categoryId', event.target.value);

  const features = await this.getFeatures(this.state.addModal.categoryId);

  const stateFeatures = features.map(feature => {
    return {
      featureId: feature.featureId,
      name: feature.name, 
      value: ''
    }
  });

  this.setState(Object.assign(this.state, 
    Object.assign(this.state.addModal, {
      features: stateFeatures
    })));
}

private setAddModalFeatureUse(featureId: number, use: boolean) {
  const addFeatures: { featureId: number; use: number; }[] = [...this.state.addModal.features];

  for (const feature of addFeatures) {
      if (feature.featureId === featureId) {
          feature.use = use ? 1 : 0;
          break;
      }
  }

  this.setState(Object.assign(this.state,
      Object.assign(this.state.addModal, {
          features: addFeatures,
      }),
  ));
}

private setEditModalFeatureUse(featureId: number, use: boolean) {
  const editFeatures: { featureId: number; use: number; }[] = [...this.state.editModal.features];

  for (const feature of editFeatures) {
      if (feature.featureId === featureId) {
          feature.use = use ? 1 : 0;
          break;
      }
  }

  this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
          features: editFeatures,
      }),
  ));
}

private setEditModalFeatureValue(featureId: number, value: string) {
  const editFeatures: { featureId: number; value: string; }[] = [...this.state.editModal.features];

  for (const feature of editFeatures) {
      if (feature.featureId === featureId) {
          feature.value = value;
          break;
      }
  }

  this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
          features: editFeatures,
      }),
  ));
}

  private async showEditModal(article: ArticleType){
    
    this.setEditModalStringFieldState('name', String(article.name));
    this.setEditModalStringFieldState('status', String(article.status));
    this.setEditModalNumberFieldState('isPromoted', article.isPromoted);
    this.setEditModalNumberFieldState('categoryId', article.categoryId);
    this.setEditModalStringFieldState('except', String(article.excerpt));
    this.setEditModalStringFieldState('description', String(article.description));
    this.setEditModalNumberFieldState('articleId', article.articleId);
    this.setEditModalNumberFieldState('price', article.price);

    if(!article.categoryId){
      return; 
    }

    const allFeatures: any[] = await this.getFeatures(article.categoryId);

    if(!article.articleFeatures){
      return;
    }

    const articleFeatures = article.articleFeatures;

    for(const apiFeature of allFeatures){
      apiFeature.use = 0;
      apiFeature.value = '';

      for(const feature of articleFeatures){
        if(feature.featureId === apiFeature.featureId){
          apiFeature.use = 1;
          apiFeature.value = feature.value;
        }
      }
    }

    this.setState(Object.assign(this.state,
      Object.assign(this.state.editModal, {
          features: allFeatures,
      }),
  ));

  this.setEditModalVisibleState(true);
  }

  private async uploadPhoto(articleId: number, file: File){
    return await apiFile('/api/article/' + articleId + '/uploadPhoto', 'photo', file, 'administrator');
  }

  private getArticles(){
    api('/api/article/', 'get', {}, 'administrator').then((res: ApiResponse) => {
      if(res.status === 'login' || res.status === 'error'){
        return this.setLogginState(false);
      }
      this.putArticlesInState(res.data);
    });
  }

  private getCategories() {
    api('/api/category/', 'get', {}, 'administrator')
    .then((res: ApiResponse) => {
        if (res.status === "error" || res.status === "login") {
            this.setLogginState(false);
            return;
        }

        this.putCategoriesInState(res.data);
    });
}

  private async getFeatures(categorId: number): Promise<FeatureBaseType[]>{
    return new Promise(resolve => {
      api('/api/feature/by_category_id/' + categorId, 'get', {}, 'administrator').then((res: ApiResponse) => {
        if(res.status === 'login' || res.status === 'error'){
          this.setLogginState(false);
          return resolve([]);
        }
  
        const features: FeatureBaseType[] = res.data.map((item: FeatureBaseType) => {
          return {
            featureId: item.featureId,
            name: item.name
          }
        });
  
        return resolve(features);
    });
    });
  }

  private postArticle(){

    const filePicker: any = document.getElementById('image');

    if (filePicker?.files.length === 0) {
        this.setAddModalStringFieldState('message', 'You must select a file to upload!');
        return;
    }

    api('/api/article/createFull', 'post', {
      name: this.state.addModal.name,
      categoryId: this.state.addModal.categoryId,
      except: this.state.addModal.except,
      description: this.state.addModal.description,
      price: this.state.addModal.price,
      features: this.state.addModal.features
                .filter(feature => feature.use === 1)
                .map(feature => ({
                    featureId: feature.featureId,
                    value: feature.value
                }))
    }, 'administrator').then(async (res: ApiResponse) => {
      if (res.status === "login") {
          this.setLogginState(false);
          return;
      }

      if (res.status === "error") {
          this.setAddModalStringFieldState('message', JSON.stringify(res.data));
          return;
      }

      const articleId: number = res.data.articleId;

      const file = filePicker.files[0];
      await this.uploadPhoto(articleId, file);

      const alert = document.getElementById('alert1');

      this.setEditModalStringFieldState('message', 'Article is added successefull!');

    if(alert){
        alert.className = "text-success";
      }

    setTimeout(() =>{
      this.setEditModalStringFieldState('message', '');
    }, 2000);

      this.setAddModalVisibleState(false);
      this.getArticles();
  });
}

  private editArticle(){
    const article = {
      name: this.state.editModal.name,
      except: this.state.editModal.except,
      description: this.state.editModal.description,
      isPromoted: this.state.editModal.isPromoted,
      categoryId: this.state.editModal.categoryId,
      price: this.state.editModal.price,
      status: this.state.editModal.status,
      features: this.state.editModal.features
      .filter(feature => feature.use === 1)
      .map(feature => ({
          featureId: feature.featureId,
          value: feature.value
      }))
    }

    api('/api/article/' + this.state.editModal.articleId, 'patch', article, 'administrator').then((res: ApiResponse) => {
      
      if (res.status === "login") {
        this.setLogginState(false);
        return;
    }

    if (res.status === "error") {
        this.setAddModalStringFieldState('message', JSON.stringify(res.data));
        return;
    }

    const alert = document.getElementById('alert2');

    this.setEditModalStringFieldState('message', 'Article is edited successefull!');

    if(alert){
        alert.className = "text-success";
      }

    setTimeout(() =>{
      this.setEditModalStringFieldState('message', '');
    }, 2000);


    this.setEditModalVisibleState(false);
    this.getArticles();
  });
}


  private removeArticle(articleId: number){
    api('/api/article/' + articleId, "delete", {}, 'administrator').then((res: ApiResponse) => {

    });
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
              <FontAwesomeIcon style={{height: '40px', width: "40px"}} icon={faListAlt}></FontAwesomeIcon> 
              <strong style={{fontSize: "30px"}}> Article managment</strong>
            </Card.Header>
            <Card.Body>
              <Table hover size="lg" style={{color: "#dddddd"}}>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Promoted</th>
                    <th>Price</th>
                    <th colSpan={2}><Button variant="success" style={{width: "100%", height: "100%"}} onClick={() => this.setAddModalVisibleState(true)}><FontAwesomeIcon icon={faSave}/></Button></th>
                  </tr>
                </thead>
                <tbody>
                    {this.state.articles?.map(article => {
                      return(
                        <tr>
                          <td>{article.articleId}</td>
                          <td>{article.name}</td>
                          <td>{article.category?.name}</td>
                          <td>{article.status}</td>
                          <td>{article.isPromoted ? 'Yes' : 'No'}</td>
                          <td>{article.price} Eur</td>
                          <td><Link to={'/administrator/dashboard/photo/' + article.articleId} style={{width: '100%', height: '100%'}} className="btn btn-info"> <FontAwesomeIcon icon={faImage}/></Link></td>
                          <td className="text-center"><Button style={{width: "100%", height: "100%"}} onClick={() => this.showEditModal(article)}>
                            <FontAwesomeIcon icon={faTools}/></Button></td>
                          <td className="text-center"><Button variant="danger" style={{width: "100%", height: "100%"}} onClick={() => this.removeArticle(Number(article.articleId))}>
                            <FontAwesomeIcon icon={faTrash}/></Button></td>
                        </tr>
                      );
                    }, this)}    
                </tbody>
              </Table>
              <Modal size="lg" centered show={this.state.addModal.visible} onHide={() => this.setAddModalVisibleState(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>
                   Add Article
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                      <Form.Label htmlFor="name">Name</Form.Label>
                      <Form.Control id="name" type="text" value={this.state.addModal.name} onChange={(e) => this.setAddModalStringFieldState("name", e.target.value)}></Form.Control>
                    </Form.Group>           
                    <Form.Group>
                      <Form.Label htmlFor="image">Select the image</Form.Label>
                      <Form.File id="image"/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="category">Category</Form.Label>
                      <Form.Control id="category" as="select" onChange={(e) => this.addModalCategoryChanged(e as any)}>
                        {this.state.categories.map(cat => {
                          return(<option value={cat.categoryId}>{cat.name}</option>);
                        }, this)}          
                      </Form.Control>
                    </Form.Group>
                    <div>
                      {this.state.addModal.features.map(this.printAddModalFeatures, this)}
                    </div>
                    <Form.Group>
                      <Form.Label htmlFor="excerpt">excerpt</Form.Label>
                      <Form.Control id="excerpt" type="text" value={this.state.addModal.except} onChange={(e) => this.setAddModalStringFieldState("except", e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="description">Description</Form.Label>
                      <Form.Control as="textarea" id="description" type="text" value={this.state.addModal.description} onChange={(e) => this.setAddModalStringFieldState("description", e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="price">Price</Form.Label>
                      <Form.Control id="number" type="number" step="0.01" min="0.01" max="100000" value={this.state.addModal.price} onChange={(e) => this.setAddModalNumberFieldState("price", e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Button style={{width: '80px', height: '40px'}} variant="primary" onClick={() => this.postArticle()}><FontAwesomeIcon icon={faDatabase}></FontAwesomeIcon></Button>
                    </Form.Group>
                    <Alert id='alert1' className={this.state.addModal.message ? 'text-danger': 'd-none'}>{this.state.addModal.message}</Alert>
                </Modal.Body>
              </Modal>

              <Modal size="lg" centered show={this.state.editModal.visible} onHide={() => this.setEditModalVisibleState(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>
                   Edit article
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                      <Form.Label htmlFor="name">Name</Form.Label>
                      <Form.Control id="name" type="text" value={this.state.editModal.name} onChange={(e) => this.setEditModalStringFieldState("name", e.target.value)}></Form.Control>
                    </Form.Group>           
                    <div>
                      {this.state.editModal.features.map(this.printEditModalFeatures, this)}
                    </div>
                    <Form.Group>
                      <Form.Label htmlFor="excerpt">excerpt</Form.Label>
                      <Form.Control id="excerpt" type="text" value={this.state.editModal.except} onChange={(e) => this.setEditModalStringFieldState("except", e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="isPromoted">Promoted</Form.Label>
                      <Form.Control id="isPromoted" as="select" value={this.state.editModal.isPromoted} onChange={(e) => this.setEditModalNumberFieldState("isPromoted", Number(e.target.value))}>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="description">Description</Form.Label>
                      <Form.Control as="textarea" id="description" type="text" value={this.state.editModal.description} onChange={(e) => this.setEditModalStringFieldState("description", e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="status">Status</Form.Label>
                      <Form.Control id="status" as="select" onChange={(e) => this.setEditModalStringFieldState("status", e.target.value)}>
                        <option value={"avalible"}>avalible</option>
                        <option value={"visible"}>visible</option>
                        <option value={"hidden"}>hidden</option>        
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="price">Price</Form.Label>
                      <Form.Control id="number" type="number" step="0.01" min="0.01" max="100000" value={this.state.editModal.price} onChange={(e) => this.setEditModalNumberFieldState("price", e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Button variant="primary" onClick={() => this.editArticle()}>Save</Button>
                    </Form.Group>
                    <Alert id='alert2' className={this.state.editModal.message ? 'text-danger': 'd-none'}>{this.state.editModal.message}</Alert>
                </Modal.Body>
              </Modal>

            </Card.Body>
            </Card>
          </Container>
        );
      }

      private printAddModalFeatures(feature: FeatureInputType){
        return(
              <Form.Group>
                <Row>
                    <Col xs="4" sm="1" className="text-center">
                        <input type="checkbox" value="1" checked={ feature.use === 1 }
                               onChange={ (e) => this.setAddModalFeatureUse(feature.featureId, e.target.checked) } />
                    </Col>
                    <Col xs="8" sm="3">
                        { feature.name }
                    </Col>
                    <Col xs="12" sm="8">
                        <Form.Control type="text" value={ feature.value }
                                    onChange={ (e) => this.setAddModalFeatureValue(feature.featureId, e.target.value) } />
                    </Col>
                </Row>
            </Form.Group>
        );
      }

      private printEditModalFeatures(feature: FeatureInputType){
        return(
              <Form.Group>
                <Row>
                    <Col xs="4" sm="1" className="text-center">
                        <input type="checkbox" value="1" checked={ feature.use === 1 }
                               onChange={ (e) => this.setEditModalFeatureUse(feature.featureId, e.target.checked) } />
                    </Col>
                    <Col xs="8" sm="3">
                        { feature.name }
                    </Col>
                    <Col xs="12" sm="8">
                        <Form.Control type="text" value={ feature.value }
                                    onChange={ (e) => this.setEditModalFeatureValue(feature.featureId, e.target.value) } />
                    </Col>
                </Row>
            </Form.Group>
        );
      }

  setAddModalFeatureValue(featureId: number, value: string): void {
    const addFeatures: FeatureInputType[] = [...this.state.addModal.features];

    for(const f of addFeatures){
      if(featureId === f.featureId){
        f.value = value;
        break;
      }
    }

    this.setState(Object.assign(this.state, Object.assign(this.state.addModal, {
      features: addFeatures
    })));
  }
      componentDidMount(){
        this.getArticles();
        this.getCategories();
      }
}