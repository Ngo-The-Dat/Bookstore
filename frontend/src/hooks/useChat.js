import { useState, useRef, useEffect } from "react";
import { aiService } from "@/services/aiService";

export const useChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", text: "Xin chào! Tôi là trợ lý ảo chuyên về sách." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await aiService.chat(userMsg);
      const answer = res.answer || "Xin lỗi, tôi không hiểu.";
      setMessages((prev) => [...prev, { role: "system", text: answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "system", text: "Lỗi kết nối." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    messages,
    inputValue,
    isLoading,
    messagesEndRef,
    toggleChat,
    setInputValue,
    sendMessage
  };
};