import request from "supertest";
import server from "../server";

describe("/api GET", () => {
  it("should send back a json response", async () => {
    const res = await request(server).get("/api");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body.msj).toBe("bienvenido");
    expect(res.status).not.toBe(404);
    expect(res.body.msj).not.toBe("Bienvenido");
  });
});
