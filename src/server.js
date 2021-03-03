const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

// constants
const app = express();
const port = process.env.API_PORT || 5000;
const routes = require("./routes");
const uri = process.env.ATLAS_URI;

// middleware
app.use(express.json());

// mount the routes
app.use(routes);

// mongodb connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Mongo DB connected successfully");
});

// mount the application
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
