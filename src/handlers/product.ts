import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Product from "../models/Product.model";

export const obtenerProductos = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      order: [["price", "DESC"]],
      limit: 2,
      attributes: { exclude: ["createdAt", "updatedAt", "id"] },
    });
    res.json({ data: products });
  } catch (error) {
    console.log(error);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  //Validacion con express-validator desde el handler, en el proyecto esta en el router
  /*await check("name")
    .notEmpty()
    .withMessage("El nombre no puede estar vacio")
    .run(req);
  await check("price")
    .notEmpty()
    .withMessage("El precio no puede estar vacio")
    .isNumeric()
    .withMessage("El precio debe ser un numero")
    .custom((value) => value > 0)
    .withMessage("El precio debe ser un numero positivo")
    .run(req);
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }*/
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    await product.update(req.body);
    await product.save();
    res.status(200).json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    product.availability = !product.dataValues.availability;
    await product.save();
    res.status(200).json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    await product.destroy();
    res.status(200).json({ data: "Producto eliminado" });
  } catch (error) {}
};
