import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

describe("PlaceOrderUseCase", () => {
    describe("execute method", () => {

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

    });
});