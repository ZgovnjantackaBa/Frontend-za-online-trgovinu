import { faBox, faBoxOpen, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, Container, Modal, Table } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import api, { ApiResponse } from "../api/api";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";
import CartType from "../Types/CartType";
import OrderType from "../Types/OrderType";

interface OrderDto {
    orderId: number;
    createdAt: string;
    status: "rejected" | "accepted" | "shipped" | "pending";
    cart: {
        cartId: number;
        createdAt: string;
        cartArticles: {
            quantity: number;
            article: {
                articleId: number;
                name: string;
                excerpt: string;
                status: "available" | "visible" | "hidden";
                isPromoted: number;
                category: {
                    categoryId: number;
                    name: string;
                },
                articlePrices: {
                    createdAt: string;
                    price: number;
                }[];
                photos: {
                    imagePath: string;
                }[];
            };
        }[];
    };
}

interface OrderPageState {
    isLoggedIn: boolean;
    orders: OrderType[];
    cartVisible: boolean;
    cart?: CartType;
}

export class OrderPage extends React.Component{

    state: OrderPageState;

    constructor(props: Readonly<{}>){

        super(props);

        this.state = {
            isLoggedIn: true,
            orders: [],
            cartVisible: false,
        }
    }

    private setLogginState(isLogged: boolean){
        this.setState(Object.assign(this.state, {
            isLoggedIn: isLogged
        }));
    }

    private setOrdersState(orders: OrderType[]){
        this.setState(Object.assign(this.state, {
            orders: orders
        }))
    }

    private getOrders() {
        api('/api/user/cart/orders/', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                return this.setLogginState(false);
            }

            const data: OrderDto[] = res.data;

            const orders: OrderType[] = data.map(order => ({
                orderId: order.orderId,
                status: order.status,
                createdAt: order.createdAt,
                cart: {
                    cartId: order.cart.cartId,
                    user: null,
                    userId: 0,
                    createdAt: order.cart.createdAt,
                    cartArticles: order.cart.cartArticles.map(ca => ({
                        cartArticleId: 0,
                        articleId: ca.article.articleId,
                        quantity: ca.quantity,
                        article: {
                            articleId: ca.article.articleId,
                            name: ca.article.name,
                            category: {
                                categoryId: ca.article.category.categoryId,
                                name: ca.article.category.name,
                            },
                            articlePrices: ca.article.articlePrices.map(ap => ({
                                articlePriceId: 0,
                                price: ap.price,
                            }))
                        }
                    }))
                }
            }));

            this.setOrdersState(orders);
        });
    }

    componentDidMount() {
        this.getOrders();
    }

    //Implementirati da uzimam cjenu sa metodom getLatestPriceBeforeDate... i neke sitnice oko cijene
    render(){

        if (this.state.isLoggedIn === false) {
            return (
                <Redirect to="/user/login" />
            );
        }

        return(
            <Container>
                <RoledMainMenu role='user'/>
                <Card bg="white" text="primary">
                    <Card.Title><FontAwesomeIcon icon={faBox}></FontAwesomeIcon></Card.Title>
                    <Card.Body>
                <Table hover size="sm">
                    <thead>
                        <tr>
                            <th>CreatedAt</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.orders.map(this.printOrderRow, this)}
                    
                    </tbody>
                </Table>
                </Card.Body>
                </Card>
                <Modal size="lg" centered show={this.state.cartVisible} onHide={() => this.hideCart()}>
        <Modal.Header closeButton>
            <Modal.Title>
                Your order
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Table hover size="sm">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Article</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.cart?.cartArticles.map(item => {
                            return(
                                <tr>
                                    <td>{item.article.category.name}</td>
                                    <td>{item.article.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{Number(this.getLatestPriceBeforeDate(item.article, this.state.cart?.createdAt).price).toFixed(2)} Eur</td>
                                    <td>{Number(this.getLatestPriceBeforeDate(item.article, this.state.cart?.createdAt).price * item.quantity).toFixed(2)} Eur</td>
                                </tr>
                            );
                        }, this)}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>Total</td>
                            <td className="text-right">{Number(this.calculateSumm()).toFixed(2)} Eur</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tfoot>
                    
                </Table>
        </Modal.Body>
    </Modal>
            </Container>


        );
    }

    private printOrderRow(order: OrderType){
        return(
            <tr key={ order.orderId }>
                 <td>{ order.createdAt }</td>
                <td>{ order.status }</td>
                <td className="text-right">
                    <Button size="sm" variant="primary"
                       onClick={ () => this.setAndShowCart(order.cart) }>
                     <FontAwesomeIcon icon={ faBoxOpen } />
                    </Button>
                  </td>
            </tr>
        );
    }

    private getLatestPriceBeforeDate(article: any, latestDate: any) {
        const cartTimestamp = new Date(latestDate).getTime();

        let price = article.articlePrices[0];

        for (let ap of article.articlePrices) {
            const articlePriceTimestamp = new Date(ap.createdAt).getTime();

            if (articlePriceTimestamp < cartTimestamp) {
                price = ap;
            } else {
                break;
            }
        }

        return price;
    }

    private calculateSumm(): number {
        let sum: number = 0;

        if (this.state.cart === undefined) {
            return sum;
        } else {
            for (const item of this.state.cart?.cartArticles) {
                let price = this.getLatestPriceBeforeDate(item.article, this.state.cart.createdAt);
                sum += price.price * Number(item.quantity);
            }
        }

        return sum;
    }

    private setStateCart(cart: CartType){
        this.setState(Object.assign(this.state, {
            cart: cart
        }));
    }

    private setAndShowCart(cart: CartType){
        this.setStateCart(cart);
        this.showCart();
    }

    private setCartVisibleState(isItTrue: boolean){
        this.setState(Object.assign(this.state, {
            cartVisible: isItTrue
        }));
    }

    private hideCart() {
        this.setCartVisibleState(false);
    }

    private showCart() {
        this.setCartVisibleState(true);
    }


}