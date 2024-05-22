const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/auth");
const presenceRoutes = require("./routes/presence");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.use("/auth", userRoutes);
app.use("/presence", presenceRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
