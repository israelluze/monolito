import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Transaction from "../../domain/transaction";
import PaymentGateway from "../../gateway/paymeny.gateway";
import { ProcessPaymentInputDto, ProcessPaymentOutputDto } from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {
    constructor(
        private transactionRepository: PaymentGateway       
    ) {}

    async execute(input: ProcessPaymentInputDto): Promise<ProcessPaymentOutputDto> {
        const transaction = new Transaction({
            amount: input.amount,
            orderId: input.orderId
        });

        transaction.process();

        const persisTransaction = await this.transactionRepository.save(transaction);

        return {
            transactionId: persisTransaction.id.id,
            orderId: persisTransaction.orderId,
            status: persisTransaction.status,
            amount: persisTransaction.amount,
            createdAt: persisTransaction.createdAt,
            updatedAt: persisTransaction.updatedAt
        };

    }
}