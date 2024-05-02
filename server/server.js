const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const apiRoutes = require("./src/routes/apiRouter");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api", apiRoutes);

// Xử lý lỗi cho các tuyến đường không tồn tại
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
