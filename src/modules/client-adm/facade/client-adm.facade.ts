import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { ClientAdmFacadeInterface, FindClientFacadeInputDto, FindClientFacadeOutputDto } from "./client-adm.facade.interface";

export interface UseCaseProps {
    findUsecase: UseCaseInterface;
    addUseCase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
    private _findUseCase: UseCaseInterface;
    private _addClientUseCase: UseCaseInterface;
    
    constructor(props: UseCaseProps) {
        this._findUseCase = props.findUsecase;
        this._addClientUseCase = props.addUseCase;
    }

    async add(input: any): Promise<void> {
        await this._addClientUseCase.execute(input);
    }
    async find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
       return await this._findUseCase.execute(input);
    }
}