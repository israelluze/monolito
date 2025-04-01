import InvoiceItems from "../domain/InvoiceItems";

export default interface InvoiceItemsGateway {
  add(invoiceItem: InvoiceItems): Promise<void>;
  find(id: string): Promise<InvoiceItems>;
}