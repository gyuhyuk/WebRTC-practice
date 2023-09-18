const locate = window.location.host;

const frontSocket = new WebSocket(`ws://${locate}`);
