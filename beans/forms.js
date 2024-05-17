const formidable = require("formidable"),
  path = require("path");

class ParseForm {
  constructor(req) {
    this.req = req;
  }

  async parseFiles(newFileName) {
    if (!this.req) {
      return false;
    }

    const newForm = new formidable.IncomingForm(),
      formfields = await new Promise((resolve, reject) => {
        newForm.parse(this.req).on("fileBegin", (name, file) => {
          file.path =
            path.join(__dirname, `../assets/users`) + `/${newFileName}.jpg`;

          resolve({ file: `${newFileName}.jpg` });
        });
      });

    return formfields;
  }

  async parseForm() {
    if (!this.req) {
      return false;
    }

    const newForm = new formidable.IncomingForm(),
      formfields = await new Promise((resolve, reject) => {
        newForm.parse(this.req, async (err, fields, next) => {
          if (err) {
            return;
          }

          resolve(fields);
        });
      });

    return formfields;
  }
}

module.exports = { ParseForm };
