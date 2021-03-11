import CartType from "./CartType";

export default interface OrderType {
    orderId: number;
    createdAt: string;
    status: "rejected" | "accepted" | "shipped" | "pending";
    cart: CartType;
}