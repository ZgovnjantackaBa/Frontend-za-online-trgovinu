import React from 'react';
import { Container, Card, Row, Col} from 'react-bootstrap';
import {faListAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import CategoryType from '../Types/CategoryType';
import { Redirect, Link } from 'react-router-dom';
import api, {ApiResponse} from '../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface HomePageState{
  items?: CategoryType[];
  isLoggedIn: boolean;
}

interface ApiCategoryDto{
  categoryId: number;
  name: string;
}

export default class HomePage extends React.Component{

state: HomePageState;

constructor(props: Readonly<{}>){
  super(props);

  this.state = {
    isLoggedIn: true
  }
}

componentWillMount(){
  this.getCategories();
}

private getCategories(){
  api('api/category/?filter=parentCategoryId||$isnull', 'get', {}).then((res: ApiResponse) =>{
    if (res.status === 'error' || res.status === 'login') {
      return this.setIsLoggedIn(false);
  }
    this.putCategoriesInState(res.data);
  });
}

private putCategoriesInState(data: ApiCategoryDto[]){
  const cats: CategoryType[] = data.map(cat =>{
    return {
      categoryId: cat.categoryId,
      name: cat.name,
      items: []
    };
  });

  const newState = Object.assign(this.state, {
    items: cats
  });

  this.setState(newState);
}

private setIsLoggedIn(is: boolean){
  const newState = Object.assign(this.state, {
    isLoggedIn: is
  });

  this.setState(newState);
}

private renderCategoryCard(category: CategoryType){
  return(
    <Col lg="3" md="4" sm="6" xs="12">
      <Card>
        <Card.Body>
          <Card.Title>
            {category.name}
          </Card.Title>
          <Link to={`category/${category.categoryId}`} className="btn btn-primary btn-block btn-sm"> Open category </Link>
        </Card.Body>
      </Card>
    </Col>
  );
}


render(){

  if(this.state.isLoggedIn === false){
    return(
    <Redirect to="/user/login" />
    );
  }

  return(
    <Container>
      <RoledMainMenu role='user'/>
      <Card bg="dark" text="primary">
      <Card.Header>
        <FontAwesomeIcon icon={faListAlt}></FontAwesomeIcon> Top level categories
      </Card.Header>
      <Card.Body>
        <Row>
          {this.state.items?.map(this.renderCategoryCard)}
        </Row>
      </Card.Body>
      </Card>
    </Container>
  );
}

}

/*

  const image = 'src\Category\profesori.jpg';
  const image2 = 'profesori.jpg';
  style={{ color: "#fff", background: `url(${image2})`,}}
*/