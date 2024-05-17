const { ParseForm } = require("../../beans"),
  { GetDCM, AddDCM } = require("../../controllers");

class Dcm {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async getDcm() {
    const formData = await new ParseForm(this.req).parseForm(),
      bean = await new GetDCM(formData).getDcmData(this.req.user_id);

    return this.res.status(200).send(bean);
  }
  async addDcm() {
    const formData = await new ParseForm(this.req).parseForm(),
      { status, data } = await new AddDCM(formData).addDcmData(
        this.req.user_id
      );

    return this.res.status(status).send(data);
  }
}

module.exports = Dcm;
