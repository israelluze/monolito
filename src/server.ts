import 'ts-node/register';
import express from "express";
import clientRoutes from "./modules/client-adm/infraestructure/api/routes/client.routes";
import productRoutes from "./modules/store-catalog/infraestructure/api/routes/product.routes";
import { Sequelize } from "sequelize-typescript";
import { ProductAdmModel } from "./modules/product-adm/repository/product.model";
import ProductCatalogModel from "./modules/store-catalog/repository/product.model";
import { ClientModel } from "./modules/client-adm/repository/client.model";
import checkoutRoutes from "./modules/checkout/infraestruture/api/routes/checkout.routes";
import { Umzug, SequelizeStorage } from "umzug";
import path from "path"; // Adicione esta linha
import TransactionModel from './modules/payment/repository/transaction.model';
import InvoiceModel from './modules/invoice/repository/invoice.model';
import InvoiceItemsModel from './modules/invoice/repository/invoiceItems.model';
import invoiceRoutes from './modules/invoice/infraestructure/api/routes/invoice.routes';
import { migrator } from './migrations/config-migrations/migrator';

const app = express();
app.use(express.json());

let sequelize: Sequelize;
let migration: Umzug<any>;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
    });

    // Registre os modelos
    await sequelize.addModels([ProductCatalogModel, 
        ProductAdmModel, 
        ClientModel,
        TransactionModel,
        InvoiceModel,
        InvoiceItemsModel]);   
        
    migration = migrator(sequelize)

    // migration = new Umzug({
    //   migrations: {
    //     glob: "src/modules/migrations/*.{js,ts}",
    //   },
    //   context: sequelize,
    //   storage: new SequelizeStorage({ sequelize }),
    //   logger: console,
    // });

    // console.log("Database setup complete.");

}

(async () => {
    try {
        // Configure o banco de dados e inicialize as migrations
        await setupDb();
        console.log("Running migrations...");
        await migration.up(); // Executa as migrations
        console.log("Database synchronized successfully");
        const tables = await sequelize.getQueryInterface().showAllTables();
        console.log("Tables in the database:", tables);
        
    } catch (error) {
        console.error("Failed to synchronize the database:", error);
    }
})();

// Registrar rotas
app.use("/products", productRoutes);
app.use("/clients", clientRoutes);
app.use("/checkout", checkoutRoutes);
 app.use("/invoice", invoiceRoutes);

export default app;

export {sequelize, migration, setupDb }; // Exporta apenas o migration, já que sequelize já foi exportado
