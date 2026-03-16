"use client";

import { Card, CardContent } from "@/components/ui/card";
import Chat from "@/src/components/Chat";
import Houses from "@/src/components/Houses";
import Members from "@/src/components/Members";
import Rooms from "@/src/components/Rooms";
import { useConnectionStore } from "@/src/stores/connection-store";
import { useEffect } from "react";

export default function Home() {
  const connect = useConnectionStore((state) => state.connect);
  const disconnect = useConnectionStore((state) => state.disconnect);
  const isConnectedToRoom = useConnectionStore(
    (state) => state.isConnectedToRoom,
  );

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);
  return (
    <main className="bg-primary w-full min-h-screen flex items-center">
      <div className="max-w-[1400px] w-[98vw]  mx-auto h-[96vh] bg-primary flex flex-col md:flex-row rounded-[15px] p-5 gap-5 shadow-[0px_0px_100px_1px_#000000]">
        <div className="w-full md:w-1/4 h-fit rounded-[10px] shadow-[0px_0px_8px_0.5px_#000000] overflow-hidden">
          <Card>
            <CardContent>
              <Members />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Rooms />
            </CardContent>
            <CardContent>
              <Houses />
            </CardContent>
          </Card>
        </div>

        <Card className="w-full md:w-3/4 h-full rounded-[10px] shadow-[0px_0px_8px_0.5px_#000000] overflow-hidden">
          <CardContent>{isConnectedToRoom ? <Chat /> : <></>}</CardContent>
        </Card>
      </div>
    </main>
  );
}
