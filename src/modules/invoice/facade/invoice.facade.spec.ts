import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factoty";
import InvoiceItemsModel from "../repository/invoiceItems.model";
import { GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";

describe("InvoiceFacade Test", () => {
let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();
    const input: GenerateInvoiceFacadeInputDto = {
      id: "1",
      name: "John Doe",
      document: "123456789",
      street: "123 Main St",
      number: "456",
      complement: "Apt 789",
      city: "Sample City",
      state: "Sample State",
      zipCode: "12345",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    const output = await invoiceFacade.generate(input);

    expect(output.id).toBe(input.id);
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
    expect(output.items.length).toBe(input.items.length);
    expect(output.items[0].id).toBe(input.items[0].id);
    expect(output.items[0].name).toBe(input.items[0].name);
    expect(output.items[0].price).toBe(input.items[0].price);
    expect(output.items[1].id).toBe(input.items[1].id);
    expect(output.items[1].name).toBe(input.items[1].name);
    expect(output.items[1].price).toBe(input.items[1].price);
    
    
  });

  it("should find an invoice", async () => {

    const invoiceFacade = InvoiceFacadeFactory.create();
    const input: GenerateInvoiceFacadeInputDto = {
      id: "1",
      name: "John Doe",
      document: "123456789",
      street: "123 Main St",
      number: "456",
      complement: "Apt 789",
      city: "Sample City",
      state: "Sample State",
      zipCode: "12345",
      items: [
        { id: "1", name: "Item 1", price: 100 },
        { id: "2", name: "Item 2", price: 200 },
      ],
    };
    const result = await invoiceFacade.generate(input);
    
    const findInput = { id: "1" };
    const output = await invoiceFacade.find(findInput);    

    //expect(output.id).toBe(input.id);
    



  });

  
});