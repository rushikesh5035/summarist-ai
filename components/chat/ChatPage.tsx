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
import { toast } from "sonner";

import ChatPageSkeleton from "@/components/chat/ChatPageSkeleton";
import { Button } from "@/components/ui/button";

type ProcessingStatus =
  | "processing"
  | "parsing"
  | "chunking"
  | "embedding"
  | "ready"
  | "error";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: number | string;
}

interface ChatPageProps {
  fileName: string;
  chatId: string;
  originalFileUrl?: string;
  initialMessages?: ChatMessage[];
}

const SUGGESTIONS = [
  "What is this document about?",
  "What are the key points?",
  "Give me a quick summary.",
];

// Maps each status → skeleton label shown below the pulsing dot
const STATUS_LABELS: Record<ProcessingStatus, string> = {
  processing: "Initialising...",
  parsing: "Reading your PDF...",
  chunking: "Splitting into sections...",
  embedding: "Creating vector embeddings...",
  ready: "Ready",
  error: "Failed",
};

// Maps each status → toast message fired once on transition
const STATUS_TOASTS: Partial<
  Record<ProcessingStatus, { title: string; description: string }>
> = {
  parsing: {
    title: "📄 Reading PDF",
    description: "Extracting text from your document...",
  },
  chunking: {
    title: "✂️ Splitting content",
    description: "Breaking document into searchable sections...",
  },
  embedding: {
    title: "🧠 Creating embeddings",
    description: "Building vector index for smart search...",
  },
  ready: {
    title: "✅ Chat is ready!",
    description: "Your PDF has been indexed. Start asking questions!",
  },
  error: {
    title: "❌ Processing failed",
    description: "Something went wrong. Please try uploading again.",
  },
};

