import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Dashboard = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatOptions, setChatOptions] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/chat/", { withCredentials: true });
        setChats(res.data.chats);
        if (res.data.chats.length > 0) setActiveChat(res.data.chats[0]);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    if (!activeChat) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/chat/${activeChat._id}`, { withCredentials: true });
        setMessages(res.data.chat.interactions || []);
        scrollToBottom();
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [activeChat]);

  const handlePromptChange = (e) => setPrompt(e.target.value);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt || !activeChat) return;

    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { role: "user", prompt }]);
    setMessages((prev) => [...prev, { role: "assistant", response: "..." }]);
    scrollToBottom();

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/interaction/${activeChat._id}/message`,
        { prompt },
        { withCredentials: true }
      );
      if (res.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.role === "assistant" && msg.response === "..." ? { ...msg, response: res.data.aiResponse } : msg
          )
        );
      } else {
        setError(res.data.message || "AI generation failed");
        setMessages((prev) => prev.filter((msg) => !(msg.role === "assistant" && msg.response === "...")));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
      setMessages((prev) => prev.filter((msg) => !(msg.role === "assistant" && msg.response === "...")));
    } finally {
      setPrompt("");
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleNewChat = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/v1/chat/", { title: "New Chat" }, { withCredentials: true });
      setChats((prev) => [res.data.chat, ...prev]);
      setActiveChat(res.data.chat);
      setMessages([]);
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/chat/${chatId}`, { withCredentials: true });
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      if (activeChat?._id === chatId) {
        setActiveChat(chats.filter((c) => c._id !== chatId)[0] || null);
        setMessages([]);
      }
      setChatOptions(null);
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/v1/user/logout", {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed z-50 top-0 left-0 h-full bg-gray-800 text-white flex flex-col p-4 gap-3 transition-transform duration-300 sm:relative sm:translate-x-0 ${
          sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        }`}
      >
        {/* Mobile toggle */}
        <button
          className="sm:hidden mb-2 bg-gray-700 hover:bg-gray-600 p-2 rounded font-semibold"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "Close" : "Menu"}
        </button>

        <button onClick={handleNewChat} className="bg-gray-700 hover:bg-gray-600 p-2 rounded font-semibold">
          + New Chat
        </button>

        <div className="flex-1 flex flex-col gap-2 mt-4 overflow-y-auto">
          {chats.map((chat) => (
            <div key={chat._id} className="flex justify-between items-center">
              <button
                onClick={() => setActiveChat(chat)}
                className={`text-left p-2 rounded flex-1 text-sm ${
                  activeChat?._id === chat._id ? "bg-gray-600" : "hover:bg-gray-700"
                }`}
              >
                {chat.title.length > 15 ? chat.title.slice(0, 15) + "..." : chat.title}
              </button>

              <div className="relative">
                <button
                  onClick={() => setChatOptions((prev) => (prev === chat._id ? null : chat._id))}
                  className="px-2 py-1 hover:bg-gray-700 rounded"
                >
                  ...
                </button>

                {chatOptions === chat._id && (
                  <div className="absolute right-0 mt-1 bg-gray-700 text-white p-2 rounded shadow-md z-50">
                    <button
                      className="hover:bg-gray-600 px-2 py-1 rounded"
                      onClick={() => handleDeleteChat(chat._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-500 p-2 rounded font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black opacity-30 sm:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-2 sm:p-4 ml-0 sm:ml-64">
        <div className="flex-1 overflow-y-auto mb-2 sm:mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 max-w-xl p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-purple-600 text-white self-end"
                  : "bg-gray-200 text-black self-start flex items-center gap-2"
              }`}
            >
              {msg.response === "..." ? <span className="animate-pulse">AI is typing...</span> : msg.role === "user" ? msg.prompt : msg.response}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-2 items-center border-t border-gray-300 pt-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={prompt}
            onChange={handlePromptChange}
            disabled={loading}
            className="flex-1 p-3 rounded border border-gray-300 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Dashboard;
