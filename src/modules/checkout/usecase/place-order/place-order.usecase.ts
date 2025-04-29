import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { ClientAdmFacadeInterface } from "../../../client-adm/facade/client-adm.facade.interface";
import { InvoiceFacadeInterface } from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/payment.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/cliente.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    private _clientFacade: ClientAdmFacadeInterface;
    private _productFacade: ProductAdmFacadeInterface; // Assuming this is defined somewhere in the actual code
    private _catalogFacade: StoreCatalogFacadeInterface;
    private _repository: CheckoutGateway; // Assuming this is defined somewhere in the actual code
    private _invoiceFacade: InvoiceFacadeInterface;
    private _paymentoFacade: PaymentFacadeInterface

    constructor(clientFacade: ClientAdmFacadeInterface,
                productFacade: ProductAdmFacadeInterface,
                catalogFacade: StoreCatalogFacadeInterface,
                repository: CheckoutGateway,
                invoiceFacade: InvoiceFacadeInterface,
                paymentoFacade: PaymentFacadeInterface) {        
        this._clientFacade = clientFacade;
        this._productFacade = productFacade;
        this._catalogFacade = catalogFacade;
        this._repository = repository;
        this._invoiceFacade = invoiceFacade;
        this._paymentoFacade = paymentoFacade;
    }    

    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        const client = await this._clientFacade.find({id: input.clientId});

        if (!client) {
            throw new Error("Client not found");
        }

        await this.validateProducts(input);

        const products = await Promise.all(
            input.products.map((p) => this.getProduct(p.productId))
        );
        console.log("products", products);

        const myClient = new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,            
            address: client.address,
        })

        const order = new Order({
            client: myClient,
            products,
        });

        const payment = await this._paymentoFacade.process({
            orderId: order.id.id,
            amount: order.total,
        });

        const invoice = 
            payment.status === "approved" ?
             await this._invoiceFacade.generate({
                id: order.id.id,
                name: client.name,
                document: client.document,
                street: client.address.street,
                number: client.address.number,
                complement: client.address.complement,
                city: client.address.city,
                state: client.address.state,
                zipCode: client.address.zipCode,                
                items: order.products.map((p) => ({
                    id: p.id.id,
                    name: p.name,
                    price: p.salesPrice,
                }))            

            }) : null;

            payment.status === "approved" && order.approved();
            this._repository.addOrder(order); 


        
        
        return {
            id: order.id.id,
            invoiceId: payment.status === "approved" ? invoice.id : null,
            status: order.status,
            total: order.total,
            products: order.products.map((p) => {
                return {
                    productId: p.id.id,
                }
            }
        )}
    }
    private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
        if (input.products.length === 0) {
            throw new Error("No products selected");
        }

        for (const product of input.products) {
            const stock = await this._productFacade.checkStock({productId: product.productId});
            if (stock.stock <= 0) {
                throw new Error(`Product ${product.productId} is out of stock`);
            }
        }
    }

    private async getProduct(productId: string): Promise<Product> {
        const product = await this._catalogFacade.find({id: productId});
        if (!product) {
            throw new Error(`Product ${productId} not found`);
        }
        const productProps = {
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice
        }
        return new Product(productProps);
    }
}