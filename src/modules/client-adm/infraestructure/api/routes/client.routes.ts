import { Router } from "express";
import AddClientUseCase from "../../../usecase/add-client/add-client.usecase";
import ClientRepository from "../../../repository/client.repository";

// Mock do repositório (substitua pelo real)
const clientRepository = new ClientRepository;
const addClientUseCase = new AddClientUseCase(clientRepository);

const router = Router();

router.post("/", async (req, res) => {
  try {
    const result = await addClientUseCase.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default router;