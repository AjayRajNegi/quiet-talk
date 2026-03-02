import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8081 });
const clients = new Set();

wss.on("connection", (socket) => {
  clients.add(socket);
  console.log("client connected.");

  socket.on("message", (message) => {
    const text = message.toString();
    clients.forEach((client: any) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(text);
      }
    });
  });

  socket.on("close", () => {
    clients.delete(socket);
    console.log("Disconnected");
  });
});
