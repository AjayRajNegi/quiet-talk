"use client";
import { useState } from "react";
import { useConnectionStore } from "../stores/connection-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Rooms() {
  const [inputRoom, setInputRoom] = useState<string>("");
  const rooms = useConnectionStore((state) => state.rooms);
  const join = useConnectionStore((state) => state.join);

  function createRandomString(): string {
    return `Room-${Math.floor(Math.random() * 1000000)}`;
  }

  return (
    <>
      <h3 className="text-2xl ">Rooms ({rooms.length})</h3>
      <ul>
        {rooms.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <div className="flex gap-2 md:flex-col pt-2 text-center">
        <Button
          className="border rounded p-2"
          onClick={() => join(createRandomString())}
        >
          Create a Room
        </Button>
        <div className="rounded p-2 justify-between flex bg-muted">
          <Input
            placeholder="Join a Room"
            className="border-0"
            value={inputRoom}
            onChange={(e) => setInputRoom(e.target.value)}
          />
          <Button className=" rounded p-1 px-2" onClick={() => join(inputRoom)}>
            join
          </Button>
        </div>
      </div>
    </>
  );
}
