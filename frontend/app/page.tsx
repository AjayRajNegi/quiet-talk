"use client";

import Chat from "@/src/components/Chat";
import Members from "@/src/components/Members";
import Rooms from "@/src/components/Rooms";
import { useConnectionStore } from "@/src/stores/connection-store";
import { useEffect } from "react";

export default function Home() {
  const connect = useConnectionStore((state) => state.connect);
  const disconnect = useConnectionStore((state) => state.disconnect);
  const join = useConnectionStore((state) => state.join);
  const isConnectedToRoom = useConnectionStore(
    (state) => state.isConnectedToRoom,
  );

  useEffect(() => {
    connect();
    return () => disconnect();
  });
  return (
    <main className="bg-cyan-400 w-full min-h-screen flex items-center">
      <div className="max-w-7xl w-7xl mx-auto h-[90vh] bg-black flex flex-col md:flex-row rounded-2xl p-5 gap-5 border-2 border-white/70">
        <div className="w-full md:w-1/4 h-fit md:h-full">
          <button
            className="px-4 py-2 rounded bg-blue-300 text-white"
            onClick={() => join("general")}
          >
            JOIN
          </button>
          <div className="rounded-xl border-2 border-white/70 p-2 bg-gray-800 ">
            <Members />
          </div>
          <div className="rounded-xl border-2 mt-2 border-white/70 p-2 bg-gray-800 ">
            <Rooms />
          </div>
        </div>

        <div className="w-full md:w-3/4 h-full rounded-2xl border-2 border-white/70">
          {isConnectedToRoom ? <Chat /> : <></>}
        </div>
      </div>
    </main>
  );
}
