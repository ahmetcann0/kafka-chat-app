import { useState, useEffect, useRef } from "react";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000"); // Python WebSocket sunucun burada çalışacak

    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      if (ws.current) {
        ws.current.send(input);
      }
      setInput("");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded shadow p-4">
        <h1 className="text-xl font-bold mb-4">Kafka Chat</h1>
        <div className="h-64 overflow-y-auto border p-2 mb-4 rounded bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-1">
              {msg}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border p-2 rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Mesaj yaz..."
          />
          <button
            className="bg-blue-500 text-white px-4 rounded"
            onClick={sendMessage}
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
