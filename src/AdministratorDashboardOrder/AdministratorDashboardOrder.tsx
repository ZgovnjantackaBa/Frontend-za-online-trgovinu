import { faStopwatch, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Container, Tab, Table, Tabs } from "react-bootstrap";
import api, { ApiResponse } from "../api/api";
import OrderDto from "../Dtos/OrderDto";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";
import ShowCart from "../ShowCart/ShowCart";
import CartOrderType from "../Types/CartOrderType";
import '../assets/css/style.css';

interface AdministratorDashboardOrderState {
    orders: OrderDto[];
    isLoggedIn: boolean;
    message: string;
    cartForModal?: CartOrderType;
}

export default class AdministratorDashboardOrder extends React.Component {

    state: AdministratorDashboardOrderState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            orders: [],
            isLoggedIn: true,
            message: '',
        }
    }

    private setLogginState(state: boolean){
        this.setState(Object.assign(this.state, {
            isLoggedIn: state
        }));
    }

    private setOrdersState(orders: OrderDto){
        this.setState(Object.assign(this.state, {
            orders: orders
        }));
    }

    private setMessageState(message: string){
        this.setState(Object.assign(this.state, {
            message: message
        }));
    }

    private setCartForModalState(cart: CartOrderType){
        console.log("Nesto");
        this.setState(Object.assign(this.state, {
            cartForModal: cart
        }))
    }

    componentDidMount(){
        this.reloadOrders();
    }

    private reloadOrders(){
        api('/api/order/', 'get', {}, 'administrator').then((res: ApiResponse) => {
            if(res.status === "login"){
                this.setLogginState(false);
                return;
            }

            if(res.status === 'error'){
                this.setMessageState('We have an error, please try again!');
                return;   
            }

            this.setOrdersState(res.data);
        }); 
    }

    private changeStatus(id: number, status: "accepted" | "rejected" | "shipped" | 'pending'){
        api('/api/order/' + id, 'patch', {newStatus: status}, 'administrator').then((res: ApiResponse) => {
            if(res.status === 'login'){
                this.setLogginState(false);
                return;
            }

            if(res.status === 'error'){
                this.setMessageState('Doslo je do greske molimo vas pokusajte ponovo');
                return;
            }

            const alert = document.getElementById('alert');

            if(alert){
                alert.style.color = 'green';            
            }

            this.setMessageState('Success');

                setTimeout(() => {
                    this.setMessageState('');
                }, 2000);
            

            this.reloadOrders();
        });
    }

    printchangeStatusButtons(order: OrderDto) {
        if (order.status === 'pending') {
            return (
                <>
                    <Button type="button" variant="primary" size="sm" className="mr-1"
                        onClick={ () => this.changeStatus(order.orderId, 'accepted') }>Accept</Button>
                    <Button type="button" variant="danger" size="sm"
                        onClick={ () => this.changeStatus(order.orderId, 'rejected') }>Reject</Button>
                </>
            );
        }

        if (order.status === 'accepted') {
            return (
                <>
                    <Button type="button" variant="primary" size="sm" className="mr-1"
                        onClick={ () => this.changeStatus(order.orderId, 'shipped') }>Ship</Button>
                    <Button type="button" variant="secondary" size="sm"
                        onClick={ () => this.changeStatus(order.orderId, 'pending') }>Return to pending</Button>
                </>
            );
        }

        if (order.status === 'shipped') {
            return (
                <>
                    
                </>
            );
        }

        if (order.status === 'rejected') {
            return (
                <>
                    <Button type="button" variant="secondary" size="sm"
                        onClick={ () => this.changeStatus(order.orderId, 'pending') }>Return to pending</Button>
                </>
            );
        }
    }

    private renderOrders(withStatus: "accepted" | 'rejected' | 'pending' | 'shipped'){
        return(
            <Table hover style={{color: 'white'}}>
                    <thead>
                        <tr>
                            <td className="text-center">Order id</td>
                            <td>Date</td>
                            <td>Status</td>
                            <td className="text-center">Cart</td>
                            <td>Option</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.orders.filter(order => order.status === withStatus).map(order => {
                            return(
                                <tr>
                                    <td className="text-center">{order.orderId}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>{order.status}</td>
                                    <td className="text-center"><Button onClick={() => {
                                        this.setCartForModalState(order.cart)
                                    }}><FontAwesomeIcon icon={faStopwatch}/> Show cart</Button></td>
                                    <td>{this.printchangeStatusButtons(order)}</td>
                                </tr>
                            );
                        }, this)}
                    </tbody>
            </Table>
        );
    }

    render(){
        return(
            <Container>
                <RoledMainMenu role="admin"/>
                <Card bg="dark" text="primary">
                    <Card.Body>
                        <Card.Title className="text-center">
                            <FontAwesomeIcon icon={faWallet}/> Orders
                        </Card.Title>
                        <Tabs defaultActiveKey="pending"><br/>
                            <Tab eventKey="pending" title="Pending"><br/>{this.renderOrders('pending')}</Tab>
                            <Tab eventKey="accepted" title="Accepted"><br/>{this.renderOrders('accepted')}</Tab>
                            <Tab eventKey="rejected" title="Rejected"><br/>{this.renderOrders('rejected')}</Tab>
                            <Tab eventKey="shipped" title="Shipped"><br/>{this.renderOrders('shipped')}</Tab>
                        </Tabs>
                        <Alert id="alert" className={this.state.message === '' ? 'd-nove' : ''}>{this.state.message}</Alert>
                    </Card.Body>
                </Card>
                {this.state.cartForModal ? <ShowCart cart={this.state.cartForModal}/> : ''}    
            </Container>
        );
    }
}