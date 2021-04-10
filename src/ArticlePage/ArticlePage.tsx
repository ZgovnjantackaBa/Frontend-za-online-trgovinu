import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import api, { ApiResponse } from "../api/api";
import { ApiConfig } from "../config/ApiConfig";
import ArticleDto from "../Dtos/ArticleDto";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";
import '../assets/css/style.css';
import { relative } from "path";
import AddToCartInput from "../AddToCartInput/AddToCartInput";

interface ArticlePageProperties{
    match: {
        params: {
            aId: number;
        }
    }
}

interface ArticlePageState {
    isLoggedIn: boolean;
    message: string;
    article: ArticleDto | undefined;
    features: MyFeatureData[];
    photos: Photo[];
    imageModal: {
        visible: boolean
    }
}

interface MyFeatureData{
    name: string;
    value: string;
}

interface Photo {
    photoId: number;
    imagePath: string;
    used: boolean;
}

export class ArticlePage extends React.Component<ArticlePageProperties>{

    state: ArticlePageState;

    constructor(props: Readonly<ArticlePageProperties>){
        super(props);

        this.state = {
            isLoggedIn: true,
            message: '',
            article: undefined,
            features: [],
            photos: [],
            imageModal: {
                visible: false
            }
        }
    }

    private setLogginState(state: boolean){
        this.setState(Object.assign(this.state, {
            isLoggedIn: state
        }));
    }

    private setMessageState(message: string){
        this.setState(Object.assign(this.state, {
            message: message
        }));
    }

    private setArticleState(article: ArticleDto | undefined){
        this.setState(Object.assign(this.state, {
            article: article
        }));
    }

    private setFeatureState(features: MyFeatureData[]){
        this.setState(Object.assign(this.state, {
            features: features
        }));
    }

    private setImageModalVisibleState(state: boolean){
        this.setState(Object.assign(this.state, Object.assign(this.state.imageModal, {
            visible: state
        })));
    }

    private setPhotosState(photos: Photo[]){
        this.setState(Object.assign(this.state, {
            photos: photos
        }))
    }

    private getArticle(){
        api('/api/article/' + this.props.match.params.aId, 'get', {},).then((res:ApiResponse) =>{

            if(res.status === 'login'){
                this.setLogginState(false);
                return;
            }

            if(res.status === 'error'){
                this.setArticleState(undefined);
                this.setFeatureState([]);
                this.setMessageState("Sorry we couldnt find this article");
                return;
            }

            this.setArticleState(res.data);
            console.log(res.data.photos);

            let neededFeatureData: MyFeatureData[] = [];

            const features = this.state.article?.features;
            const articleFeatures = this.state.article?.articleFeatures;

            if(features && articleFeatures){
                for(const feature of features){
                    
                    let data: MyFeatureData = {
                        name: '',
                        value: ''
                    }
                    for(const articleFeature of articleFeatures){
                        if(feature.featureId === articleFeature.featureId){

                            data.name = feature.name;
                            data.value = articleFeature.value;

                            neededFeatureData.push(data);
                        }
                    }
                }
            }
            this.setFeatureState(neededFeatureData);

            const photos: Photo[] = [];

            if(this.state.article?.photos){
                for(const photo of this.state.article?.photos){
                    const photoData: Photo = {photoId: photo.photoId, imagePath: photo.imagePath, used: false};
                    photos.push(photoData);
                }
                this.setPhotosState(photos);
                console.log(this.state.photos);
            }
        });
    }



