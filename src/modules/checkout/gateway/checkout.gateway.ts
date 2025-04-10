import Order from "../domain/order.entity";

export default interface CheckoutGateway {
    addOrder(order: Order): Promise<any>;
    findOrder(id: string): Promise<Order | null>;

}