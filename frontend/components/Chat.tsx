import { RefObject, useEffect, useState } from "react";

type ChatProps = {
  messages: string[];
  wsRef: RefObject<WebSocket | null>;
};

export default function Chat({ messages, wsRef }: ChatProps) {
  const [input, setInput] = useState<string>("");

  function sendHandler() {
    wsRef.current?.send(input);
    setInput("");
  }

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="w-full h-full  mx-auto p-6 bg-gray-800 rounded-xl shadow-md">
      {/* Header */}
      <h2 className="text-3xl font-semibold text-white mb-4">Messages</h2>

      <div className="w-full h-[94%] flex flex-col justify-between">
        {/* Messages */}
        <ul className="">
          {messages.map((message, index) => (
            <li key={index} className="p-4 bg-gray-700 rounded-xl">
              <p className="text-white">{message}</p>
            </li>
          ))}
        </ul>
        {/* Input field and Send button */}
        <div className="flex items-center gap-x-3 ">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full px-4 py-2 bg-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl shadow-md"
            onClick={() => sendHandler()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
