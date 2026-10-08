import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, X, Minimize2, Maximize2, User, RefreshCw, AlertCircle } from 'lucide-react';
import { aiService } from '../../../services/api';

export default function AIChatDrawer({ isOpen, onClose, currentContext = {} }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Bonjour ! Je suis l'intelligence décisionnelle et opérationnelle d'AZ PULSE. Comment puis-je vous assister sur vos opportunités, relances ou documents ?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId] = useState(() => `conv-${Date.now().toString(36)}`);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiService.chat(query, conversationId, currentContext);
      const assistantMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: res.response || "Réponse non disponible.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: res.metadata,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          isError: true,
          text: "Désolé, impossible de joindre le service d'IA actuellement. Veuillez réessayer.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex flex-col transition-all duration-300 shadow-2xl rounded-2xl border border-white/20 backdrop-blur-xl ${
        minimized ? 'h-14 w-80 bg-[#0B2545]/95 text-white' : 'h-[580px] w-[420px] bg-slate-900/95 text-slate-100'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#003366]/40 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="font-semibold text-sm tracking-wide text-white flex items-center gap-1.5">
              AZ Hermes AI
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[10px] text-slate-300">Agent connecté • LLM Gemini 2.5</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition"
            title={minimized ? "Agrandir" : "Réduire"}
          >
            {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-300 transition"
            title="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 text-white shadow-sm mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : m.isError
                      ? 'bg-red-950/60 border border-red-500/30 text-red-200 rounded-tl-none'
                      : 'bg-white/10 border border-white/10 text-slate-100 rounded-tl-none backdrop-blur-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-70">
                    <span>{m.time}</span>
                  </div>
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-white shadow-sm mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                </div>
                <span className="italic">L'agent formule sa réponse...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick context pills */}
          <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto text-[10px] border-t border-white/5 bg-black/20">
            <button
              onClick={() => setInput("Analyse mes opportunités à relancer en priorité.")}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-blue-300 border border-blue-400/20 whitespace-nowrap"
            >
              🎯 Opportunités clés
            </button>
            <button
              onClick={() => setInput("Quelles recommandations pour améliorer le taux de clôture ?")}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-blue-300 border border-blue-400/20 whitespace-nowrap"
            >
              📈 Conseils pipeline
            </button>
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-[#071326]/60 rounded-b-2xl flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez une question à l'IA..."
              disabled={loading}
              className="flex-1 bg-white/10 text-white placeholder-slate-400 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-blue-400 border border-white/10"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