    render(){
        return(
            <Container>
                <RoledMainMenu role='user'></RoledMainMenu>
                <Card bg="dark" text="white">
                    <Card.Body>
                        <Card.Title className="text-center mb-1">
                            <FontAwesomeIcon icon={faBoxOpen} />
                            <strong className="text-center">{this.state.article ? this.state.article.name : 'We have no this article in our offer!'}</strong>
                        </Card.Title>
                        <Row>
                            <Col xs="12" lg="8">
                                <div className="excerpt" mb-1>
                                    {this.state.article?.except}
                                </div>
                                <hr style={{backgroundColor: '#DDDDDD'}}/>
                                <div className="description mb-3">
                                    {this.state.article?.description}
                                </div>
                                <Table className="m-1" bordered variant="secondary">
                                    <thead>
                                        <tr>
                                            <th className="text-center" colSpan={2}>Features</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {this.state.features.map(feature => {
                                                return(
                                                    <tr>
                                                        <td>
                                                            {feature.name}
                                                        </td>
                                                        <td>
                                                            {feature.value}
                                                        </td>
                                                    </tr>
                                                );
                                            }, this)}
                                    </tbody>
                                </Table>
                                <div className="mt-3">Promoted: {this.state.article?.isPromoted === 1 ? "Yes" : "No"}</div>
                                <div className="mt-3">Status: {this.state.article?.status}</div>
                            </Col>
                            <Col xs="12" lg="4">
                                <Row>
                                    <Col xs="12" className="image-hover cursor-change">
                                        <img src={ApiConfig.PHOTO_PATH + 'small/' + this.state.article?.photos[0].imagePath }
                                         alt={'Image-' + this.state.article?.articleId} onClick={() => this.showPhoto(this.state.article?.photos[0].photoId)}
                                         style={{width: '320px', height: '240px', border: '3px solid #DDDDDD'}} className="w-100"/>
                                    </Col>
                                </Row>
                                <Row>
                                    {this.state.article?.photos.slice(1).map(photo => {
                                        return(
                                            <Col xs="12" sm="6">
                                                <img alt={"Image-" + photo.photoId} src={ApiConfig.PHOTO_PATH + 'small/' + photo.imagePath}
                                                style={{height: "100px", border: '1px solid #DDDDDD'}}  
                                                onClick={() => this.showPhoto(photo.photoId)} className="w-100 image-hover"
                                                />
                                            </Col>
                                        );
                                    }, this)}
                                </Row>
                                <br/>
                                <Row>
                                    <Col xs="12">
                                        <AddToCartInput article={this.state.article}/>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <br/> <hr/>
                        <Row>
                            <Col xs="12" className='text-center'>
                                <h3>
                                Price: {Number(this.state.article?.articlePrices[this.state.article?.articlePrices.length - 1]
                                    .price).toFixed(2) + ' EUR'}
                                </h3>
                                
                            </Col>
                        </Row>

                    </Card.Body>
                    <Modal size="lg" centered show={this.state.imageModal.visible} onHide={() => this.setImageModalVisibleState(false)}>
                        <Modal.Header className="text-center">
                               <strong>{this.state.article?.name + " photo " }</strong> 
                        </Modal.Header>
                        <Modal.Body style={{display: 'inline-block', border: '3px solid black'}}>
                        {this.state.photos.filter(photo => photo.used).map(photo => {
                                return(
                                    <img src={ApiConfig.PHOTO_PATH + 'small/' + photo.imagePath }
                                alt={'Image-' + this.state.article?.articleId}
                                style={{width: '320px', height: '240px', border: '3px solid #DDDDDD'}} className="w-100 mb-1"/>
                                );
                            }, this)}
                            <Button onClick={() => this.imageChangedPrevious()} style={{position: 'absolute', left:'0%', top: '50%'}}>{"<"}</Button>
                            <Button onClick={() => this.imageChangedNext()} style={{position: 'absolute', right: '0%', top: '50%'}}>{">"}</Button>
                        </Modal.Body>
                    </Modal>
                </Card>
            </Container>
        );
    }

    private imageChangedNext(){

        const size = this.state.photos.length;

        let i = 0;

        for(i; i < size; i++){
            if(this.state.photos[i].used){
                break;
            }
        }

        if(i === size - 1){
            i = 0;
        }else{
            i++;
        }

        this.showPhoto(this.state.photos[i].photoId);
    }

    private imageChangedPrevious(){

        const size = this.state.photos.length;

        let i = 0;

        for(i; i < size; i++){
            if(this.state.photos[i].used){
                break;
            }
        }

        if(i === 0){
            i = size - 1;
        }else{
            i--;
        }

        this.showPhoto(this.state.photos[i].photoId);
    }

    private showPhoto(photoId: number | undefined){

        const photos = this.state.photos;

        for(const photo of photos){
            if(photoId === photo.photoId){
                photo.used = true;
            }else{
                photo.used = false;
            }
        }

        this.setPhotosState(photos);
        console.log(this.state.photos);
        this.setImageModalVisibleState(true);
    }

    componentDidMount(){
        this.getArticle();
    }
    componentDidUpdate(oldProps: any) {
        if (this.props.match.params.aId === oldProps.match.params.aId) {
            return;
        }

        this.getArticle();
    }

}