import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { FindInvoiceFacadeOutputDTO, InvoiceFacadeInterface } from "./invoice.facade.interface";

export interface UseCaseProps {
    generateInvoice: UseCaseInterface;
    findInvoice: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface{
    private _generateInvoiceUseCase: UseCaseInterface;
    private _findInvoiceUseCase: UseCaseInterface;
    
    constructor(props: UseCaseProps) {
        this._generateInvoiceUseCase = props.generateInvoice;
        this._findInvoiceUseCase = props.findInvoice;
    }

    async generate(input: any): Promise<any> {
        return this._generateInvoiceUseCase.execute(input);
    }
    async find(input: any): Promise<FindInvoiceFacadeOutputDTO> {
        return this._findInvoiceUseCase.execute(input);
    }
}
