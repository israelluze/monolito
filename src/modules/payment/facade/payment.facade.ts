import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import PaymentFacadeInterface, { PaymentFacadeInputDto, PaymentFacadeOutputDto } from "./payment.facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {

    constructor(private processPaymentUseCase: UseCaseInterface) {}   
    
    process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
        try {            
            return this.processPaymentUseCase.execute(input);
        } catch (error) {            
            throw new Error("Error processing payment: " + error);
        }

        
    }
    
}