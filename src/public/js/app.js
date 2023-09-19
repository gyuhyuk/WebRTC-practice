const locate = window.location.host;

const frontSocket = new WebSocket(`ws://${locate}`);

frontSocket.addEventListener("open", () => console.log("Connected to Server"));

frontSocket.addEventListener("message", (message) => {
  console.log("New message: ", message.data);
});

frontSocket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

setTimeout(() => {
  frontSocket.send("hello from the Browser!");
}, 1000);
