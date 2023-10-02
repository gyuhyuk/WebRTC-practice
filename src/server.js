import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (msg, done) => {
    console.log(msg);
    setTimeout(() => {
      done();
    }, 10000);
  });
});

// const wss = new WebSocket.Server({ server });
// const onSocketClose = () => {
//   console.log("Disconnected from the Browser");
// }

// const sockets = [];

// wss.on("connection", (backSocket) => {
//   sockets.push(backSocket);
//   backSocket["nickname"] = "Anon";
//   console.log("Connected to Browser");
//   backSocket.on("close", onSocketClose);
//   backSocket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     switch(message.type)
//     {
//       case "new_message":
//         sockets.forEach((aSocket) => aSocket.send(`${backSocket.nickname}: ${message.payload}`));
//         break
//       case "nickname":
//         backSocket["nickname"] = message.payload;
//       break
//     }
//   });
// });

const handleListen = () => console.log("Listening on http://localhost:3000");
httpServer.listen(3000, handleListen);
