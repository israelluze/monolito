import { Sequelize } from "sequelize-typescript";
import InvoiceItemsModel from "./invoiceItems.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItemsRepository from "./invoiceItems.repository";
import InvoiceItems from "../domain/InvoiceItems";
import InvoiceModel from "./invoice.model";

describe("InvoiceItems Repository test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemsModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create an invoice item", async () => {
    const invoiceItem = new InvoiceItems({
      id: new Id("1"),
      name: "Invoice Item 1",
      price: 100
    });

    const repository = new InvoiceItemsRepository();
    await repository.add(invoiceItem);

    const invoiceDb = await InvoiceItemsModel.findOne({ where: { id: "1" } })  
    expect(invoiceDb).toBeDefined()
    expect(invoiceDb.id).toEqual(invoiceItem.id.id)
    expect(invoiceDb.name).toEqual(invoiceItem.name)
    expect(invoiceDb.price).toEqual(invoiceItem.price)    
}); 

it("should find an invoice item", async () => {
    const invoiceItem = new InvoiceItems({
      id: new Id("1"),
      name: "Invoice Item 1",
      price: 100
    });

    const repository = new InvoiceItemsRepository();
    await repository.add(invoiceItem);

    const invoiceDb = await repository.find(invoiceItem.id.id);  
    
    expect(invoiceDb).toBeDefined()
    expect(invoiceDb.id.id).toEqual(invoiceItem.id.id)
    expect(invoiceDb.name).toEqual(invoiceItem.name)
    expect(invoiceDb.price).toEqual(invoiceItem.price)    
});

});