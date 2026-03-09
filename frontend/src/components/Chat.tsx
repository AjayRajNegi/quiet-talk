import { useState } from "react";
import { useConnectionStore } from "../stores/connection-store";

export default function Chat() {
  const messages = useConnectionStore((state) => state.messages);
  const send = useConnectionStore((state) => state.send);

  const [input, setInput] = useState<string>("");

  function sendHandler() {
    send({ type: "chat", message: input });
    setInput("");
  }

  return (
    <div className="w-full h-full  mx-auto p-6 bg-gray-800 rounded-xl shadow-md">
      {/* Header */}
      <h2 className="text-3xl font-semibold text-white mb-4">Messages</h2>

      <div className="w-full h-[94%] flex flex-col justify-between">
        {/* Messages */}
        <ul className="">
          {messages.map((message, index) => (
            <div key={index} className="p-2 mt-1 bg-gray-700 rounded-xl">
              <li className=" flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-white" />
                <p className="text-green-500 font-semibold text-sm">
                  {message.id}
                </p>
              </li>
              <p className="text-white pl-3">{message.message}</p>
            </div>
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
