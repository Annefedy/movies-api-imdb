const express = require("express");
const app = express();
const database = require("./config/database");

const cors = require("cors");
const apiRoutes = require("./routes/api");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.database = database

app.use(
  cors({
   origin: ["http://localhost:7070", "http://localhost:3000"],
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
const session = require("express-session");

app.use(
 session({
    secret: `secret-key`,
    resave: false,
    saveUninitialized: true,
 })
);

app.use("/api", apiRoutes);

// Start the server
const server = app.listen(7070, (error) => {
  if (error) {
    console.log("Error in the server");
  }
  console.log("Server is running on port", server.address().port);
});