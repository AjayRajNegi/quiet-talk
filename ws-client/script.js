const ws = new WebSocket("ws://localhost:8081");

ws.addEventListener("open", () => {
  console.log("connected.");
});

ws.addEventListener("message", (event) => {
  const messages = document.getElementById("messages");
  if (!messages) return;

  const div = document.createElement("div");
  div.textContent = event.data;
  messages.appendChild(div);
  console.log("received:", event.data);
});

ws.addEventListener("error", (event) => {
  console.error("WebSocket error:", event);
});

ws.addEventListener("close", ({ code, reason }) => {
  console.log(`disconnected (code=${code}, reason=${reason})`);
});

document.getElementById("send")?.addEventListener("click", () => {
  const input = document.getElementById("message");
  if (!input) return;

  const text = input.value.trim();
  if (!text || ws.readyState !== WebSocket.OPEN) return;

  ws.send(text);
  input.value = "";
});
