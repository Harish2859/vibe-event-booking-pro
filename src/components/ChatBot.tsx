
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'bot',
      text: "Welcome! I'm here to help you plan amazing events. What type of event are you organizing? 🎊",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSuggestion = (text: string) => {
    setInputValue(text);
    handleSubmit(text);
  };

  const handleSubmit = (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = getBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("wedding")) {
      return "Ah, weddings are magical! 💍 Do you need venue, catering, or music suggestions?";
    } else if (message.includes("birthday")) {
      return "Yay! 🎂 Let's make it special. Need theme ideas or venue recommendations?";
    } else if (message.includes("corporate")) {
      return "Business is booming! 💼 Want help with venue, catering or speakers?";
    } else if (message.includes("conference")) {
      return "Professional conferences are great! 🎯 Looking for speakers, venues, or tech setup?";
    } else if (message.includes("help")) {
      return "I'm here to help! You can ask me about event planning, venues, catering, or any other event-related questions. What would you like to know?";
    } else {
      return `That's interesting! Tell me more about your "${userMessage}" event. 💡 How can I assist you with the planning?`;
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setMessageCount(0);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={toggleChat}
          className={`relative w-16 h-16 rounded-full border-none cursor-pointer transition-all duration-300 ease-out flex items-center justify-center overflow-hidden ${
            isOpen 
              ? 'bg-gradient-to-r from-teal-400 to-teal-600 rotate-180' 
              : 'bg-gradient-to-r from-red-400 to-red-600 hover:scale-105 hover:-translate-y-1'
          } shadow-lg hover:shadow-xl`}
          style={{
            boxShadow: isOpen 
              ? '0 12px 40px rgba(20, 184, 166, 0.4)' 
              : '0 8px 32px rgba(239, 68, 68, 0.4)'
          }}
        >
          <span className={`text-2xl text-white transition-all duration-300 ${isOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
            🎉
          </span>
          <span className={`text-2xl text-white absolute transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            ✕
          </span>
          
          {messageCount > 0 && !isOpen && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce">
              {messageCount}
            </div>
          )}
        </button>

        <div className={`absolute bottom-20 right-0 w-96 h-[550px] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 transition-all duration-400 ease-out ${
          isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-5 scale-90 pointer-events-none'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-5 rounded-t-3xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-lg font-semibold">EventBot Assistant</span>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-sm opacity-90 font-light">
                Ready to help you plan the perfect event! ✨
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-5 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div className={`flex items-start gap-3 max-w-xs ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md">
                    {message.type === 'user' ? (user?.name?.charAt(0) || 'U') : '🤖'}
                  </div>
                  <div className={`rounded-2xl p-3 max-w-60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md' 
                      : 'bg-white/90 text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold opacity-80">
                        {message.type === 'user' ? 'You' : 'EventBot'}
                      </span>
                      <span className="text-xs opacity-70">{message.timestamp}</span>
                    </div>
                    <div className="text-sm">{message.text}</div>
                    
                    {message.id === 'welcome' && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {['Wedding', 'Birthday', 'Corporate', 'Conference'].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSuggestion(suggestion)}
                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs hover:bg-blue-200 transition-colors border border-blue-200"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-start gap-3 max-w-xs">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md">
                    🤖
                  </div>
                  <div className="bg-white/90 rounded-2xl rounded-bl-md p-3 border border-gray-200 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-5 bg-white/90 backdrop-blur-md rounded-b-3xl border-t border-gray-200">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex gap-3 items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-full outline-none focus:border-blue-500 focus:shadow-md transition-all duration-300 bg-white/90"
                required
              />
              <button
                type="submit"
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                ➤
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 480px) {
          .chat-window {
            width: 90vw !important;
            right: 5vw !important;
            height: 70vh !important;
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ChatBot;
