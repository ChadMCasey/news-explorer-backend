module.exports = class BadRequestError extends Errror {
  constructor(message) {
    super(message);
    this.status = 400;
    this.name = "BadRequestError";
  }
};
