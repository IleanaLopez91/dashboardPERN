import { Router } from "express";
import {
  createProduct,
  getProductById,
  obtenerProductos,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { body, param } from "express-validator";
import hanleInputErrors from "./middleware";

const router = Router();

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

router.put("/:id", updateProduct);

router.patch("/:id", updateAvailability);

router.delete("/", (req, res) => {
  res.json("Desde DELETE");
});

export default router;