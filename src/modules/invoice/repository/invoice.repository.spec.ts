import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoiceItems.model"; // Certifique-se de importar o modelo
import Invoice from "../domain/Invoice";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/InvoiceItems";
import InvoiceItems from "../domain/InvoiceItems";
import InvoiceRepository from "./invoice.repository";

describe("Invoice Repository test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    });

    // Adicione ambos os modelos
    sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address: new Address(
        "123 Main St", // street
        "456",         // number
        "Apt 789",     // complement
        "Springfield", // city
        "IL",          // state
        "62704"        // zipCode
      ),
      items: [new InvoiceItems({
        id: new Id("1"), 
        name: "Item 1",
        price: 100
      })],
    });
    const repository = new InvoiceRepository();
    await repository.add(invoice);

    const invoiceDb = await InvoiceModel.findOne({ 
      where: { id: "1" },
      include: [InvoiceItemsModel], // Inclua os itens ao buscar a fatura
    });
    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toEqual(invoice.id.id);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);
    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.number).toEqual(invoice.address.number);
    expect(invoiceDb.complement).toEqual(invoice.address.complement);
    expect(invoiceDb.city).toEqual(invoice.address.city);
    expect(invoiceDb.state).toEqual(invoice.address.state);
    expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode);
    expect(invoiceDb.items.length).toEqual(1);
    expect(invoiceDb.items[0].id).toEqual(invoice.items[0].id.id);
    expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name);
    expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price);
  });

  it("should find an invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address: new Address(
        "123 Main St", // street
        "456",         // number
        "Apt 789",     // complement
        "Springfield", // city
        "IL",          // state
        "62704"        // zipCode
      ),
      items: [new InvoiceItems({
        id: new Id("1"), 
        name: "Item 1",
        price: 100
      })],
    });
    const repository = new InvoiceRepository();
    await repository.add(invoice);

    const foundInvoice = await repository.find(invoice.id.id);
    console.log("foundInvoice", foundInvoice);
    expect(foundInvoice.id.id).toEqual(invoice.id.id);
    expect(foundInvoice.name).toEqual(invoice.name);
    expect(foundInvoice.document).toEqual(invoice.document);
    expect(foundInvoice.address.street).toEqual(invoice.address.street);
    expect(foundInvoice.address.number).toEqual(invoice.address.number);
    expect(foundInvoice.address.complement).toEqual(invoice.address.complement);
    expect(foundInvoice.address.city).toEqual(invoice.address.city);
    expect(foundInvoice.address.state).toEqual(invoice.address.state);
    expect(foundInvoice.address.zipCode).toEqual(invoice.address.zipCode);
    expect(foundInvoice.items.length).toEqual(1);
    expect(foundInvoice.items[0].id.id).toEqual(invoice.items[0].id.id);
    expect(foundInvoice.items[0].name).toEqual(invoice.items[0].name);
    expect(foundInvoice.items[0].price).toEqual(invoice.items[0].price);
  }
  );
});