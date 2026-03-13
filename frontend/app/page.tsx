"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  }, []);
  return (
    <main className=" w-full min-h-screen flex items-center">
      <div className="max-w-7xl w-7xl mx-auto h-[90vh] bg-black flex flex-col md:flex-row rounded-2xl p-5 gap-5 border-2 border-white/70">
        <div className="w-full md:w-1/4 h-fit md:h-full">
          <Button className="px-4 py-2 rounded" onClick={() => join("general")}>
            JOIN
          </Button>
          <Card>
            <CardContent>
              <Members />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Rooms />
            </CardContent>
          </Card>
        </div>

        <Card className="w-full md:w-3/4 h-full rounded-2xl ">
          <CardContent>{isConnectedToRoom ? <Chat /> : <></>}</CardContent>
        </Card>
      </div>
    </main>
  );
}

// backdrop-filter: blur(12px);
// background: color-mix(in oklch, var(--card) 90%, transparent);
