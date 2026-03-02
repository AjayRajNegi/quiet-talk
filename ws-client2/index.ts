const ws = new WebSocket("ws://localhost:8081");
ws.binaryType = "arraybuffer";

ws.addEventListener("open", () => {
  console.log("connected from client2.");
});

ws.addEventListener("message", (event) => {
  const text =
    event.data instanceof ArrayBuffer
      ? new TextDecoder().decode(event.data)
      : event.data;
  console.log("client2", text);
});

ws.addEventListener("close", () => {
  console.log("disconnected");
});
