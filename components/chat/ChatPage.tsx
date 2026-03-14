"use client";

import React, { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  Bot,
  FileText,
  MessageSquare,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: number | string;
}

const MOCK_RESPONSES: Record<string, string> = {
  default:
    "Based on the document, I can help you understand its contents. The PDF covers several key topics including architecture changes, performance improvements, and developer experience enhancements. Feel free to ask me specific questions about any section.",
  summary:
    "The document discusses **Next.js 16**, which introduces React 19 as the default runtime with native Server Components support. Key highlights include:\n\n- **Turbopack** is now stable and the default bundler\n- New `use()` hook for simplified async data fetching\n- Enhanced Image component with AVIF support\n- Improved middleware with better caching controls\n\nThe release focuses heavily on performance, with up to 76% faster cold starts and reduced client-side JavaScript.",
  performance:
    "According to the document, the performance improvements in Next.js 16 are significant:\n\n1. **Turbopack** delivers up to 76% faster cold starts\n2. Hot module replacement is substantially faster\n3. Client-side JavaScript is reduced by up to 40%\n4. The new streaming SSR pipeline improves Time to First Byte (TTFB)\n5. Core Web Vitals scores are improved across the board\n\nThese improvements make Next.js 16 one of the fastest React frameworks available.",
  migration:
    "The document recommends the following migration steps:\n\n→ Migrate from Pages Router to App Router before v17 deprecation\n→ Update data fetching patterns to use the new `use()` hook\n→ Enable Turbopack in existing projects\n→ Review and update caching strategies with the new defaults\n\nA new CLI tool is also available to help with project migration from earlier versions.",
};

function getMockResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("summary") || q.includes("about") || q.includes("what")) {
    return MOCK_RESPONSES.summary;
  }
  if (q.includes("performance") || q.includes("fast") || q.includes("speed")) {
    return MOCK_RESPONSES.performance;
  }
  if (q.includes("migrate") || q.includes("upgrade") || q.includes("action")) {
    return MOCK_RESPONSES.migration;
  }
  return MOCK_RESPONSES.default;
}

function formatMessageTime(message: ChatMessage): string {
  const timestamp =
    typeof message.timestamp === "number"
      ? message.timestamp
      : typeof message.timestamp === "string"
        ? Number(message.timestamp)
        : Number(message.id);

  if (!Number.isFinite(timestamp)) return "";

  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SUGGESTIONS = [
  "What is this document about?",
  "What are the performance improvements?",
  "How do I migrate to this version?",
];

interface ChatPageProps {
  fileName: string;
  chatId?: string;
  originalFileUrl?: string;
  initialMessages?: ChatMessage[];
}

const ChatPage: React.FC<ChatPageProps> = ({
  fileName,
  initialMessages = [],
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollBtn(!isNearBottom);
  };

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isTyping) return;

    const now = Date.now();

    const userMsg: ChatMessage = {
      id: now.toString(),
      role: "user",
      content: msg,
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    timeoutRef.current = setTimeout(
      () => {
        const response = getMockResponse(msg);
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
        timeoutRef.current = null;
      },
      1200 + Math.random() * 800
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full min-h-0 flex-col overflow-hidden"
    >
      <div className="mb-4 flex items-center justify-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-gray-700/60 bg-[#1a1a1a] px-4 py-1.5">
          <FileText className="h-3.5 w-3.5 text-[#0CF2A0]" />
          <span className="max-w-50 truncate text-sm text-gray-400">
            {fileName}
          </span>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative min-h-0 flex-1 space-y-1 overflow-y-auto scroll-smooth px-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0CF2A0]/10">
              <MessageSquare className="h-8 w-8 text-[#0CF2A0]" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">
              Chat with your PDF
            </h2>
            <p className="mb-8 max-w-sm text-sm text-gray-500">
              Ask questions about your document and get instant AI-powered
              answers.
            </p>
            <div className="flex w-full max-w-sm flex-col gap-2">
              {SUGGESTIONS.map((suggestion, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  onClick={() => handleSend(suggestion)}
                  className="group rounded-xl border border-gray-700/60 bg-[#1a1a1a]/50 px-4 py-3 text-left text-sm text-gray-400 transition-all hover:border-[#0CF2A0]/40 hover:bg-[#0CF2A0]/5 hover:text-gray-200"
                >
                  <span className="mr-2 text-[#0CF2A0] transition-all group-hover:mr-3">
                    →
                  </span>
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {messages.map((msg) => {
              const messageTime = formatMessageTime(msg);

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#0CF2A0]/10">
                      <Bot className="h-4 w-4 text-[#0CF2A0]" />
                    </div>
                  )}
                  <div
                    className={`flex max-w-[80%] flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "rounded-br-md bg-[#0CF2A0] text-[#111111]"
                          : "rounded-bl-md border border-gray-700/60 bg-[#1a1a1a] text-gray-300"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {messageTime ? (
                      <span
                        className={`mt-1 block px-1 text-[11px] text-gray-500 ${
                          msg.role === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {messageTime}
                      </span>
                    ) : null}
                  </div>
                  {msg.role === "user" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-700/50">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              );
            })}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#0CF2A0]/10">
                  <Bot className="h-4 w-4 text-[#0CF2A0]" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-gray-700/60 bg-[#1a1a1a] px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <motion.span
                      className="h-2 w-2 rounded-full bg-[#0CF2A0]/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                      className="h-2 w-2 rounded-full bg-[#0CF2A0]/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.span
                      className="h-2 w-2 rounded-full bg-[#0CF2A0]/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              className="sticky bottom-4 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-gray-700 bg-[#1a1a1a] transition-colors hover:bg-gray-800"
            >
              <ArrowDown className="h-4 w-4 text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="relative mt-3 shrink-0">
        <div className="overflow-hidden rounded-2xl border border-gray-700/60 bg-[#1a1a1a] transition-colors focus-within:border-[#0CF2A0]/40">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your PDF..."
            rows={1}
            disabled={isTyping}
            className="max-h-40 min-h-11 w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none disabled:opacity-50"
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-md bg-[#111111]/50 px-2 py-1 text-xs text-gray-600">
                <Sparkles className="h-3 w-3" />
                AI-powered
              </span>
            </div>
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="h-8 w-8 rounded-xl bg-[#0CF2A0] text-[#111111] transition-all hover:bg-[#0CF2A0]/90 disabled:bg-gray-700 disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-gray-600">
          AI responses are generated from your document content
        </p>
      </div>
    </motion.div>
  );
};

export default ChatPage;
