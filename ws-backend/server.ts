import { WebSocket, WebSocketServer } from "ws";

const PORT = 8081;
const HEARTBEAT_INTERVAL_MS = 30_000;

const wss = new WebSocketServer({ port: PORT });

type LiveSocket = WebSocket & { isAlive: boolean };

function broadcast(sender: WebSocket, message: string): void {
  for (const client of wss.clients) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

const heartbeat = setInterval(() => {
  for (const raw of wss.clients) {
    const client = raw as LiveSocket;
    if (!client.isAlive) {
      client.terminate();
      continue;
    }
    client.isAlive = false;
    client.ping();
  }
}, HEARTBEAT_INTERVAL_MS);

wss.on("connection", (raw: WebSocket) => {
  const socket = raw as LiveSocket;
  socket.isAlive = true;

  socket.on("pong", () => {
    socket.isAlive = true;
  });

  socket.on("message", (data, isBinary) => {
    if (isBinary) return;
    broadcast(socket, data.toString());
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

wss.on("error", (err) => {
  console.error("Server error:", err.message);
});

wss.on("close", () => {
  clearInterval(heartbeat);
});

console.log(`WebSocket server listening on ws://localhost:${PORT}`);
