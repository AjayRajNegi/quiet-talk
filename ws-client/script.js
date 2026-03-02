const ws = new WebSocket("ws://localhost:8081");
ws.binaryType = "arraybuffer";

ws.addEventListener("open", () => {
  console.log("connected.");
});

ws.addEventListener("message", (event) => {
  const text =
    event.data instanceof ArrayBuffer
      ? new TextDecoder().decode(event.data)
      : event.data;

  const messages = document.getElementById("messages");
  const newMessage = document.createElement("div");

  newMessage.textContent = text;
  console.log(text);
  messages.appendChild(newMessage);
});

ws.addEventListener("close", () => {
  console.log("disconnected");
});

document.getElementById("send").addEventListener("click", () => {
  const input = document.getElementById("message");
  console.log(input.value);
  ws.send(input.value);
  input.value = "";
});
