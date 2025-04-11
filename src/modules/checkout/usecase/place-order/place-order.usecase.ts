import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { ClientAdmFacadeInterface } from "../../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    private _clientFacade: ClientAdmFacadeInterface;
    private _productFacade: ProductAdmFacadeInterface; // Assuming this is defined somewhere in the actual code

    constructor(clientFacade: ClientAdmFacadeInterface,
                productFacade: ProductAdmFacadeInterface) {
        this._clientFacade = clientFacade;
        this._productFacade = productFacade;
    }    

    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        const client = await this._clientFacade.find({id: input.clientId});
        if (!client) {
            throw new Error("Client not found");
        }

        await this.validateProducts(input);
        
        return {
            id: "1",
            invoiceId: "1",
            status: "approved",
            total: 100,
            products: [
                {
                    productId: "1",
                },
            ],
        }
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
}