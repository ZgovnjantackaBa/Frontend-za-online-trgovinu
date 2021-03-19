import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { Link, HashRouter} from 'react-router-dom';
import CartPage from '../Cart/CartPage';

export class MainMenu extends React.Component<MainMenuPropertires>{

    state: MainMenuState;
    counter: number = 0;

    public setItems(items: MainMenuItem[]) {
        this.setState({
            items: items
        });
    };

    constructor(props: Readonly<MainMenuPropertires>){
        super(props);

        this.state = {
            items: props.items
        };

        // const intervalId = setInterval(() =>{
        //     const novaLista = [...this.state.items];
        //     novaLista.push(new MainMenuItem('/link', 'Naslov'));
        //     this.setItems(novaLista);

        //     if(this.counter > 2){
        //         clearInterval(intervalId);
        //     }
        //     this.counter++;
        // }, 2000);
    }

    private makeNavLink(item: MainMenuItem) {
        return (
            <Link to={ item.link } className="nav-link" key={ item.text }>
                { item.text }
            </Link>
        );
    }

    render(){
        return(
                <Nav variant="tabs">
                    <HashRouter>
                        {this.state.items.map(this.makeNavLink)}
                        {this.props.showCart ? <CartPage/> : ''}
                    </HashRouter>
                </Nav>
        );
    }
}

export class MainMenuItem{
    text: string;
    link: string;

    constructor(link: string, text: string){
        this.text = text;
        this.link = link;
    }
}

interface MainMenuPropertires{
    items: MainMenuItem[];
    showCart?: boolean;
}

interface MainMenuState{
    items: MainMenuItem[];
}