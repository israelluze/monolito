import request from "supertest";
import app from "../../server";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import ProductCatalogModel from "../store-catalog/repository/product.model";
import { ProductAdmModel } from "../product-adm/repository/product.model";
import { ClientModel } from "../client-adm/repository/client.model";
import TransactionModel from "../payment/repository/transaction.model";
import InvoiceModel from "../invoice/repository/invoice.model";
import InvoiceItemsModel from "../invoice/repository/invoiceItems.model";
import { migrator } from "../../migrations/config-migrations/migrator";

let sequelize: Sequelize
let migration: Umzug<any>;

beforeEach(async () => {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ":memory:",
    logging: false
  })
  
  sequelize.addModels([ProductCatalogModel, 
          ProductAdmModel, 
          ClientModel,
          TransactionModel,
          InvoiceModel,
          InvoiceItemsModel]);   
  migration = migrator(sequelize)
  await migration.up()
})

afterEach(async () => {
  if (!migration || !sequelize) {
    return 
  }
  migration = migrator(sequelize)
  await migration.down()
  await sequelize.close()
})

describe("E2E Tests", () => {
  // Teste para o endpoint de produtos
  describe("Product Routes", () => {
    it("should add a product", async () => {
      const response = await request(app)
        .post("/products")
        .send({
          id: "1",
          name: "Product 1",
          description: "A sample product",
          salesPrice: 100,
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });
  });

  // Teste para o endpoint de clientes
  describe("Client Routes", () => {
    it("should add a client", async () => {
      const response = await request(app)
        .post("/clients")
        .send({
          "id": "1",
          "name": "John Doe",
          "email": "johndoe@example.com",
          "document": "12345678901",
          "address": {
            "street": "123 Main St",
            "number": "456",
            "complement": "Apt 789",
            "city": "New York",
            "state": "NY",
            "zipCode": "10001"
          }
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });
  });

  // Teste para o endpoint de checkout
  describe("Checkout Routes", () => {
    it("should place an order", async () => {
      const clientResponse = await request(app)
        .post("/clients")
        .send({
          "id": "1",
          "name": "John Doe",
          "email": "johndoe@example.com",
          "document": "12345678901",
          "address": {
            "street": "123 Main St",
            "number": "456",
            "complement": "Apt 789",
            "city": "New York",
            "state": "NY",
            "zipCode": "10001"
          }
        });        

        const productResponse = await request(app)
        .post("/products")
        .send({
          id: "1",
          name: "Product 1",
          description: "A sample product",
          salesPrice: 100,
        });

        const productResponse2 = await request(app)
        .post("/products")
        .send({
          id: "2",
          name: "Product 2",
          description: "A sample product",
          salesPrice: 200,
        });

      const response = await request(app)
        .post("/checkout")
        .send({
          "clientId": clientResponse.body.id,
          "products": [
            { "productId": productResponse.body.id },
            { "productId": productResponse2.body.id },
          ],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("invoiceId");
    });
  });

  
  describe("Invoice Routes", () => {
    it("should retrieve an invoice", async () => {

      const clientResponse = await request(app)
        .post("/clients")
        .send({
          "id": "2",
          "name": "John Doe",
          "email": "johndoe@example.com",
          "document": "12345678901",
          "address": {
            "street": "123 Main St",
            "number": "456",
            "complement": "Apt 789",
            "city": "New York",
            "state": "NY",
            "zipCode": "10001"
          }
        });        

        const productResponse = await request(app)
        .post("/products")
        .send({
          id: "3",
          name: "Product 1",
          description: "A sample product",
          salesPrice: 100,
        });

      const productResponse2 = await request(app)
        .post("/products")
        .send({
          id: "4",
          name: "Product 2",
          description: "A sample product",
          salesPrice: 200,
        });

      const checkoutResponse = await request(app)
        .post("/checkout")
        .send({
          "clientId": clientResponse.body.id,
          "products": [
            { "productId": productResponse.body.id },
            { "productId": productResponse2.body.id },
          ],
        });        

      const invoiceResponse = await request(app).get(
        `/invoice/${checkoutResponse.body.invoiceId}`
      );

      expect(invoiceResponse.status).toBe(200);
      expect(invoiceResponse.body).toHaveProperty("id");
    });
  });
});