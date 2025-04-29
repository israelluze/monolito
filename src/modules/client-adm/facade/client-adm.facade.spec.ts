import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factoty";
import Address from "../../@shared/domain/value-object/address";

describe("ClientAdmFacade Test", () => {
let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {

    const facade = ClientAdmFacadeFactory.create();

    const input = {
        id: "1",
        name: "John Doe",
        email:"teste@teste.com.br",
        document: "123456789",
        address: new Address("Rua teste", "1", "Apto 1", "São Paulo", "SP", "12345678")
    };

    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: "1" } });

    expect(client).toBeDefined();
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.street).toBe(input.address.street);
  });

  it("should find a client", async () => {

    const facade = ClientAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "John Doe",
      email:"teste@teste.com.br",
      document: "123456789",
      address: new Address("Rua teste", "1", "Apto 1", "São Paulo", "SP", "12345678")
    };

    await facade.add(input);

    const client = await facade.find({id:"1"});

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.address.street).toBe(input.address.street);


  });

});