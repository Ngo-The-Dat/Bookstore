import React from "react";
import { useChat } from "@/hooks/useChat"; // Controller
import { MessageCircle, Send, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatBubble = () => {
  const { 
    isOpen, messages, inputValue, isLoading, messagesEndRef,
    toggleChat, setInputValue, sendMessage 
  } = useChat();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 p-4 flex justify-between text-white">
            <h3>AI Tư Vấn</h3>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <Minus className="h-5 w-5" />
            </Button>
          </div>

          {/* List Message */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-white border"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-xs text-gray-500">Đang soạn tin...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-3 bg-white border-t">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="Hỏi gì đó..." 
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && (
        <Button onClick={toggleChat} className="h-14 w-14 rounded-full bg-blue-600">
          <MessageCircle className="h-8 w-8" />
        </Button>
      )}
    </div>
  );
};

export default ChatBubble;