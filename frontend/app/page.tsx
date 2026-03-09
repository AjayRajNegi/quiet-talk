"use client";

import { useEffect, useRef, useState } from "react";
import Members from "@/components/Members";
import Chat from "@/components/Chat";
import Rooms from "@/components/Rooms";

type MessageObjectType = {
  id: string;
  message: string;
};

export default function Home() {
  const [messageObject, setMessageObject] = useState<MessageObjectType[]>([]);
  const [clients, setClients] = useState<string[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081");
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ type: "join", room: "general" }));
    });

    ws.addEventListener("message", (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data);

      if (payload.type === "clients") {
        setClients(payload.names);
      } else if (payload.type === "message") {
        setMessageObject((prev) => [
          ...prev,
          { id: payload.id, message: payload.text },
        ]);
      } else if (payload.type === "chat") {
        setMessageObject((prev) => [
          ...prev,
          { id: payload.username, message: payload.message },
        ]);
      } else if (payload.type === "notification") {
        setMessageObject((prev) => [
          ...prev,
          { id: "system", message: payload.message },
        ]);
      } else if (payload.type === "users") {
        setClients(payload.users);
      } else if (payload.type === "rooms") {
        setRooms(payload.roomNames);
        console.log("Rooms", payload.roomNames);
      }
    });
    ws.addEventListener("error", (e) => console.error("Client error:", e));
    ws.addEventListener("close", ({ code, reason }) =>
      console.log(`Disconnected (code=${code}, reason=${reason})`),
    );

    return () => ws.close();
  }, []);
  return (
    <main className="bg-cyan-400 w-full min-h-screen flex items-center">
      <div className="max-w-7xl w-7xl mx-auto h-[90vh] bg-black flex flex-col md:flex-row rounded-2xl p-5 gap-5 border-2 border-white/70">
        <div className="w-full md:w-1/4 h-fit md:h-full">
          <div className="rounded-xl border-2 border-white/70 p-2 bg-gray-800 ">
            <Members clients={clients} />
          </div>
          <div className="rounded-xl border-2 mt-2 border-white/70 p-2 bg-gray-800 ">
            <Rooms rooms={rooms} />
          </div>
        </div>

        <div className="w-full md:w-3/4 h-full rounded-2xl border-2 border-white/70">
          <Chat wsRef={wsRef} messageObject={messageObject} />
        </div>
      </div>
    </main>
  );
}
