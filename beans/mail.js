const { MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER, MAIL_PASSWORD } =
    process.env,
  nodemailer = require("nodemailer");

// const smtpConfig = {
//   host: "compassly.me",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "support@compassly.me",
//     pass: "9yJmB2S@.kcl",
//   },
// };

const smtpConfig = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  // secure: true,
  secureConnection: true,
  auth: {
    type: "OAuth2",
    user: "rruud@compassly.me",
    serviceClient: "100121188662169260483",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDONp8E5x3Xe/c+\nE8ifRzdSjyvgymsLtxBx/T1A7CucBd31vPh/E7J+N0fuURhNguSzS6uclOc19NTS\nDuOyVgf8e3iCKA2NtK1yYNEv68Mc0wjDDEJ0xlE4UkEBrJ1rZ4rTIwWMRJqdZhWs\nDJzErXTEsUVqa6xV6zPnkIK+NjlXWDP+NZKdCgXijhR15PihvXe5usB7Uhjp14N2\n7r75SiKHH548ThJ2GPXP0bCIpxAF7AU8GZMItFrVdfx3+hO3QnXUZM91HypZagpF\nnvRCtqiBUlDLLsJa0an4OAgM4ddeCJxcod+cMOTnH+G19XDh7zdalVSwe9vl838b\nvQzM36URAgMBAAECggEAA7B1etx5q7PDkiA/fB4FjtwR4GUushh12lw5/tHa2+E8\n/dsCJR/glyJ9DnXz9dsMJWsKqHP/iPcW4aUzjKq+XNWGq+l0iJ79ZWj3BSD2LitW\nYkrzW2x64oOSNynz7Qp+sNVVEZPeokdDxv64xUoHJ0e2ordHb4gUNyXeOPH2Z6ob\nl13Up2zGCX0CuCbR3bwW8WyKvZh/zIzOZhD/rt6SgJfeqZeWKsTbOWRaGopmgCJL\n/aPAfeyL4qol3YaVYp3Nj/gYbjdjGQfkV3h6SqrV7h6nHanQJupym6lIaIVqEBGq\nZTmwRN243h02maxD0eThNBTPkmvAxHUVWOBbC5W4AQKBgQDl/NBS2kn0f/NQn13A\nYASBDTW4dvx+wjjIrzJJFSxM9Y1amCnMbKPavzR7WfsnQ09YKn5aoWKfSFG+CulF\nnB0sUYT/wrV34OqP+DCjz2zO4AeoyFCnuiaJ7pPsnZBzUtnFLrK0dp0wBnBwbkZo\n1Er/Mf7P2IILeq8mI3XcSMJWEQKBgQDliW+5iXPga6e18CybJsR/IakhUF9XVTq+\nFUSl9De8NJZ3SUJY9GIAs3oOc3JeU726Et0FKkkmYZN63hDvCAAFjI5IzkpoCSX8\nyewg0jy6htrQ/VDFbR6Cz7JIrGG/a9s5rFU+BV/M7jRc4+7lhXcAma7wbuKFJ/FQ\nIs87Al1fAQKBgFViXclUx34hfqjg8cJ5I1LyH46jhixdWQ2QlZ+yX6cWxurqcSI2\n90JAGHDvQCIciDmYVR66qc2u4MIodOBmDCKnBTSbCho+g3b90rkOSjwnylAsRl1u\n693rmDmRac6W5MijBK+hFcx9p4LmPfevUUSbQBnULLusSZhkM96bmKKxAoGAV5k6\n1TD60xPivlF5hICoDuiWtksJB7hUIcTWHQt11dKv9bg0pOQnHqNgGnG+nPcSehfG\n17jKj+Y/NW3YQpDoCTYZ+vkXdlq/b5jUD7aMTJc4nPd/wsihE0UWghufdkFAOeNl\n6LR+WiQyQZ0PR/LGdqkwFTwMIMsckfum4JtHbQECgYEAjhD6rWv1IAuocCSt5xpC\ntt3D4VGLPCQ9cB1z9O2u9os1IYwpMzNmq1u2gweppD3tC3HJfMv/Pk2xHPv74N8Q\n1lnPrLhHfkKTHSZChSZkiQi/fKcelY/vtSxFwNUM2n6dh0QS4xTyaQ5Y2sIxpu7V\n/4j87YIoS5Ua7kETFErF0nc=\n-----END PRIVATE KEY-----\n",
  },
};

// (async () => {
//   let t = nodemailer.createTransport(smtpConfig);
//   // send mail with defined transport object
//   await t.sendMail({
//     from: "rruud@compassly.me", // sender address
//     to: "kaleniuk.developer@gmail.com", // list of receivers
//     subject: "Test message", // Subject line
//     text: "Test message", // plain text body
//     html: "<b>Test message</b>", // html body
//   });
// })();

class Email {
  constructor({ to, subject, message }) {
    this.to = to;
    this.subject = subject;
    this.message = message;
    this.transporter = nodemailer.createTransport(smtpConfig);
  }
  async sendMessage(callback) {
    this.transporter.sendMail(
      {
        from: MAIL_USER,
        to: this.to,
        subject: this.subject,
        text: this.message,
      },
      callback
    );
  }
}

module.exports = { Email };
