const express = require("express");
const auth = require("./routes/auth");

const app = express();

app.use(express.json());

app.use(auth);

app.listen(9000);
