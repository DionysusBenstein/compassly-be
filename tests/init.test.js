const request = require("supertest");
const app = require("../app");

test("/init", async () => {
  await request(app)
    .get("/init")
    .expect("Content-Type", "text/html; charset=utf-8")
    .expect(({ text, statusCode }) => {
      expect(Number(statusCode)).toBe(200);
      expect(text).toMatch(/OK/);
    });
});
