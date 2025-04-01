import Invoice from "../domain/Invoice";

export default interface InvoiceGateway {
  add(invoiceItem: Invoice): Promise<void>;
  find(id: string): Promise<Invoice>;
}