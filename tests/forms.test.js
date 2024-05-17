const { ParseForm } = require("../beans");

test("Form parser", async () => {
  const form = await new ParseForm().parseForm();
  expect(form).toBe(false);
});
