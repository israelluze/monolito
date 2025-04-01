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

  async find(id: string): Promise<any> {
    // Implementation for finding an invoice by ID in the database
  }  
}