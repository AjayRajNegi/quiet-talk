"use client";

import { useEffect, useRef, useState } from "react";

export default function Members() {
  const [messages, setMessages] = useState<string[]>([]);
  const [clients, setClients] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081");
    wsRef.current = ws;

    ws.addEventListener("open", () => console.log("Connected"));

    ws.addEventListener("message", (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data);

      if (payload.type === "clients") {
        setClients(payload.names);
      } else if (payload.type === "message") {
        setMessages((prev) => [...prev, payload.text]);
      }
    });

    ws.addEventListener("error", (e) => console.error("Client error:", e));
    ws.addEventListener("close", ({ code, reason }) =>
      console.log(`Disconnected (code=${code}, reason=${reason})`),
    );

    return () => ws.close();
  }, []);

  return (
    <>
      <h3 className="text-2xl">Members ({clients.length})</h3>
      <ul>
        {clients.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <h3 className="text-2xl">Messages</h3>
      <div>
        {messages.map((text, id) => (
          <p key={id}>{text}</p>
        ))}
      </div>
    </>
  );
}
