import request from "supertest";
import server from "../../server";

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
