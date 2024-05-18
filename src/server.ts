import express from "express";
import router from "./router";
import db from "./config/db";
import colors from "colors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

//Conectar a la base de datos

export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    //console.log(colors.blue("Conexion exitosa a la BD"));
  } catch (error) {
    console.log(error);
    console.log(colors.red.bold("Hubo un error al conectar la BD"));
  }
}

connectDB();

const server = express();
server.use(express.json());

server.use("/api/products", router);

server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default server;
