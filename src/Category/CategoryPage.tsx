import React from 'react';
import {Container, Card} from 'react-bootstrap';
import {faArchway, faArchive, faListAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import CategoryType from '../Types/CategoryType';

interface CategoryPageProperties{
    match: {
        params: {
            id: number;
        }
    }
}

interface CategoryPageState{
    category?: CategoryType;
}

export default class CategoryPage extends React.Component<CategoryPageProperties>{

    state: CategoryPageState;

    constructor(props: Readonly<CategoryPageProperties>){
        super(props);

        this.state = {};
    }

    render(){
        return(
            <Container>
                <Card bg="warning" text="dark">
                    <Card.Header><FontAwesomeIcon icon={faArchway}></FontAwesomeIcon> O nama</Card.Header>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon={faListAlt}></FontAwesomeIcon>
                            {this.state.category?.name}
                        </Card.Title>
                        <Card.Text>
                            Neki text
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    componentWillMount(){
        this.getCatData();
    }

    componentWillReceiveProps(newProps: CategoryPageProperties){
        if(newProps.match.params.id === this.props.match.params.id){
            return;
        }
        this.getCatData();
    }

    private getCatData(){
        setTimeout(() =>{
            const data: CategoryType = {
                name: 'CategoryId' + this.props.match.params.id,
                categoryId: this.props.match.params.id,
                items: []
            };
            this.setState({
                category: data
            });
        }, 750)
    }

}