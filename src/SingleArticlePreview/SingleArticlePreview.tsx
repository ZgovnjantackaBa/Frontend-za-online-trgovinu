import React from "react";
import { Button, Card, CardImg, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import api, { ApiResponse } from "../api/api";
import { ApiConfig } from "../config/ApiConfig";
import ArticleType from "../Types/ArticleType";

interface SingleArticlePreviewProperties{
    article: ArticleType;
}

interface SingleArticlePreviewState{
    quantity: number;
}

export default class SingleArticlePreview extends React.Component<SingleArticlePreviewProperties>{

    state: SingleArticlePreviewState;

    constructor(props: Readonly<SingleArticlePreviewProperties>){
        super(props);

        this.state = {
            quantity: 1
        }
    }

    private quantityChanged(event: React.ChangeEvent<HTMLInputElement>){
        this.setState(Object.assign(this.state, {
            quantity: Number(event.target.value)
        }));
    }

    private addToCart(){
        const data = {
            articleId: this.props.article.articleId,
            quantity: Number(this.state.quantity)
        }

        api('/api/user/cart/addToCart', 'post', data).then((res: ApiResponse) => {
            if(res.status === 'error' || res.status === 'login'){
                return;
            }

            window.dispatchEvent(new CustomEvent('cart.update'));
        });
    }

    render(){
        return(
            <Col lg="4" md="6" sm="6" xs="12">
                <Card className="mb-3">
                    <Card.Header>
                        {/* <img alt={article.name} src={ApiConfig.PHOTO_PATH + "small/" + article.imageUrl}></img> */}
                        <CardImg width="100%" src={ApiConfig.PHOTO_PATH + "small/" + this.props.article.imageUrl} alt={this.props.article.name} />
                    </Card.Header>
                    <Card.Body>
                        <Card.Title as="p">{this.props.article.name}</Card.Title>
                        <Card.Text>{this.props.article.excerpt}</Card.Text>
                        <Card.Text>Price: {this.props.article.price} EUR</Card.Text>
                        {/* <Card.Text>{article.description}</Card.Text> */}
                        <Form.Group>
                            <Row>
                                <Col xs="7">
                                    <Form.Control type="number" min="1" step="1" value={Number(this.state.quantity)} onChange={(e) => this.quantityChanged(e as any)}>
                                    </Form.Control>
                                </Col>
                                <Col xs="5">
                                    <Button variant="secondary" block onClick={() => this.addToCart()}>Buy</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Link to={`/article/${this.props.article.articleId}`} className="btn btn-primary btn-block  btn-sm">Open article page...</Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}