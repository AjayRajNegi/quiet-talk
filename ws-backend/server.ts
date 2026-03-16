import { WebSocket, WebSocketServer } from "ws";

const PORT = 8081;
const wss = new WebSocketServer({ port: PORT });

const clientNames = new Map<WebSocket, string>();
const rooms = new Map<string, Set<WebSocket>>();
const houses = new Map<string, Set<WebSocket>>();

let clientCounter = 0;

interface ExtendedWebSocket extends WebSocket {
  username?: string;
  roomId?: string;
  houseId?: string;
}

function broadcastClientList() {
  const names = Array.from(clientNames.values());
  const payload = JSON.stringify({ type: "clients", names });

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

function broadcastRooms() {
  const roomNames = Array.from(rooms.keys());

  const payload = JSON.stringify({
    type: "rooms",
    roomNames,
  });

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

function broadcastHouses() {
  const houseNames = Array.from(houses.keys());

  const payload = JSON.stringify({
    type: "houses",
    houseNames,
  });

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

function broadcastToRoom(
  roomId: string,
  data: object,
  exceptSocket: WebSocket | null = null,
) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== exceptSocket) {
      client.send(JSON.stringify(data));
    }
  });
}

function broadcastToHouses(
  houseId: string,
  data: object,
  exceptSocket: WebSocket | null = null,
) {
  const house = houses.get(houseId);
  if (!house) return;

  house.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== exceptSocket) {
      client.send(JSON.stringify(data));
    }
  });
}

function leaveRoom(socket: ExtendedWebSocket) {
  const roomId = socket.roomId;
  if (!roomId) return;

  const room = rooms.get(roomId);
  if (!room) return;

  room.delete(socket);

  if (room.size === 0) {
    rooms.delete(roomId);
  } else {
    broadcastToRoom(roomId, {
      type: "notification",
      message: `${socket.username} left the room.`,
    });
    const users = Array.from(room)
      .map((c) => (c as ExtendedWebSocket).username)
      .filter(Boolean);

    broadcastToRoom(roomId, { type: "users", users });
  }

  socket.roomId = undefined;
}

function leaveHouse(socket: ExtendedWebSocket) {
  const houseId = socket.houseId;
  if (!houseId) return;

  const house = houses.get(houseId);
  if (!house) return;

  house.delete(socket);

  if (house.size === 0) {
    houses.delete(houseId);
  } else {
    broadcastToHouses(houseId, {
      type: "notification",
      message: `${socket.username} left the house.`,
    });
  }

  socket.houseId = undefined;
}
wss.on("connection", (socket: ExtendedWebSocket) => {
  const name = `User-${++clientCounter}`;
  clientNames.set(socket, name);
  socket.username = name;
  broadcastClientList();
  broadcastRooms();
  broadcastHouses();

  socket.on("message", (data, isBinary) => {
    if (isBinary) return;

    let msg: {
      type: string;
      room?: string;
      house?: string;
      username?: string;
      message?: string;
    };

    try {
      msg = JSON.parse(data.toString());
    } catch {
      const payload = JSON.stringify({
        type: "message",
        id: name,
        text: data.toString(),
      });

      for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      }
      return;
    }

    if (msg.type === "joinRoom") {
      if (socket.roomId) leaveRoom(socket);

      const roomId = msg.room!;
      const username = msg.username ?? name;

      socket.roomId = roomId;
      socket.username = username;
      clientNames.set(socket, username);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      rooms.get(roomId)!.add(socket);

      broadcastToRoom(
        roomId,
        { type: "notification", message: `${username} joined the room.` },
        socket,
      );

      const users = Array.from(rooms.get(roomId)!)
        .map((c) => (c as ExtendedWebSocket).username)
        .filter(Boolean);

      socket.send(JSON.stringify({ type: "users", users }));
      broadcastClientList();
      broadcastRooms();
    }

    if (msg.type === "joinHouse") {
      if (socket.houseId) leaveHouse(socket);

      const houseId = msg.house!;
      const username = msg.username ?? name;

      socket.houseId = houseId;
      socket.username = username;
      clientNames.set(socket, username);

      if (!houses.has(houseId)) {
        houses.set(houseId, new Set());
      }

      houses.get(houseId)!.add(socket);
      broadcastToHouses(
        houseId,
        { type: "notification", message: `${username} joined the room.` },
        socket,
      );

      const users = Array.from(houses.get(houseId)!)
        .map((c) => (c as ExtendedWebSocket).username)
        .filter(Boolean);

      socket.send(JSON.stringify({ type: "users", users }));
      broadcastClientList();
      broadcastHouses();
    }

    if (msg.type === "chat") {
      if (!socket.roomId) return;

      broadcastToRoom(socket.roomId, {
        type: "chat",
        message: msg.message,
        username: socket.username,
      });
    }
  });

  socket.on("close", () => {
    leaveRoom(socket);
    clientNames.delete(socket);
    broadcastClientList();
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
