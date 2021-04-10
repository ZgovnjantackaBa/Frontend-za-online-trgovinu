import React from "react";
import { MainMenu, MainMenuItem } from "../MainMenu/MainMenu";

interface RoledMainMenuProperties {
    role: 'user' | 'admin' | 'visitor';
}

export default class RoledMainMenu extends React.Component<RoledMainMenuProperties> {

    constructor(props: Readonly<RoledMainMenuProperties>){
        super(props);

    }

    render(){
        let items: MainMenuItem[] = [];

        switch(this.props.role){
            case 'user': items = this.getUserMenuItems(); break;
            case 'admin': items = this.getAdminMenuItems(); break;
            case 'visitor': items = this.getVisitorMenuitems(); break;
        }

        let showCart: boolean = false;

        if(this.props.role === 'user'){
            showCart = true;
        }

        return <MainMenu items={items} showCart={showCart}/>
    }

    private getAdminMenuItems(): MainMenuItem[]{
        return [new MainMenuItem('/administrator/dashboard', 'Dashboard'),
        new MainMenuItem('/administrator/dashboard/logout', 'Logout'),
        new MainMenuItem('/administrator/dashboard/category', 'Category'),
        new MainMenuItem('/administrator/dashboard/article', 'Article')];
    }

    private getUserMenuItems(): MainMenuItem[]{

        return [new MainMenuItem("", "Home"),
        new MainMenuItem("contact", "Contact"),
        new MainMenuItem("aboutUs", "About us"),
        new MainMenuItem('user/orders', "My orders"),
        new MainMenuItem('user/logout', "Logout")];
    }

    private getVisitorMenuitems(): MainMenuItem[]{
        return [new MainMenuItem('user/login', "Log in"),
        new MainMenuItem('registration', 'User registration'),
        new MainMenuItem('administrator/login', 'Admin Log in')];
    }


}