import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/Invoice";
import InvoiceItems from "../../domain/InvoiceItems";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
    id: new Id("1"),
    name: "Invoice Test",
    document: "123456789",
    address: new Address(
        "123 Main St",  
        "456",
        "Apt 789",
        "Springfield",
        "IL",
        "62704",
    ),
    items: [
        new InvoiceItems({
            id: new Id("1"),
            name: "Item 1",
            price: 100,
        }),
        new InvoiceItems({
            id: new Id("2"),
            name: "Item 2",
            price: 200,
        }),            
    ],    
    createdAt: new Date(),
    updatedAt: new Date(),
})

const MockRepository = () => {

    return {
      add: jest.fn(),
      find: jest.fn().mockReturnValue(Promise.resolve(invoice))
    }
  }

  describe("Find Invoice use case unit test", () => {

    it("should find an invoice", async () => {
            
    
        const repository = MockRepository()
        const usecase = new FindInvoiceUseCase(repository)
    
        const input = {
            id: "1"
        }
    
        const result = await usecase.execute(input)
    
        expect(repository.find).toHaveBeenCalled()
        expect(result.id).toEqual(input.id)
        expect(result.name).toEqual(invoice.name)
        expect(result.document).toEqual(invoice.document)
        expect(result.address.street).toEqual(invoice.address.street)
        expect(result.items).toEqual(invoice.items.map(item => ({
            id: item.id.id,
            name: item.name,
            price: item.price,
            }))
        )        
        expect(result.createdAt).toEqual(invoice.createdAt)
        expect(result.total).toEqual(invoice.items.reduce((acc, item) => acc + item.price, 0))      
   
    });
});

