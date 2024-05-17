// external
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
require("dotenv").config();

mongoose.set("strictQuery", true);

// internal
const indexRouter = require("./routes/index");
const requestLimiter = require("./middlewares/requestLimiter");
const centralizedError = require("./middlewares/centralizedError");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;

const app = express();

// connect to DB
mongoose
  .connect("mongodb://127.0.0.1:27017/news-explorer-db")
  .then(() => {
    console.log("Successfully connected to NewsExplorerDB...");
  })
  .catch((err) => {
    console.error(`Connection to NewsExplorerDB error: ${err.message}`);
  });

// DDOs Attacks
app.use(requestLimiter);

// Security related HTTP headers
app.use(helmet());

// parse incoming request w/ payloads
app.use(express.json());

// Cross-origin resource sharing (CORS)
app.use(cors());

// log inbound request
app.use(requestLogger);

// route to index router
app.use(indexRouter);

// error logger
app.use(errorLogger);

// Joi Data Validation Error Handling
app.use(errors());

// Centralized error handling
app.use(centralizedError);

// launching application..
app.listen(PORT);
