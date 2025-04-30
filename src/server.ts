import 'ts-node/register';
import express from "express";
import productRoutes from "./modules/product-adm/infraestructure/api/routes/product.routes";
import clientRoutes from "./modules/client-adm/infraestructure/api/routes/client.routes";
import { Sequelize } from "sequelize-typescript";
import { ProductAdmModel } from "./modules/product-adm/repository/product.model";
import ProductCatalogModel from "./modules/store-catalog/repository/product.model";
import { ClientModel } from "./modules/client-adm/repository/client.model";
import checkoutRoutes from "./modules/checkout/infraestruture/api/routes/checkout.routes";
import { Umzug, SequelizeStorage } from "umzug";
import path from "path"; // Adicione esta linha

const app = express();
app.use(express.json());

export let sequelize: Sequelize;
let migration: Umzug<any>;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
    });

    // Registre os modelos
    await sequelize.addModels([ProductCatalogModel, ProductAdmModel, ClientModel]);

    // Configure o Umzug para gerenciar as migrations
    migration = new Umzug({
      migrations: {
        glob: [
          "*/src/modules/migrations/*.{js,ts}",
          {
            cwd: path.join(__dirname, "../../../"), // Use path.join aqui
            ignore: ["**/*.d.ts", "**/index.ts", "**/index.js"],
          },
        ],
      },
      context: sequelize,
      storage: new SequelizeStorage({ sequelize }),
      logger: console
    });

    const queryInterface = sequelize.getQueryInterface();
    console.log("QueryInterface:", queryInterface);

    console.log("Database setup complete.");
}

(async () => {
    try {
        // Configure o banco de dados e inicialize as migrations
        await setupDb();
        console.log("Running migrations...");
        await migration.up(); // Executa as migrations
        console.log("Database synchronized successfully");
    } catch (error) {
        console.error("Failed to synchronize the database:", error);
    }
})();

// Registrar rotas
app.use("/products", productRoutes);
app.use("/clients", clientRoutes);
app.use("/checkout", checkoutRoutes);
// app.use("/invoice", invoiceRoutes);

export default app;
