import React from "react";
import { Button, Card, CardImg, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddToCartInput from "../AddToCartInput/AddToCartInput";
import api, { ApiResponse } from "../api/api";
import { ApiConfig } from "../config/ApiConfig";
import ArticleType from "../Types/ArticleType";

interface SingleArticlePreviewProperties{
    article: ArticleType;
}

export default class SingleArticlePreview extends React.Component<SingleArticlePreviewProperties>{

    render(){
        return(
            <Col lg="4" md="6" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Header>
                        {/* <img alt={article.name} src={ApiConfig.PHOTO_PATH + "small/" + article.imageUrl}></img> */}
                        <CardImg width="200px" height="160px" src={ApiConfig.PHOTO_PATH + "small/" + this.props.article.imageUrl} alt={this.props.article.name} />
                    </Card.Header>
                    <Card.Body>
                        <Card.Title as="p">{this.props.article.name}</Card.Title>
                        <Card.Text>{this.props.article.excerpt}</Card.Text>
                        <Card.Text>Price: {this.props.article.price} EUR</Card.Text>
                        {/* <Card.Text>{article.description}</Card.Text> */}
                        <AddToCartInput article={this.props.article}/>
                        <Link to={`/article/${this.props.article.articleId}`} className="btn btn-primary btn-block  btn-sm">Open article page...</Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}