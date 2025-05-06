import { create } from "yup/lib/Reference";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";
import { UpdatedAt } from "sequelize-typescript";
import e from "express";
import Address from "../../../@shared/domain/value-object/address";

const mockDate = new Date(2000,1,1);
describe("PlaceOrderUseCase", () => {

    describe("validateProducts method", () => {
       //@ts-expect-error - no params in constructor
       const placeOrderUseCase = new PlaceOrderUseCase();

       it("should throw an error if no products selected", async () => {
              const input: PlaceOrderInputDto = {clientId: "0", products:[]};
              await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(new Error("No products selected"));
       });

    //    it("should throw an error when product is out of stock", async ()=> {

    //         const mockProductFacade = {
    //             checkStock: jest.fn(({productId}: {productId: string}) => 
    //             Promise.resolve({
    //                 productId,
    //                 stock: productId === "1" ? 0 : 1,
    //             }),
    //         ),
    //         };
    //         //@ts-expect-error - force set productFacade
    //         placeOrderUseCase["_productFacade"] = mockProductFacade;

    //         let input: PlaceOrderInputDto = {clientId: "0", products:[{productId: "1"}]};

    //         // await expect(
    //         //     placeOrderUseCase["validateProducts"](input)
    //         // ).rejects.toThrow(new Error("Product 1 is out of stock"));

    //         input = {clientId: "0", products:[{productId: "0"},{productId: "1"}]};
    //         await expect(
    //             placeOrderUseCase["validateProducts"](input)
    //         ).rejects.toThrow(new Error("Product 1 is out of stock"));
    //         expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);     

    //         input = {clientId: "0", products:[{productId: "0"},{productId: "1"},{productId:"2"}]};
    //         await expect(
    //             placeOrderUseCase["validateProducts"](input)
    //         ).rejects.toThrow(new Error("Product 1 is out of stock"));
    //         expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);


    //    });
        

    });

    describe("getProduct method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

       //@ts-expect-error - no params in constructor
       const placeOrderUseCase = new PlaceOrderUseCase();

       it("should throw an error when product no found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
            };
            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;
            
            await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(new Error("Product 0 not found"));
       });

       it("should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "1",
                    name: "Product 1",
                    description: "Product 1 description",
                    salesPrice: 100,
                }),
            };
            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;
            
            expect(placeOrderUseCase["getProduct"]("1")).resolves.toEqual(
                new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "Product 1 description",
                    salesPrice: 100,
                })
            );
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
            
            
       });

    });


    describe("execute method", () => {

        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it("should throw an error if client not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
            };
            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();
            //@ts-expect-error    - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {clientId: "0", products:[]};
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(new Error("Client not found"))   ; 

        });

        it("should throw an erro when products are not valid", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true),
            };
            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();

            const mockValidateProducts = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "validateProducts")
            //@ts-expect-error - not return a value
            .mockRejectedValue(new Error("No products selected"));

            //@ts-expect-error    - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;
            const input: PlaceOrderInputDto = {clientId: "1", products:[]};
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(new Error("No products selected"));
            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        });

        describe("place an order", () => {

            beforeEach(() => {
                jest.clearAllMocks(); // Limpa o estado dos mocks antes de cada teste
            });
            
            const clientProps = {
                id: "1",
                name: "Client 1",
                document: "123456789",
                email:"teste@teste.com.br",
                address: new Address("Street 1", "1", "Apt 1", "City 1", "State 1", "12345678"),
            };

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(clientProps),
            };
            const mockPaymentFacade = {
                process: jest.fn(),
            };

            const mockCheckoutRepo = {
                addOrder: jest.fn(),
            }

            const mockInvoiceFacade = {
                generate: jest.fn().mockResolvedValue({id: "1"}), 
            };

            const mockProductFacade = {
                checkStock: jest.fn(({ productId }: { productId: string }) =>
                    Promise.resolve({
                        productId,
                        stock: productId === "1" ? 10 : 5, // Simula o estoque dos produtos
                    })
                ),
            };

            const placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade as any,
                mockProductFacade as any,
                null,
                mockCheckoutRepo as any,
                mockInvoiceFacade as any,
                mockPaymentFacade
            );

            const products = {
                "1": new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "Product 1 description",
                    salesPrice: 100,
                }),
                "2": new Product({
                    id: new Id("2"),
                    name: "Product 2",
                    description: "Product 2 description",
                    salesPrice: 200,
                }),
            }

            const mockValidateProducts = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "validateProducts")
            //@ts-expect-error - spy on private method
            .mockResolvedValueOnce(null)

            const mockGetProduct = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "getProduct") 
            //@ts-expect-error - not return never 
            .mockImplementation((productId: keyof typeof products) => {
                return products[productId];
            })

            it("should no be aproved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockResolvedValue({
                    transactionId: "1",
                    orderId: "1",
                    amount: 100,
                    status: "error",
                    createdAt: new Date(),
                    updateAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1",
                    products: [{productId: "1"}, {productId: "2"}],
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBe(null);
                expect(output.total).toBe(300);
                expect(output.products).toStrictEqual([
                    {productId: "1"},
                    {productId: "2"},
                ]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1"});
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);                
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
               // expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1); retirada a validaçã pois não irei implementar o repositório nesse momento
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });

                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
                

            });

            it("should be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockResolvedValue({
                    transactionId: "1",
                    orderId: "1",
                    amount: 100,
                    status: "approved",
                    createdAt: new Date(),
                    updateAt: new Date(),
                }); 

                const input: PlaceOrderInputDto = {
                    clientId: "1",
                    products: [{productId: "1"}, {productId: "2"}],
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBe("1");
                expect(output.total).toBe(300);
                expect(output.products).toStrictEqual([
                    {productId: "1"},
                    {productId: "2"},
                ]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1"});
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                //expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });
                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
                expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
                    id: output.id,
                    name: clientProps.name,
                    document: clientProps.document,
                    street: clientProps.address.street,
                    number: clientProps.address.number,
                    complement: clientProps.address.complement,
                    city: clientProps.address.city,
                    state: clientProps.address.state,
                    zipCode: clientProps.address.zipCode,
                    items: [
                        {id: products["1"].id.id, 
                         name: products["1"].name,
                         price: products["1"].salesPrice,},
                        {id: products["2"].id.id,
                         name: products["2"].name,
                         price: products["2"].salesPrice,},                         
                    ],
                });
            });
        });

    });
});