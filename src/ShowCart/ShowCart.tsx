import React from "react";
import { Modal, Table } from "react-bootstrap";
import CartOrderType from "../Types/CartOrderType";

interface ShowCartProperties {
    cart: CartOrderType;
}

interface ShowCartState {
    visible: boolean;
}

export default class ShowCart extends React.Component <ShowCartProperties>{

    state: ShowCartState;

    constructor(props: Readonly<ShowCartProperties>){
        super(props);

        this.state = {
            visible: true
        }
    }

    private setCartVisibleState(state: boolean) {
        this.setState(Object.assign(this.state, {
            visible: state
        }));
    }

    private hideCart() {
        this.setCartVisibleState(false);
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

        if (this.props.cart === undefined) {
            return sum;
        } else {
            for (const item of this.props.cart?.cartArticles) {
                let price = this.getLatestPriceBeforeDate(item.article, this.props.cart.createdAt);
                sum += price.price * Number(item.quantity);
            }
        }

        return sum;
    }

    componentWillReceiveProps(newProps: any) {
            this.setCartVisibleState(true);
    }

    componentDidMount(){
        this.setCartVisibleState(true);
    }

    render(){
        return(
            <Modal size="lg" centered show={this.state.visible} onHide={() => this.hideCart()}>
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
                                {this.props.cart.cartArticles.map(item => {
                                    return(
                                        <tr>
                                            <td>{item.article.category.name}</td>
                                            <td>{item.article.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{Number(this.getLatestPriceBeforeDate(item.article, this.props.cart?.createdAt).price).toFixed(2)} Eur</td>
                                            <td>{Number(this.getLatestPriceBeforeDate(item.article, this.props.cart?.createdAt).price * item.quantity).toFixed(2)} Eur</td>
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
        );
    }
}