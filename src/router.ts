import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  obtenerProductos,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { body, param } from "express-validator";
import hanleInputErrors from "./middleware";

const router = Router();

/**
 * @swagger
 * components:
 *    schemas:
 *      Product:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: The Product ID
 *            example: 1
 *          name:
 *            type: string
 *            description: The Product name
 *            example: Monitor curvo de 49 pulgadas
 *          price:
 *            type: number
 *            description: The Product price
 *            example: 300
 *          availability:
 *            type: boolean
 *            description: The Product availability
 *            example: true
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of product
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                            type: array
 *                            items:
 *                              $ref: "#/components/schemas/Product"
 *
 */

//Routing
router.get("/", obtenerProductos);

router.get(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  hanleInputErrors,
  getProductById
);

router.post(
  "/",
  body("name").notEmpty().withMessage("El nombre no puede estar vacio"),
  body("price")
    .notEmpty()
    .withMessage("El precio no puede estar vacio")
    .isNumeric()
    .withMessage("El precio debe ser un numero")
    .custom((value) => value > 0)
    .withMessage("El precio debe ser un numero positivo"),
  hanleInputErrors,
  createProduct
);

router.put(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  body("name").notEmpty().withMessage("El nombre no puede estar vacio"),
  body("price")
    .notEmpty()
    .withMessage("El precio no puede estar vacio")
    .isNumeric()
    .withMessage("El precio debe ser un numero")
    .custom((value) => value > 0)
    .withMessage("El precio debe ser un numero positivo"),
  body("availability")
    .isBoolean()
    .withMessage("Valor para disponibilidad no valido"),
  hanleInputErrors,
  updateProduct
);

router.patch(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  hanleInputErrors,
  updateAvailability
);

router.delete(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  hanleInputErrors,
  deleteProduct
);

export default router;
