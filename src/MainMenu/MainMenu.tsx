import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, HashRouter} from 'react-router-dom';

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

    render(){
        return(
            <Nav variant="tabs">
                {
                    this.state.items.map(item =>{
                        return(
                                <HashRouter>
                                    <Link to={item.link} className="nav-link">{item.text}</Link>
                                </HashRouter>
                            );
                    })
                }
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
}

interface MainMenuState{
    items: MainMenuItem[];
}