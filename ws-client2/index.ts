// const ws = new WebSocket("ws://localhost:8081");
// ws.binaryType = "arraybuffer";

// ws.addEventListener("open", () => {
//   console.log("connected from client2.");
// });

// ws.addEventListener("message", (event) => {
//   const text =
//     event.data instanceof ArrayBuffer
//       ? new TextDecoder().decode(event.data)
//       : event.data;
//   console.log("client2", text);
// });

// ws.addEventListener("close", () => {
//   console.log("disconnected");
// });

const ws = new WebSocket("ws://localhost:8081");

ws.addEventListener("open", () => {
  console.log("client2: connected.");
});

ws.addEventListener("message", (event: MessageEvent<string>) => {
  console.log("client2 received:", event.data);
});

ws.addEventListener("error", (event) => {
  console.error("client2 error:", event);
});

ws.addEventListener("close", ({ code, reason }) => {
  console.log(`client2: disconnected (code=${code}, reason=${reason})`);
});