// Format message time
function formatMessageTime(ts?: number | string): string {
  const t = typeof ts === "string" ? Number(ts) : ts;
  if (!t || !Number.isFinite(t)) return "";
  return new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ChatPage: React.FC<ChatPageProps> = ({ fileName, chatId }) => {
  const [status, setStatus] = useState<ProcessingStatus>("processing");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevStatusRef = useRef<ProcessingStatus>("processing");
  const pollCountRef = useRef(0);

  // ── Poll status + show toasts on transitions
  useEffect(() => {
    const MAX_POLLS = 100; // 5 minutes at 3-second intervals

    const poll = async () => {
      try {
        pollCountRef.current++;

        // Timeout after max polls
        if (pollCountRef.current > MAX_POLLS) {
          console.error("[ChatPage] Polling timeout - max attempts reached");
          setStatus("error");
          if (pollRef.current) clearInterval(pollRef.current);
          toast.error("Processing timeout", {
            description:
              "PDF processing is taking too long. Please refresh the page or try again.",
          });
          return;
        }

        const res = await fetch(`/api/chat/${chatId}/status`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });

        if (!res.ok) {
          console.error("[ChatPage] Status fetch failed:", res.status);
          return; // Retry on next interval
        }

        const data: { status: ProcessingStatus } = await res.json();
        const incoming = data.status;

        console.log(
          `[ChatPage] Poll #${pollCountRef.current}: status = ${incoming}`
        );

        // Only act if status actually changed
        if (incoming !== prevStatusRef.current) {
          prevStatusRef.current = incoming;
          setStatus(incoming);

          // Fire a toast for this specific transition
          const toastData = STATUS_TOASTS[incoming];
          if (toastData) {
            toast(toastData.title, { description: toastData.description });
          }

          if (incoming === "ready" || incoming === "error") {
            if (pollRef.current) clearInterval(pollRef.current);

            // Load existing messages when ready
            if (incoming === "ready") {
              const msgRes = await fetch(`/api/chat/${chatId}`);
              const msgData = await msgRes.json();
              if (msgData.messages) {
                setMessages(
                  msgData.messages.map((m: any) => ({
                    id: m.id,
                    role: m.role,
                    content: m.content,
                    timestamp: new Date(m.createdAt).getTime(),
                  }))
                );
              }
            }
          }
        }
      } catch (error) {
        console.error("[ChatPage] Polling error:", error);
        // Continue retrying
      }
    };

    poll();
    pollRef.current = setInterval(poll, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
  };

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isTyping || status !== "ready") return;

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

    try {
      const res = await fetch(`/api/chat/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message || "Sorry, I couldn't generate a response.",
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
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

  // Skeleton while processing
  if (status !== "ready" && status !== "error") {
    return <ChatPageSkeleton statusLabel={STATUS_LABELS[status]} />;
  }

  // Error State
  if (status === "error") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <p className="text-red-400">
          Failed to process PDF. Please try uploading again.
        </p>
      </div>
    );
  }

  // return (
  //   <motion.div
  //     initial={{ opacity: 0, y: 20 }}
  //     animate={{ opacity: 1, y: 0 }}
  //     transition={{ duration: 0.4 }}
  //     className="flex h-full min-h-0 flex-col overflow-hidden"
  //   >
  //     <div className="mb-4 flex items-center justify-center gap-2">
  //       <div className="flex items-center gap-2 rounded-full border border-gray-700/60 bg-[#1a1a1a] px-4 py-1.5">
  //         <FileText className="h-3.5 w-3.5 text-[#0CF2A0]" />
  //         <span className="max-w-50 truncate text-sm text-gray-400">
  //           {fileName}
  //         </span>
  //       </div>
  //     </div>

  //     <div
  //       ref={scrollContainerRef}
  //       onScroll={handleScroll}
  //       className="relative min-h-0 flex-1 space-y-1 overflow-y-auto scroll-smooth px-1"
  //       style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
  //     >
  //       {messages.length === 0 ? (
  //         <div className="flex h-full flex-col items-center justify-center px-4 text-center">
  //           <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0CF2A0]/10">
  //             <MessageSquare className="h-8 w-8 text-[#0CF2A0]" />
  //           </div>
  //           <h2 className="mb-2 text-xl font-semibold text-white">
  //             Chat with your PDF
  //           </h2>
  //           <p className="mb-8 max-w-sm text-sm text-gray-500">
  //             Ask questions about your document and get instant AI-powered
  //             answers.
  //           </p>
  //           <div className="flex w-full max-w-sm flex-col gap-2">
  //             {SUGGESTIONS.map((suggestion, i) => (
  //               <motion.button
  //                 key={i}
  //                 initial={{ opacity: 0, y: 10 }}
  //                 animate={{ opacity: 1, y: 0 }}
  //                 transition={{ delay: 0.2 + i * 0.1 }}
  //                 onClick={() => handleSend(suggestion)}
  //                 className="group rounded-xl border border-gray-700/60 bg-[#1a1a1a]/50 px-4 py-3 text-left text-sm text-gray-400 transition-all hover:border-[#0CF2A0]/40 hover:bg-[#0CF2A0]/5 hover:text-gray-200"
  //               >
  //                 <span className="mr-2 text-[#0CF2A0] transition-all group-hover:mr-3">
  //                   →
  //                 </span>
  //                 {suggestion}
  //               </motion.button>
  //             ))}
  //           </div>
  //         </div>
  //       ) : (
  //         <div className="space-y-4 py-4">
  //           {messages.map((msg) => {
  //             const messageTime = formatMessageTime(msg);

  //             return (
  //               <motion.div
  //                 key={msg.id}
  //                 initial={{ opacity: 0, y: 8 }}
  //                 animate={{ opacity: 1, y: 0 }}
  //                 transition={{ duration: 0.3 }}
  //                 className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
  //               >
  //                 {msg.role === "assistant" && (
  //                   <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#0CF2A0]/10">
  //                     <Bot className="h-4 w-4 text-[#0CF2A0]" />
  //                   </div>
  //                 )}
  //                 <div
  //                   className={`flex max-w-[80%] flex-col ${msg.role === "user" ? "items-end" : "items-start"
  //                     }`}
  //                 >
  //                   <div
  //                     className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user"
  //                       ? "rounded-br-md bg-[#0CF2A0] text-[#111111]"
  //                       : "rounded-bl-md border border-gray-700/60 bg-[#1a1a1a] text-gray-300"
  //                       }`}
  //                   >
  //                     {msg.content}
  //                   </div>
  //                   {messageTime ? (
  //                     <span
  //                       className={`mt-1 block px-1 text-[11px] text-gray-500 ${msg.role === "user" ? "text-right" : "text-left"
  //                         }`}
  //                     >
  //                       {messageTime}
  //                     </span>
  //                   ) : null}
  //                 </div>
  //                 {msg.role === "user" && (
  //                   <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-700/50">
  //                     <User className="h-4 w-4 text-gray-400" />
  //                   </div>
  //                 )}
  //               </motion.div>
  //             );
  //           })}

  //           {isTyping && (
  //             <motion.div
  //               initial={{ opacity: 0, y: 8 }}
  //               animate={{ opacity: 1, y: 0 }}
  //               className="flex gap-3"
  //             >
  //               <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#0CF2A0]/10">
  //                 <Bot className="h-4 w-4 text-[#0CF2A0]" />
  //               </div>
  //               <div className="rounded-2xl rounded-bl-md border border-gray-700/60 bg-[#1a1a1a] px-4 py-3">
  //                 <div className="flex items-center gap-1.5">
  //                   <motion.span
  //                     className="h-2 w-2 rounded-full bg-[#0CF2A0]/60"
  //                     animate={{ opacity: [0.3, 1, 0.3] }}
  //                     transition={{ duration: 1, repeat: Infinity, delay: 0 }}
  //                   />
  //                   <motion.span
  //                     className="h-2 w-2 rounded-full bg-[#0CF2A0]/60"
  //                     animate={{ opacity: [0.3, 1, 0.3] }}
  //                     transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
  //                   />
  //                   <motion.span
  //                     className="h-2 w-2 rounded-full bg-[#0CF2A0]/60"
  //                     animate={{ opacity: [0.3, 1, 0.3] }}
  //                     transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
  //                   />
  //                 </div>
  //               </div>
  //             </motion.div>
  //           )}

  //           <div ref={messagesEndRef} />
  //         </div>
  //       )}

  //       <AnimatePresence>
  //         {showScrollBtn && (
  //           <motion.button
  //             initial={{ opacity: 0, scale: 0.8 }}
  //             animate={{ opacity: 1, scale: 1 }}
  //             exit={{ opacity: 0, scale: 0.8 }}
  //             onClick={scrollToBottom}
  //             className="sticky bottom-4 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-gray-700 bg-[#1a1a1a] transition-colors hover:bg-gray-800"
  //           >
  //             <ArrowDown className="h-4 w-4 text-gray-400" />
  //           </motion.button>
  //         )}
  //       </AnimatePresence>
  //     </div>

  //     <div className="relative mt-3 shrink-0">
  //       <div className="overflow-hidden rounded-2xl border border-gray-700/60 bg-[#1a1a1a] transition-colors focus-within:border-[#0CF2A0]/40">
  //         <textarea
  //           ref={textareaRef}
  //           value={input}
  //           onChange={handleTextareaChange}
  //           onKeyDown={handleKeyDown}
  //           placeholder="Ask anything about your PDF..."
  //           rows={1}
  //           disabled={isTyping}
  //           className="max-h-40 min-h-11 w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none disabled:opacity-50"
  //         />
  //         <div className="flex items-center justify-between px-3 pb-3">
  //           <div className="flex items-center gap-2">
  //             <span className="flex items-center gap-1.5 rounded-md bg-[#111111]/50 px-2 py-1 text-xs text-gray-600">
  //               <Sparkles className="h-3 w-3" />
  //               AI-powered
  //             </span>
  //           </div>
  //           <Button
  //             onClick={() => handleSend()}
  //             disabled={!input.trim() || isTyping}
  //             size="icon"
  //             className="h-8 w-8 rounded-xl bg-[#0CF2A0] text-[#111111] transition-all hover:bg-[#0CF2A0]/90 disabled:bg-gray-700 disabled:opacity-30"
  //           >
  //             <Send className="h-4 w-4" />
  //           </Button>
  //         </div>
  //       </div>
  //       <p className="mt-2 text-center text-[11px] text-gray-600">
  //         AI responses are generated from your document content
  //       </p>
  //     </div>
  //   </motion.div>
  // );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full min-h-0 flex-col overflow-hidden"
    >
      {/* File badge */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-gray-700/60 bg-[#1a1a1a] px-4 py-1.5">
          <FileText className="h-3.5 w-3.5 text-[#0CF2A0]" />
          <span className="max-w-50 truncate text-sm text-gray-400">
            {fileName}
          </span>
        </div>
      </div>

      {/* Messages */}
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
            {messages.map((msg) => (
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
                  className={`flex max-w-[80%] flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
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
                  {msg.timestamp && (
                    <span
                      className={`mt-1 block px-1 text-[11px] text-gray-500 ${msg.role === "user" ? "text-right" : "text-left"}`}
                    >
                      {formatMessageTime(msg.timestamp)}
                    </span>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-700/50">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}

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
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.span
                        key={i}
                        className="h-2 w-2 rounded-full bg-[#0CF2A0]/60"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay,
                        }}
                      />
                    ))}
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
              onClick={() =>
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="sticky bottom-4 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-gray-700 bg-[#1a1a1a] transition-colors hover:bg-gray-800"
            >
              <ArrowDown className="h-4 w-4 text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
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
            <span className="flex items-center gap-1.5 rounded-md bg-[#111111]/50 px-2 py-1 text-xs text-gray-600">
              <Sparkles className="h-3 w-3" />
              AI-powered
            </span>
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
