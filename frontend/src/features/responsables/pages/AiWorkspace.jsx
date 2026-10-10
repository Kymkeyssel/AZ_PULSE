import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, User, Sparkles, FolderKanban, FileText, AlertTriangle, CheckCircle, ChevronDown, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { aiService, workspaceService } from '../../../services/api';

const AiWorkspace = () => {
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      role: 'ai', 
      content: 'Bonjour ! Je suis Pulse AI, l’assistant de la plateforme AZ PULSE. Sélectionnez un projet pour analyser ses risques ou demandez-moi une recommandation.', 
      type: 'text' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load projects context
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await workspaceService.listProjects();
        if (res.success && Array.isArray(res.data)) {
          setProjects(res.data);
          if (res.data.length > 0) {
            setSelectedProject(res.data[0].id); // sélectionne le 1er par défaut
          }
        }
      } catch (err) {
        toast.error('Erreur lors du chargement du contexte des projets.');
      }
    };
    fetchProjects();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    
    const newMsg = { id: Date.now().toString(), role: 'user', content: userMsg, type: 'text' };
    setMessages(prev => [...prev, newMsg]);
    setIsLoading(true);
    
    try {
      const res = selectedProject
        ? await aiService.analyzeProject(selectedProject, userMsg)
        : await aiService.chat(userMsg, conversationId, { scope: 'AZ PULSE AI Workspace', project_context: 'Aucun projet sélectionné : répondre aux questions générales permises par le rôle.' });
      if (res?.conversation_id) setConversationId(res.conversation_id);
      
      let aiContent = res;
      let aiType = 'text';
      
      if (typeof res === 'string') {
        try {
          const parsed = JSON.parse(res);
          if (parsed.analysis || parsed.risks) {
            aiContent = parsed;
            aiType = 'structured';
          }
        } catch (e) {
          // texte brut
        }
      } else if (res && typeof res === 'object') {
        aiContent = res;
        aiType = 'structured';
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiContent,
        type: aiType
      }]);
    } catch (error) {
      toast.error('L\'agent a rencontré une erreur.');
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `Erreur d'analyse: ${error.message || 'Désolé, une erreur technique m\'empêche de traiter votre demande.'}`,
        type: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentProjectName = projects.find(p => String(p.id) === String(selectedProject))?.name || 'Projet';

  return (
    <div className="flex h-[calc(100vh-64px)] w-full gap-6 p-6 bg-slate-50 overflow-hidden">
      
      {/* Panneau Latéral (Contexte) */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-4">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Contexte IA</h2>
              <p className="text-xs text-slate-500">Définissez le scope de l'agent</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                <FolderKanban size={16} className="text-slate-400" />
                Projet Actif
              </label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-slate-100 border-none rounded-xl py-3 pl-4 pr-10 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  value={selectedProject || ''}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="" disabled>Sélectionnez un projet...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                <FileText size={16} className="text-slate-400" />
                Intégration Référentiels
              </label>
              <div className="bg-slate-100 rounded-xl p-3 text-xs text-slate-600 font-medium space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Symfony Context Builder (Active)
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Gemini Flash AI Agent (Active)
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Suggestion box */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-md">
           <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
             <Activity size={18} />
             Actions Proactives
           </h3>
           <button 
             onClick={() => setInput("Analyse générale du projet et de ses risques.")}
             className="w-full bg-white/20 hover:bg-white/30 transition-colors rounded-lg py-2 px-3 text-xs text-left backdrop-blur-sm mb-2 font-medium"
           >
             🔍 Diagnostic complet du projet
           </button>
           <button 
             onClick={() => setInput("Y a-t-il des risques de retard ou de dépassement budgétaire ?")}
             className="w-full bg-white/20 hover:bg-white/30 transition-colors rounded-lg py-2 px-3 text-xs text-left backdrop-blur-sm font-medium"
           >
             ⚠️ Évaluation des risques
           </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="h-16 flex-shrink-0 border-b border-slate-100 flex items-center px-6 gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm">Pulse AI · {currentProjectName}</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs text-slate-500">Proxy Symfony Authentifié • Gemini Engine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-200' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}>
                    {msg.role === 'user' ? <User size={16} className="text-slate-600" /> : <Bot size={16} className="text-white" />}
                  </div>
                  
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-slate-800 text-white rounded-2xl rounded-tr-none px-5 py-3 text-sm font-medium' : ''}`}>
                    {msg.type === 'text' && msg.role === 'ai' && (
                      <div className="bg-slate-100 rounded-2xl rounded-tl-none px-5 py-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    )}
                    
                    {msg.type === 'error' && (
                      <div className="bg-red-50 text-red-600 rounded-2xl rounded-tl-none px-5 py-3 text-sm flex items-start gap-3 border border-red-100 font-medium">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                        {msg.content}
                      </div>
                    )}

                    {msg.type === 'structured' && msg.role === 'ai' && (
                      <div className="space-y-4 w-full">
                        <div className="bg-slate-100 rounded-2xl rounded-tl-none px-5 py-4 text-sm text-slate-700 leading-relaxed font-medium">
                          {msg.content.analysis || "Analyse terminée."}
                        </div>
                        
                        {(msg.content.risks?.length > 0) && (
                          <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-5">
                            <h4 className="flex items-center gap-2 font-bold text-orange-800 text-xs uppercase tracking-wider mb-3">
                              <AlertTriangle size={16} /> Risques Identifiés ({msg.content.risks.length})
                            </h4>
                            <ul className="space-y-2">
                              {msg.content.risks.map((risk, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs font-medium text-orange-900">
                                  <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {(msg.content.recommendations?.length > 0) && (
                          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5">
                            <h4 className="flex items-center gap-2 font-bold text-emerald-800 text-xs uppercase tracking-wider mb-3">
                              <CheckCircle size={16} /> Recommandations Stratégiques ({msg.content.recommendations.length})
                            </h4>
                            <ul className="space-y-3">
                              {msg.content.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex flex-col gap-2">
                                  <div className="flex items-start gap-2 text-xs font-medium text-emerald-900">
                                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                                    {rec}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {msg.type === 'text' && msg.role === 'user' && (
                      <span>{msg.content}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                 <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-none px-5 py-4 flex gap-1.5 items-center h-[52px]">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="max-w-3xl mx-auto relative">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={selectedProject ? "Posez une question sur le projet sélectionné..." : "Posez une question à l’assistant AZ PULSE..."}
              className="w-full bg-white border border-slate-300 rounded-2xl py-3 pl-5 pr-16 text-xs font-medium text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </div>
          <div className="text-center mt-2 text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
            Pulse AI • Assistant connecté aux services IA AZ PULSE
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiWorkspace;
