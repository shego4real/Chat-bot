const express = require("express");
const http = require("http");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { botMessage, userMessage, items, responseExec } = require("./items");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/chatBot.html");
});
app.get("/health-check", (req, res) => {
  res.status(200).send("OK");
});
const sessionMiddleware = session({
  secret: process.env.MONGO_URI || "secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || "mongodb://localhost/test-app",
  }),
});

io.engine.use(sessionMiddleware);

io.on("connection", (socket) => {
  const req = socket.request;

  const stateStructure = {
    name: "",
    orders: [],
    currentOrder: {},
    placing: false,
  };
  req.session.state = stateStructure;
  req.session.save();
  const state = req.session.state;
  socket.on("user message", (data) => {
    userMessage(data, socket);
    let message = "";

    responseExec(data, socket, message, state, items);

    req.session.save();
  });

  socket.on("welcome", (data) => {
    botMessage("Welcome to the chatbot " + data.name, socket);
    botMessage(
      "Select 1 to Place an order\nSelect 99 to checkout order\nSelect 98 to see order history\nSelect 97 to see current order\nSelect 0 to cancel order\n",
      socket
    );
  });

  socket.on("disconnect", () => {
    req.session.destroy();
  });
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/chatbot")
  .then(() => {
    console.log("Connected to database");
    server.listen(process.env.PORT || 4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });