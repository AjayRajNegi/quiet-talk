import { create } from "zustand";

interface MessageObject {
  id: string;
  message: string;
}

interface ConnectionStore {
  ws: WebSocket | null;
  messages: MessageObject[];
  clients: string[];
  rooms: string[];
  houses: string[];
  isConnectedToRoom: boolean;

  connect: () => void;
  disconnect: () => void;
  send: (data: object) => void;
  join: (room: string) => void;
  joinHouse: (house: string) => void;
}

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
  ws: null,
  messages: [],
  clients: [],
  rooms: [],
  houses: [],
  isConnectedToRoom: true,

  connect: () => {
    if (get().ws) return;

    const ws = new WebSocket("ws://localhost:8081");

    ws.addEventListener("message", (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data);

      if (payload.type === "clients") {
        set({ clients: payload.names });
      } else if (payload.type === "messages") {
        set((state) => ({
          messages: [
            ...state.messages,
            { id: payload.id, message: payload.message },
          ],
        }));
      } else if (payload.type === "chat") {
        set((state) => ({
          messages: [
            ...state.messages,
            { id: payload.username, message: payload.message },
          ],
        }));
      } else if (payload.type === "notification") {
        set((state) => ({
          messages: [
            ...state.messages,
            { id: "system", message: payload.message },
          ],
        }));
      } else if (payload.type === "users") {
        set({ clients: payload.users, isConnectedToRoom: true });
      } else if (payload.type === "rooms") {
        set({ rooms: payload.roomNames });
      } else if (payload.type === "houses") {
        set({ houses: payload.houseNames });
      }
    });

    ws.addEventListener("close", ({ code, reason }) => {
      console.log(`Disconnected (code=${code}, reason=${reason})`);
      set({ ws: null });
    });

    set({ ws });
  },
  disconnect: () => {
    get().ws?.close();
    set({ ws: null });
  },
  send: (data: object) => {
    const { ws } = get();
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  },
  join: (room: string) => {
    const { ws } = get();

    if (!ws) return;
    ws.send(JSON.stringify({ type: "join", room: room }));
  },
  joinHouse: (house: string) => {
    const { ws } = get();

    if (!ws) return;
    ws.send(JSON.stringify({ type: "joinHouse", house: house }));
  },
}));
