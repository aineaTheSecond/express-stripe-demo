const express = require("express");

const app = express();

app.use("/stripe", require("./stripe"));

module.exports = app;
