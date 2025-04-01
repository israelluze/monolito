import e from "express";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.usecase.dto";

const MockRepository = () => {
    return {
  
      add: jest.fn(),
      find: jest.fn()
    }
  }

describe("Generate Invoice use case unit test", () => {
    it("should generate an invoice", async () => {
        const repository = MockRepository()
        const usecase = new GenerateInvoiceUseCase(repository)

        const input: GenerateInvoiceUseCaseInputDto = {
            id: "1",
            name: "Invoice Test",
            document: "123456789",
            street: "123 Main St",
            number: "456",
            complement: "Apt 789",
            city: "Springfield",
            state: "IL",
            zipCode: "62704",
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
            

        const result = await usecase.execute(input)

        expect(repository.add).toHaveBeenCalled()
        expect(result.id).toBeDefined()
        expect(result.name).toEqual(input.name)
        expect(result.document).toEqual(input.document)
        expect(result.street).toEqual(input.street)
        expect(result.number).toEqual(input.number)
        expect(result.complement).toEqual(input.complement)
        expect(result.city).toEqual(input.city) 
        expect(result.state).toEqual(input.state)
        expect(result.zipCode).toEqual(input.zipCode)   
        expect(result.items.length).toBe(2)
        expect(result.items[0].id).toEqual(input.items[0].id)
        expect(result.items[0].name).toEqual(input.items[0].name)
        expect(result.items[0].price).toEqual(input.items[0].price)
        expect(result.items[1].id).toEqual(input.items[1].id)
        expect(result.items[1].name).toEqual(input.items[1].name)
        expect(result.items[1].price).toEqual(input.items[1].price)
        expect(result.total).toEqual(input.items[0].price + input.items[1].price)
    })
    
});
    