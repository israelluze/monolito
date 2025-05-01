import { Router } from "express";
import ProductRepository from "../../../repository/product.repository";
import FindAllProductsUsecase from "../../../usecase/find-all-products/find-all-products.usecase";


const productRepository = new ProductRepository();
const addProductUseCase = new FindAllProductsUsecase(productRepository);

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await addProductUseCase.execute();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

export default router;