import CartOrderType from "../Types/CartOrderType";

export default interface OrderDto {
    orderId: number;
    createdAt: string;
    cartId: number;
    status: "rejected" | 'accepted' | "shipped" | "pending";
    cart: CartOrderType;
    
}