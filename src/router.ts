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

/**
 * @swagger
 * /api/products/{id}:
 *      get:
 *          summary: Get a product by ID
 *          tags:
 *              - Products
 *          description: Return a product based on its unique ID
 *          parameters:
 *             - in: path
 *               name: id
 *               description: The ID of the product to retrive
 *               required: true
 *               schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: "#/components/schemas/Product"
 *              400:
 *                  description: Bad Request - Invalid ID
 *
 *              404:
 *                  description: Not found
 */

router.get(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  hanleInputErrors,
  getProductById
);

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new product
 *      tags:
 *          - Products
 *      description: Return a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                            type: string
 *                            example: "Monitor curvo de 30 pulgadas"
 *                          price:
 *                            type: number
 *                            example: 300
 *      responses:
 *          201:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Product"
 *          400:
 *              description: Invalid input data
 */

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

/**
 * @swagger
 * /api/products/{id}:
 *    put:
 *      summary: Updates a product with user input
 *      tags:
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrive
 *            required: true
 *            schema:
 *               type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                            type: string
 *                            example: "Monitor curvo de 30 pulgadas"
 *                          price:
 *                            type: number
 *                            example: 300
 *                          availability:
 *                            type: boolean
 *                            example: true
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Product"
 *          400:
 *              description: Bad Request - Invalid ID or Invalid input data
 *          404:
 *              description: Product not found
 */

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

/**
 * @swagger
 * /api/products/{id}:
 *    patch:
 *       summary: Update Product availibility
 *       tags:
 *          - Products
 *       description: Returns the updated availability
 *       parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrive
 *            required: true
 *            schema:
 *               type: integer
 *       responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Product"
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product not found
 */

router.patch(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  hanleInputErrors,
  updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *    delete:
 *       summary: Delete a product by ID
 *       tags:
 *          - Products
 *       description: Returns a successfully answer
 *       parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to delete
 *            required: true
 *            schema:
 *               type: integer
 *       responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: "Producto eliminado"
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product not found
 */

router.delete(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  hanleInputErrors,
  deleteProduct
);

export default router;
