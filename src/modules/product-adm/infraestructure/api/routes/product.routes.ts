import { Router } from "express";
import AddProductUseCase from "../../../usecase/add-product/add-product.usecase";
import ProductRepository from "../../../repository/product.repository";


const productRepository = new ProductRepository();
const addProductUseCase = new AddProductUseCase(productRepository);

const router = Router();

router.post("/", async (req, res) => {
  try {
    const result = await addProductUseCase.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default router;