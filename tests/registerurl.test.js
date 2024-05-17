const { RegisterURL } = require("../beans");

test("Register url generator", async () => {
  const url = await new RegisterURL().generate("test@test.test");
  // expect(url).toMatchSnapshot();
});
