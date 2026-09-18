'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send, Bot, Sparkles, User, ArrowUpRight } from 'lucide-react';
import { api, AGENCY_METADATA } from '@/lib/api';

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}

export const ChatbotWidget: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I am the Infotech AI Consultant. How can I assist you with your software development, AI automation, or quote requests today?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputValue).trim();
    if (!text || isSending) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInputValue('');
    setIsSending(true);

    try {
      const chatHistory = newMessages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await api.public.chatAI(text, chatHistory);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.response || "Thank you for reaching out! We've received your request."
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `You can reach our Founder Mohammad Shahabuddin directly at ${AGENCY_METADATA.email} or on LinkedIn!`
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-3 px-4 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold shadow-2xl shadow-cyan-500/40 hover:scale-105 transition-all duration-300 group border border-cyan-300/30"
          aria-label="Open AI Assistant"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-100"></span>
          </span>
          <MessageSquare className="w-5 h-5 text-white" />
          <span className="text-sm tracking-wide hidden sm:inline">AI Consultant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[550px] max-h-[80vh] flex flex-col rounded-3xl border border-cyan-500/30 bg-slate-950/95 shadow-2xl shadow-cyan-950/80 backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Infotech AI Assistant
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Active • Online 24/7
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
            <button
              onClick={() => handleSendMessage("What are your service pricing rates?")}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-950/60 hover:text-cyan-300 border border-slate-700 text-slate-300 whitespace-nowrap transition-colors"
            >
              💰 Pricing
            </button>
            <button
              onClick={() => handleSendMessage("Who is the founder of Infotech Software?")}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-950/60 hover:text-cyan-300 border border-slate-700 text-slate-300 whitespace-nowrap transition-colors"
            >
              👤 Founder Info
            </button>
            <button
              onClick={() => handleSendMessage("What is your office location?")}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-950/60 hover:text-cyan-300 border border-slate-700 text-slate-300 whitespace-nowrap transition-colors"
            >
              📍 Office Map
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-4 py-2.5 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse">
                <Bot className="w-4 h-4" />
                <span>Infotech AI is formulating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about AI, Web apps, or quote..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isSending}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500/80"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isSending}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
