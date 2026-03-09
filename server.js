const express = require("express");
const app = express();
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes")


dotenv.config();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));


mongoose
  .connect("mongodb://127.0.0.1:27017/project2")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // stop server if DB fails
  });

  app.get("/", (req,res) => {
    res.send("API is running");
  })

  app.use("/user", userRoutes);
  app.use("/task", taskRoutes);
  app.use("/project", projectRoutes)

  app.listen(port, () => {
    console.log(`server is running at port ${port}`)
  })