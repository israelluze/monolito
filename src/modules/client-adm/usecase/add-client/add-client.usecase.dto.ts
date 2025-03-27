import Address from "../../../@shared/domain/value-object/address"


export interface AddClientInputDto {
  id?: string
  name: string
  email: string
  document: string
  address: string//Address
}

export interface AddClientOutputDto {
  id: string
  name: string
  email: string
  document: string
  address: string //Address
  createdAt: Date
  updatedAt: Date
}