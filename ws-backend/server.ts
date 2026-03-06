import { WebSocket, WebSocketServer } from "ws";

const PORT = 8081;
const wss = new WebSocketServer({ port: PORT });

const clientNames = new Map<WebSocket, string>();
let clientCounter = 0;

function broadcastClientList() {
  const names = Array.from(clientNames.values());
  const payload = JSON.stringify({ type: "clients", names });

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

wss.on("connection", (socket: WebSocket) => {
  //Assigning a name to client
  const name = `User-${++clientCounter}`;
  // const name = `User-${Date.now()}`;
  clientNames.set(socket, name);
  broadcastClientList();

  socket.on("message", (data, isBinary) => {
    if (isBinary) return;
    const payload = JSON.stringify({
      type: "message",
      id: name,
      text: data.toString(),
    });
    for (const client of wss.clients) {
      // if (client !== socket && client.readyState === WebSocket.OPEN) {
      //   client.send(payload);
      // }
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  });

  socket.on("close", () => {
    clientNames.delete(socket);
    broadcastClientList();
  });
});
