const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.Promise = Promise;
const port = process.env.PORT || 3000;

const urlShortener = require("./url-shortener");
mongoose
  .connect(process.env.MONGO_URI)
  .then(_ => console.log("connected to mongodb succssessfully"))
  .catch(err => console.log(`error connecting to mongodb: ${err}`));

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/*", cors());

app.use("/public", express.static(process.cwd() + "/public"));
app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/hello", (_, res) => res.json({ greeting: "hello API" }));
app.use("/api/shorturl", urlShortener);

app.listen(port, function() {
  console.log("Node.js listening on port ", port);
});
