import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/InvoiceItems";
import InvoiceItemsGateway from "../gateway/invoiceItems.gateway";
import InvoiceItemsModel from "./invoiceItems.model";

export default class InvoiceItemsRepository implements InvoiceItemsGateway {
  async add(entity: InvoiceItems): Promise<void> {
    
    await InvoiceItemsModel.create({
      id: entity.id.id,
      name: entity.name,
      price: entity.price,})
  }

  async find(id: string): Promise<InvoiceItems> {    
    const invoiceItem = await InvoiceItemsModel.findOne({ where: { id } });
    if (!invoiceItem) {
      throw new Error("Invoice item not found");
    }
    return new InvoiceItems({
      id: new Id(invoiceItem.id),
      name: invoiceItem.name,
      price: invoiceItem.price,
    });    
  }
}
//   async findAll(): Promise<any[]> {