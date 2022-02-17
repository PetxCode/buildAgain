const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 3340;

const app = express();

const url_online =
  "mongodb+srv://AuthClass:AuthClass@codelab.u4drr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const url = "mongodb://localhost/dockerDock";
mongoose.connect(url_online).then(() => {
  console.log("db connected");
});

app.use(cors());
app.use(express.json());
app.use("/", require("./router"));

app.listen(port, () => {
  console.log("server is up: ", port);
});
