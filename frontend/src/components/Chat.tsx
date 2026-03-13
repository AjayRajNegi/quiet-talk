import { useState } from "react";
import { useConnectionStore } from "../stores/connection-store";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Chat() {
  const messages = useConnectionStore((state) => state.messages);
  const send = useConnectionStore((state) => state.send);

  const [input, setInput] = useState<string>("");

  function sendHandler() {
    send({ type: "chat", message: input });
    setInput("");
  }

  return (
    <Card className="w-full h-full  mx-auto p-6  rounded-xl shadow-md">
      {/* Header */}
      <CardHeader>
        <h2 className="text-3xl font-semibold text-white mb-4">Messages</h2>
      </CardHeader>

      <div className="w-full overflow-y-scroll flex flex-col justify-between">
        {/* Messages */}
        <ul className="">
          {messages.map((message, index) => (
            <div key={index} className="p-2 mt-1 bg-gray-700 rounded-xl">
              <li className=" flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-white" />
                <p className="text-muted font-semibold text-sm">{message.id}</p>
              </li>
              <p className="text-white pl-3">{message.message}</p>
            </div>
          ))}
        </ul>
        {/* Input field and Send button */}
        <div className="flex items-center gap-x-3 ">
          <Input
            type="text"
            placeholder="Type your message..."
            className="w-full px-4 py-2  rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            className=" text-white font-bold py-2 px-4 rounded-xl shadow-md"
            onClick={() => sendHandler()}
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
}
