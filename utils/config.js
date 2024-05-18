const {
  JWT_SECRET = "secret-code",
  DB_ADDRESS = "mongodb://127.0.0.1:27017/news-explorer-db",
  PORT = 3001,
} = process.env;

module.exports = {
  JWT_SECRET,
  DB_ADDRESS,
  PORT,
};
