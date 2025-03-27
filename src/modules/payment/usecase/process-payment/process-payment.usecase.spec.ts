import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

const transaction = new Transaction({
    id: new Id("1"),
    amount: 100,
    orderId: "1",
    status: "aproved",
})

const MockRepository = () => ({
    save: jest.fn().mockReturnValue(Promise.resolve(transaction))
})

const transaction2 = new Transaction({
    id: new Id("1"),
    amount: 50,
    orderId: "1",
    status: "declined",
})

const MockRepositoryDeclined = () => ({
    save: jest.fn().mockReturnValue(Promise.resolve(transaction2))
})

describe("Process Payment Use Case", () => {

    it("Should approve a transaction", async () => {
        const repository = MockRepository();
        const useCase = new ProcessPaymentUseCase(repository);
        const input = {
            orderId: "1",
            amount: 100
        }
        const result = await useCase.execute(input);
    
        expect(result.transactionId).toBe(transaction.id.id);
        expect(repository.save).toHaveBeenCalled();
        expect(result.status).toBe("aproved");
        expect(result.amount).toBe(100);
        expect(result.orderId).toBe("1");
        expect(result.createdAt).toBe(transaction.createdAt);
        expect(result.updatedAt).toBe(transaction.updatedAt);
    })


    it("Should decline a transaction", async () => {
        const repository = MockRepositoryDeclined();
        const useCase = new ProcessPaymentUseCase(repository);
        const input = {
            orderId: "1",
            amount: 50
        }
        const result = await useCase.execute(input);
    
        expect(result.transactionId).toBe(transaction2.id.id);
        expect(repository.save).toHaveBeenCalled();
        expect(result.status).toBe("declined");
        expect(result.amount).toBe(50);
        expect(result.orderId).toBe("1");
        expect(result.createdAt).toBe(transaction2.createdAt);
        expect(result.updatedAt).toBe(transaction2.updatedAt);
    });

});