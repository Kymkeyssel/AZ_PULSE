import { useState, useRef, useEffect } from 'react';
import { BotMessageSquare, X, Send, Minimize2, Plus, Copy } from 'lucide-react';

// URL du webhook n8n
// const WEBHOOK_URL = 'http://localhost:5678/webhook/9ef51172-5d81-468b-a6a4-ce279295ee8a/chat';
const WEBHOOK_URL = "http://localhost:5678/webhook/cd510b53-e8e0-4cdb-b052-3578f455d1bb"
// Identifiant de conversation exigé par le Chat Trigger n8n : constant pour
// toute la durée de la session, afin que l'agent conserve l'historique.
const SESSION_ID = `azpulse-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Bonjour ! 👋 Je suis AZ Hermes, votre assistant virtuel AZ PULSE. Comment puis-je vous accompagner aujourd'hui ?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: 'Formations & Cursus', icon: '🎓' },
    { label: 'Orientation Métiers', icon: '💼' },
    { label: 'Plateforme & Accès', icon: '🚀' },
    { label: 'Assistance & FAQ', icon: '💡' }
  ];

  // Fonction pour appeler le webhook n8n
  const callN8nWebhook = async (userMessage) => {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: userMessage,
          sessionId: SESSION_ID,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.output || data.response || data.message || "Désolé, je n'ai pas pu traiter votre demande.";
      } else {
        throw new Error('Erreur HTTP ' + response.status);
      }
    } catch (error) {
      console.warn('Webhook n8n indisponible, bascule sur le moteur AZ Hermes :', error);
      // Fallback vers les réponses locales si le webhook échoue
      return getLocalBotResponse(userMessage);
    }
  };

  // Réponses locales AZ Hermes en fallback
  const getLocalBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      return "Bonjour ! Ravi de vous accueillir sur AZ PULSE ! 👋\n\nJe suis **AZ Hermes**, votre assistant d'orientation et de guidage. Je peux vous renseigner sur :\n\n🎓 Nos cursus d'excellence (Développement, IA, Infrastructure)\n💼 Les débouchés professionnels & certifications\n🚀 L'accès à la plateforme & le processus d'admission\n\nEn quoi puis-je vous aider ?";
    }
    if (lowerMessage.includes('orientation') || lowerMessage.includes('orienter') || lowerMessage.includes('métier') || lowerMessage.includes('débouché')) {
      return "L'orientation vers les métiers technologiques est notre cœur de métier ! 🎯\n\nAZ PULSE forme aux compétences les plus recherchées :\n\n💻 **Développeur Full-Stack & Cloud** (React, Symfony, DevOps)\n🧠 **Ingénieur IA & Data** (LLM, Python, Machine Learning)\n🛡️ **Expert Cybersécurité & Réseaux**\n\nSouhaitez-vous des détails sur un parcours spécifique ?";
    }
    if (lowerMessage.includes('formation') || lowerMessage.includes('cursus') || lowerMessage.includes('cours') || lowerMessage.includes('programme')) {
      return "Nos programmes combinent théorie rigoureuse et projets pratiques en entreprise 📚 :\n\n• **Licence & Mastère Ingénierie Logicielle**\n• **Spécialisation IA & Systèmes Embarqués**\n• **Certifications Professionnelles & Alternance**\n\nVous pouvez également demander un accès via le bouton *Demander un accès* sur la page d'accueil !";
    }
    if (lowerMessage.includes('accès') || lowerMessage.includes('compte') || lowerMessage.includes('inscription') || lowerMessage.includes('plateforme')) {
      return "Pour accéder à AZ PULSE 🚀 :\n\n1. Cliquez sur **« Espace Membre »** ou **« Demander un accès »** en haut à droite.\n2. Remplissez votre demande selon votre profil (Apprenant, Collaborateur, Partenaire).\n3. Dès validation par l'administration, vous recevrez un lien d'activation sécurisé.";
    }
    if (lowerMessage.includes('merci')) {
      return "C'est un plaisir ! 😊 N'hésitez pas si vous avez d'autres questions. Je reste à votre entière disposition sur AZ PULSE !";
    }
    if (lowerMessage.includes('aide') || lowerMessage.includes('help') || lowerMessage.includes('?')) {
      return "Je suis **AZ Hermes** et je peux vous guider sur :\n\n💡 L'offre académique & formations\n💼 L'orientation et les métiers porteurs\n🚀 Les démarches d'inscription & accès\n📊 Le fonctionnement de la plateforme AZ PULSE\n\nQuelle est votre question ?";
    }

    return "Merci pour votre question ! 🧠\n\nPour vous orienter au mieux, précisez votre demande concernant nos **formations**, les **débouchés professionnels** ou l'**accès à la plateforme AZ PULSE**.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Essayer d'abord le webhook n8n
      const botResponse = await callN8nWebhook(currentInput);

      const botMessage = {
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
} catch {
      // En cas d'erreur, utiliser les réponses locales
      const botResponse = getLocalBotResponse(currentInput);
      const botMessage = {
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action) => {
    const userMessage = {
      text: action,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowQuickActions(false);
    setIsTyping(true);

    try {
      const botResponse = await callN8nWebhook(action);
      const botMessage = {
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch {
      const botResponse = getLocalBotResponse(action);
      const botMessage = {
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-tr from-[#004ad1] via-blue-600 to-[#00a6fb] text-white rounded-full shadow-2xl z-50 flex items-center justify-center group hover:scale-110 active:scale-95 transition-all ring-4 ring-white/20"
          style={{
            boxShadow: '0 10px 35px rgba(0, 74, 209, 0.45)',
            width: '60px',
            height: '60px'
          }}
          title="Ouvrir AZ Hermes"
          type="button"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-white" />
          </span>
          <BotMessageSquare size={28} className="text-white drop-shadow group-hover:rotate-6 transition-transform" />
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 bg-[#0b192c] text-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-700/80 transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          }`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#001026] via-[#0b2545] to-[#004ad1] text-white px-5 py-3.5 rounded-t-2xl flex justify-between items-center border-b border-white/10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#004ad1] to-[#00a6fb] text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-[#fbbf24]/40 shadow-sm shrink-0">
                AZ
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-white">
                  AZ Hermes
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-blue-200">Assistant Virtuel AZ PULSE</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="hover:bg-white/15 p-1.5 rounded-lg text-white transition-colors"
                title="Sujets rapides"
                type="button"
              >
                <Plus size={18} />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/15 p-1.5 rounded-lg text-white transition-colors"
                title="Minimiser"
                type="button"
              >
                <Minimize2 size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/15 p-1.5 rounded-lg text-white transition-colors"
                title="Fermer"
                type="button"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Actions */}
              {showQuickActions && (
                <div className="border-b border-slate-700/60 p-3 grid grid-cols-2 gap-2 bg-[#001026]/90">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.label)}
                      className="border border-slate-700/80 hover:border-[#00a6fb] rounded-xl p-2.5 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-2 bg-slate-800/80 hover:bg-[#004ad1]/30"
                      type="button"
                    >
                      <span>{action.icon}</span>
                      <span className="truncate">{action.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#001026] to-[#0b192c]">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="flex gap-2.5 animate-fade-in"
                    style={{
                      justifyContent: message.isBot ? 'flex-start' : 'flex-end'
                    }}
                  >
                    {message.isBot && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-extrabold bg-gradient-to-br from-[#004ad1] to-[#001026] ring-1 ring-[#fbbf24]/50 shadow-sm">
                          AZ
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-1 max-w-[80%]">
                      <div
                        className="px-4 py-3 rounded-2xl"
                        style={{
                          background: message.isBot
                            ? '#1e293b'
                            : 'linear-gradient(135deg, #004ad1 0%, #0077b6 100%)',
                          color: '#ffffff',
                          borderBottomLeftRadius: message.isBot ? '4px' : '18px',
                          borderBottomRightRadius: message.isBot ? '18px' : '4px',
                          boxShadow: message.isBot
                            ? '0 2px 8px rgba(0, 0, 0, 0.25)'
                            : '0 4px 14px rgba(0, 74, 209, 0.35)'
                        }}
                      >
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 px-2">
                        {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {message.isBot && (
                      <div className="flex gap-1 self-end">
                        <button
                          onClick={() => copyToClipboard(message.text)}
                          className="opacity-0 hover:opacity-100 transition-opacity p-1 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white"
                          title="Copier"
                          type="button"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-2.5">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-extrabold bg-gradient-to-br from-[#004ad1] to-[#001026] ring-1 ring-[#fbbf24]/50 shadow-sm">
                        AZ
                      </div>
                    </div>
                    <div className="rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5 bg-[#1e293b] border border-slate-700/60">
                      <div
                        className="w-2 h-2 rounded-full animate-bounce bg-[#00a6fb]"
                        style={{ animationDelay: '0.2s' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce bg-[#fbbf24]"
                        style={{ animationDelay: '0.4s' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce bg-emerald-400"
                        style={{ animationDelay: '0.6s' }}
                      />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3.5 border-t border-slate-700/80 bg-[#001026] rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Posez votre question à AZ Hermes..."
                    className="flex-1 border border-slate-700 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00a6fb] focus:border-transparent transition-all bg-slate-900/90 text-white placeholder:text-slate-400"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="bg-gradient-to-br from-[#004ad1] to-[#00a6fb] disabled:opacity-40 text-white p-2.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center shrink-0"
                    type="button"
                    title="Envoyer"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}