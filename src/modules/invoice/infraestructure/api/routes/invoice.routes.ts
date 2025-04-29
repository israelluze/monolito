import { Router } from "express";
import FindInvoiceUsecase from "../../../usecase/find-invoice/find-invoice.usecase";
import InvoiceRepository from "../../../repository/invoice.repository";

// Mock do repositório (substitua pelo real)
const invoiceRepository = new InvoiceRepository;
const findInvoiceUseCase = new FindInvoiceUsecase(invoiceRepository);

const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const result = await findInvoiceUseCase.execute({ id: req.params.id });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default router;