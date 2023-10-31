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

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;

  const publicRooms = [];

  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
};

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
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
