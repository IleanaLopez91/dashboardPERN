import request from "supertest";
import server from "../../server";
import { reset } from "colors";

describe("POST /api/products", () => {
  it("shous display validation errors", async () => {
    const response = await request(server).post("/api/products").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4);
    expect(response.status).not.toBe(401);
    expect(response.body.errors).not.toHaveLength(3);
  });

  it("should validate that the price is greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor-testing",
      price: 0,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.status).not.toBe(401);
    expect(response.body.errors).not.toHaveLength(3);
  });

  it("should validate that the price is number", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor-testing",
      price: "hola",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);
    expect(response.status).not.toBe(401);
    expect(response.body.errors).not.toHaveLength(4);
  });

  it("should create a new product", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Mouse - Testing",
      price: 50,
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/products", () => {
  it("GET a JSON response", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/products", () => {
  it("Should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const response = await request(server).get(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");
  });

  it("should check a valid ID in the url", async () => {
    const response = await request(server).get(`/api/products/not-valid-url`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("ID no valido");
  });

  it("get a JSON response for a single product", async () => {
    const response = await request(server).get(`/api/products/1`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

describe("PUT /api/products", () => {
  it("should check a valid ID in the url", async () => {
    const response = await request(server)
      .get(`/api/products/not-valid-url`)
      .send({
        name: "monitor-testing",
        price: 300,
        availability: true,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("ID no valido");
  });

  it("should display validation error messages when updating a product", async () => {
    const response = await request(server).put(`/api/products/1`).send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(5);
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should validate than the price is greater than 0", async () => {
    const response = await request(server).put(`/api/products/1`).send({
      name: "monitor-testing",
      price: 0,
      availability: true,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe(
      "El precio debe ser un numero positivo"
    );
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const response = await request(server)
      .get(`/api/products/${productId}`)
      .send({
        name: "monitor-testing",
        price: 300,
        availability: true,
      });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should update an existent product with valid data", async () => {
    const response = await request(server).get(`/api/products/1`).send({
      name: "monitor-testing",
      price: 300,
      availability: true,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("DELETE /api/products/:id", () => {
  it("should check a valid ID", async () => {
    const response = await request(server).delete(
      `/api/products/not-valid-url`
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("ID no valido");
  });
  it("should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const response = await request(server).delete(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Producto no encontrado");
    expect(response.status).not.toBe(200);
  });

  it("should delete a product", async () => {
    const response = await request(server).delete(`/api/products/1`);
    expect(response.status).toBe(200);
    expect(response.body.data).toBe("Producto eliminado");
    expect(response.status).not.toBe(404);
  });
});
