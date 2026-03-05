"use client";

import { useState } from "react";

export default function Members() {
  const [messages, setMessages] = useState<string[]>([]);

  const ws = new WebSocket("ws://localhost:8081");
  ws.addEventListener("open", () => {
    console.log("Connected");
  });
  ws.addEventListener("message", (event: MessageEvent<string>) => {
    setMessages([...messages, event.data]);
  });
  ws.addEventListener("error", (event) => {
    console.error("Client error:", event);
  });
  ws.addEventListener("close", ({ code, reason }) => {
    console.log(`Disconnected (code=${code}, reason=${reason})`);
  });
  return (
    <>
      <h3 className="text-2xl">Members</h3>
      <div></div>
      <h3 className="text-2xl">Messages</h3>
      <div>
        {messages.map((text, id) => (
          <p key={id}>{text}</p>
        ))}
      </div>
    </>
  );
}
