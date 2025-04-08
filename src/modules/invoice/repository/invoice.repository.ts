import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/Invoice";
import InvoiceItems from "../domain/InvoiceItems";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoiceItems.model";

export default class InvoiceRepository implements InvoiceGateway
{
  async add(entity: any): Promise<void> {
    await InvoiceModel.create({
      id: entity.id.id,
        name: entity.name,
        document: entity.document,
        street: entity.address.street,
        number: entity.address.number,
        complement: entity.address.complement,
        city: entity.address.city,
        state: entity.address.state,
        zipcode: entity.address.zipCode,
        items: entity.items.map((item: any) => ({
            id: item.id.id,
            name: item.name,
            price: item.price,
            })),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
  },
  {
    include: [InvoiceItemsModel], // Inclua os itens ao salvar a fatura
  })
}

async find(id: string): Promise<Invoice> {
  const result = await InvoiceModel.findOne({
    where: { id },
    include: [InvoiceItemsModel], // Include related models
  });

  if (!result) {
    throw new Error("Invoice not found");
  }

  return new Invoice({
    id: new Id(result.id),
    name: result.name,
    document: result.document,
    address: new Address(
      result.street,
      result.number,
      result.complement,
      result.city,
      result.state,
      result.zipcode  
    ),
    items: result.items.map((item: any) => new InvoiceItems({
      id: new Id(item.id),
      name: item.name,
      price: item.price,
    })),
  }); // Convert Sequelize instance to plain object
}
}