const locate = window.location.host;

const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

const frontSocket = new WebSocket(`ws://${locate}`);

frontSocket.addEventListener("open", () => console.log("Connected to Server"));

frontSocket.addEventListener("message", (message) => {
  console.log("New message: ", message.data);
});

frontSocket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

const handleSubmit = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  frontSocket.send(input.value);
  input.value = "";
}

messageForm.addEventListener('submit', handleSubmit);