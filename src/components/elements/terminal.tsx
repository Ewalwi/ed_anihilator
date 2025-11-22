"use client";

import { handleInput } from "@/src/hooks/CommandHandler";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Message from "../ui/message";

interface MessageInterface {
  id: number;
  text: string;
}

export default function Terminal() {
  const initialMessages: MessageInterface[] = [
    { id: 1, text: "Welcome to the ED inspector tool" },
  ];
  const [messages, setMessages] = useState<MessageInterface[]>(initialMessages);
  const messageIdRef = useRef<number>(
    initialMessages.length > 0
      ? Math.max(...initialMessages.map((m) => m.id))
      : 0
  );
  const [inputValue, setInputValue] = useState("");
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const print = (text: string) => {
    setMessages((prev) => {
      messageIdRef.current += 1;
      return [...prev, { id: messageIdRef.current, text }];
    });
  };

  async function enterCmd(text: string) {
    if (!text.trim()) return;
    setMessages((prevMessages) => {
      messageIdRef.current += 1;
      return [
        ...prevMessages,
        { id: messageIdRef.current, text: `@EDInspector ~ root> ${text}` },
      ];
    });
    await handleInput(text, print);
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      await enterCmd(inputValue);
      setInputValue("");
    }
  };

  const scrollToBottom = () => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[#202020] p-0 m-0 font-mono text-[#43b600] text-lg">
      <div className="w-full h-[calc(100%-3rem)] m-0 overflow-y-auto">
        <div className="p-4 whitespace-pre-wrap">
          {messages.map((msg: MessageInterface) => (
            <Message key={msg.id} text={msg.text} />
          ))}
          <div ref={consoleEndRef} />
        </div>
      </div>
      <div className="bg-[#202020] h-12 w-full fixed bottom-0 left-0 border-t border-gray-500 m-0 pl-4 flex items-center box-border">
        &gt;
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          autoFocus
          className="bg-transparent border-none w-full ml-4 outline-none text-inherit"
        />
      </div>
    </div>
  );
}
