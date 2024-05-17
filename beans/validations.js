class Validations {
  password(password) {
    if (password.length < 8) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
  }

  number(number) {
    if (number.length < 8) return false;

    return true;
  }
}

module.exports = { Validations };
