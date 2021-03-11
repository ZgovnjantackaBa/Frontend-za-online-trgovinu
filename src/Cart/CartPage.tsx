import { faCartArrowDown, faMinusSquare, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Form, Modal, Nav, Table } from "react-bootstrap";
import api, { ApiResponse } from "../api/api";
import CartType from "../Types/CartType";

interface CartPageState {
    quantity: number;
    cart?: CartType;
    visible: boolean;
    message: string;
}

export default class CartPage extends React.Component{
    state: CartPageState;

    constructor(props: Readonly<{}>){

        super(props);

        this.state = {
            quantity: 1,
            visible: false,
            message: ''
        }
    }

    componentDidMount(){
        this.updateCart();
        window.addEventListener('cart.update', () => this.updateCart());
    }

    componentWillMount(){
        window.removeEventListener('cart.update', () => this.updateCart());
    }

    private setStateCart(newCart?: CartType){
        this.setState(Object.assign(this.state, {cart: newCart}));
    }

    private setStateQuantity(newQuantity: number){
        this.setState(Object.assign(this.state, {quantity: newQuantity}));
    }

    private setStateVisible(state: boolean){
        this.setState(Object.assign(this.state, {visible: state}));
    }

    private setStateMessage(message: string){
        this.setState(Object.assign(this.state, {
            message: message
        }));
    }

    private showCart(){
        this.setStateVisible(true);
    }

    private hideCart(){
        this.setStateVisible(false);
        this.setStateMessage('');
    }

    private updateCart(){
        api('/api/user/cart', 'get', {}).then((res: ApiResponse) => {
            if(res.status === 'error' || res.status === 'login'){
                this.setStateQuantity(0);
                this.setStateCart(undefined);
                return;
            }

            this.setStateCart(res.data);
            this.setStateQuantity(res.data.cartArticles.length);
        });
    }

    private updateQuantity(event: React.ChangeEvent<HTMLInputElement>){
        
        const articleId = event.target.dataset.articleId;
        const value = event.target.value;

        const data = {
            articleId: Number(articleId),
            quantity: Number(value)
        }

        this.manageCart(data);
    }

    private manageCart(data: {articleId: number; quantity: number;}){
        
        api('/api/user/cart/', 'patch', data).then((res: ApiResponse) =>{
           
            if(res.status === 'error' || res.status === 'login'){
                this.setStateQuantity(0);
                this.setStateCart(undefined);
                return;
            }

            this.setStateCart(res.data);
            this.setStateQuantity(res.data.cartArticles.length);
        });
    }

    private deleteFromCart(articleId: number){

        const data = {
            articleId: articleId,
            quantity: 0
        }

        this.manageCart(data);
    }

    private makeAnOrder(){
        api('/api/user/cart/makeAnOrder', 'post', {}).then((res:ApiResponse) => {
            if(res.status === 'error' || res.status === 'login'){
                this.setStateQuantity(0);
                this.setStateCart(undefined);
                return;
            }

            this.setStateMessage('Your order has been made.\nCongrats');

            this.setStateCart(undefined);
            this.setStateQuantity(0);
        });
    }
    
    private calculateSumm(): number{
     
        let summ: number = 0;

        if(typeof this.state.cart == undefined){
            return summ;
        }else{

            this.state.cart?.cartArticles.map(item => {
                summ += item.article.articlePrices[item.article.articlePrices.length - 1].price * item.quantity;
            });
        }
        return summ;
    }

    private showInTable(){
        return(
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
                                <td><Form.Control type="number" data-article-id={item.article.articleId} value={Number(item.quantity)}
                                 min="1" step="1" onChange={(e) => this.updateQuantity(e as any)} className="text-center"></Form.Control></td>
                                <td>{Number(item.article.articlePrices[item.article.articlePrices.length - 1].price).toFixed(2)} Eur</td>
                                <td>{Number(item.article.articlePrices[item.article.articlePrices.length - 1].price * item.quantity).toFixed(2)} Eur</td>
                                <td><FontAwesomeIcon icon={faTrashAlt} onClick={() => this.deleteFromCart(item.articleId)} style={{cursor: "pointer"}}></FontAwesomeIcon></td>
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
        );
    }

    render(){
        return(
            <>
            <Nav.Item>
                <Nav.Link active={false} onClick={() => this.showCart()}>
                    <FontAwesomeIcon icon={faCartArrowDown}></FontAwesomeIcon> ({this.state.quantity})
                </Nav.Link>
            </Nav.Item>
            <Modal size="lg" centered show={this.state.visible} onHide={() => this.hideCart()}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Your shoping cart
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        {this.showInTable()}
                        <Alert variant='success' className={this.state.message ? '': 'd-none'}>{this.state.message}</Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.makeAnOrder()} disabled={this.state.cart?.cartArticles.length === 0}>Make an order</Button>
                </Modal.Footer>
            </Modal>
            
            
            </>
        );
    }







}