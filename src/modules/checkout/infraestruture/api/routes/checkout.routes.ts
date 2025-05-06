import { Router } from "express";
import PlaceOrderUseCase from "../../../usecase/place-order/place-order.usecase";
import InvoiceFacadeFactory from "../../../../invoice/factory/invoice.facade.factoty";
import StoreCatalogFacadeFactory from "../../../../store-catalog/factory/store-catalog.facade.factory";
import ClientAdmFacadeFactory from "../../../../client-adm/factory/client-adm.facade.factoty";
import ProductAdmFacadeFactory from "../../../../product-adm/factory/facade.factory";
import PaymentFacadeFactory from "../../../../payment/factory/payment.facade.factory";

const clientFacade = ClientAdmFacadeFactory.create()
const productFacade = ProductAdmFacadeFactory.create()
const catalogFacade = StoreCatalogFacadeFactory.create();
const invoiceFacade = InvoiceFacadeFactory.create();
const paymentFacade = PaymentFacadeFactory.create();



// Crie a instância do caso de uso
const placeOrderUseCase = new PlaceOrderUseCase(
  clientFacade,
  productFacade,
  catalogFacade,
  null, 
  invoiceFacade,
  paymentFacade
);

const router = Router();

router.post("/", async (req, res) => {
  try {        
    if (!req.body.clientId || !req.body.products) {
      return res.status(400).json({ error: "clientId and products are required" });
    }    
    const result = await placeOrderUseCase.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default router;