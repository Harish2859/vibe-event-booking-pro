
import React, { useState, useEffect, useRef } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Welcome! I'm here to help you plan amazing events. What type of event are you organizing? 🎊",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showSuggestions: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(1);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setMessageCount(0);
    }
  };

  const addMessage = (type, text) => {
    const newMessage = {
      id: Date.now(),
      type,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showSuggestions: false
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("wedding")) {
      return "Ah, weddings are magical! 💍 Do you need venue, catering, or music suggestions?";
    } else if (lowerMessage.includes("birthday")) {
      return "Yay! 🎂 Let's make it special. Need theme ideas or venue recommendations?";
    } else if (lowerMessage.includes("corporate")) {
      return "Business is booming! 💼 Want help with venue, catering or speakers?";
    } else if (lowerMessage.includes("conference")) {
      return "Professional conferences! 🎯 Need help with speakers, venue, or tech setup?";
    } else if (lowerMessage.includes("help")) {
      return "I'm here to help! 😊 I can assist with event planning, venue suggestions, catering options, and more. What specific area would you like help with?";
    } else if (lowerMessage.includes("venue")) {
      return "Great choice! 🏢 For venues, consider capacity, location, parking, and amenities. What's your expected guest count?";
    } else if (lowerMessage.includes("catering")) {
      return "Delicious! 🍽️ For catering, think about dietary restrictions, service style, and budget. Any specific cuisine preferences?";
    } else {
      return `That sounds interesting! Tell me more about your "${userMessage}" event. I'd love to help you plan something amazing! 💡`;
    }
  };

  const handleSuggestion = (suggestion) => {
    setInputValue(suggestion);
    handleSubmit(null, suggestion);
  };

  const handleSubmit = (e, suggestionText = null) => {
    if (e) e.preventDefault();
    const message = suggestionText || inputValue.trim();
    
    if (message) {
      addMessage('user', message);
      setInputValue('');
      
      // Show typing indicator
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const botResponse = getBotResponse(message);
        addMessage('bot', botResponse);
      }, 1500);
    }
  };

  return (
    <>
      <style>
        {`
          .chat-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .chat-toggle {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff6b6b, #ee5a52);
            border: none;
            cursor: pointer;
            position: relative;
            box-shadow: 0 8px 32px rgba(255, 107, 107, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .chat-toggle:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 12px 40px rgba(255, 107, 107, 0.6);
          }

          .chat-toggle.active {
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
            transform: rotate(180deg);
          }

          .chat-toggle::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
          }

          .chat-icon, .close-icon {
            font-size: 24px;
            color: white;
            position: absolute;
            transition: all 0.3s ease;
          }

          .chat-toggle:not(.active) .chat-icon {
            opacity: 1;
            transform: scale(1);
          }

          .chat-toggle:not(.active) .close-icon {
            opacity: 0;
            transform: scale(0.5);
          }

          .chat-toggle.active .chat-icon {
            opacity: 0;
            transform: scale(0.5);
          }

          .chat-toggle.active .close-icon {
            opacity: 1;
            transform: scale(1);
          }

          .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: linear-gradient(135deg, #ff416c, #ff4b2b);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            animation: bounce 0.6s ease-in-out infinite alternate;
          }

          @keyframes bounce {
            0% { transform: scale(1); }
            100% { transform: scale(1.2); }
          }

          .chat-window {
            position: absolute;
            bottom: 90px;
            right: 0;
            width: 380px;
            height: 550px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            opacity: 0;
            transform: translateY(20px) scale(0.9);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .chat-window.active {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
          }

          .chat-window::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
            pointer-events: none;
          }

          .chat-header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            border-radius: 24px 24px 0 0;
            position: relative;
            overflow: hidden;
          }

          .chat-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
            animation: shimmer 3s ease-in-out infinite;
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .chat-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .chat-subtitle {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
          }

          .status-dot {
            width: 8px;
            height: 8px;
            background: #4ecdc4;
            border-radius: 50%;
            animation: pulse-dot 2s ease-in-out infinite;
          }

          @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
          }

          .chat-messages {
            height: 400px;
            overflow-y: auto;
            padding: 20px;
            scroll-behavior: smooth;
          }

          .chat-messages::-webkit-scrollbar {
            width: 6px;
          }

          .chat-messages::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 10px;
          }

          .chat-messages::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 10px;
          }

          .message {
            display: flex;
            margin-bottom: 20px;
            animation: messageSlide 0.5s ease-out;
          }

          @keyframes messageSlide {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .message.user {
            justify-content: flex-end;
          }

          .message.bot {
            justify-content: flex-start;
          }

          .message-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            position: relative;
            overflow: hidden;
          }

          .message-avatar::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
            animation: avatarShimmer 2s ease-in-out infinite;
          }

          @keyframes avatarShimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .message-bubble {
            max-width: 260px;
            padding: 12px 16px;
            border-radius: 20px;
            margin: 0 12px;
            position: relative;
            word-wrap: break-word;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }

          .message-bubble:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }

          .message.user .message-bubble {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-bottom-right-radius: 8px;
          }

          .message.bot .message-bubble {
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            border-bottom-left-radius: 8px;
            border: 1px solid rgba(0, 0, 0, 0.1);
          }

          .message-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            font-size: 12px;
          }

          .message-name {
            font-weight: 600;
          }

          .message-time {
            opacity: 0.7;
          }

          .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 15px 20px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 20px;
            margin: 0 12px;
            border-bottom-left-radius: 8px;
            animation: messageSlide 0.5s ease-out;
          }

          .typing-dot {
            width: 8px;
            height: 8px;
            background: #667eea;
            border-radius: 50%;
            animation: typingDot 1.4s ease-in-out infinite;
          }

          .typing-dot:nth-child(1) { animation-delay: 0s; }
          .typing-dot:nth-child(2) { animation-delay: 0.2s; }
          .typing-dot:nth-child(3) { animation-delay: 0.4s; }

          @keyframes typingDot {
            0%, 60%, 100% { transform: scale(0.8); opacity: 0.5; }
            30% { transform: scale(1.2); opacity: 1; }
          }

          .chat-input-area {
            padding: 20px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 0 0 24px 24px;
            display: flex;
            gap: 12px;
            align-items: center;
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(0, 0, 0, 0.1);
          }

          .chat-input {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 25px;
            font-size: 14px;
            outline: none;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.9);
          }

          .chat-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            transform: translateY(-1px);
          }

          .chat-send-btn {
            width: 45px;
            height: 45px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .chat-send-btn:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          }

          .chat-send-btn:active {
            transform: translateY(0) scale(0.95);
          }

          .event-suggestions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
          }

          .suggestion-chip {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid rgba(102, 126, 234, 0.2);
          }

          .suggestion-chip:hover {
            background: rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
          }

          @media (max-width: 480px) {
            .chat-window {
              width: 90vw;
              right: 5vw;
              height: 70vh;
            }
          }
        `}
      </style>

      <div className="chat-widget">
        <button 
          className={`chat-toggle ${isOpen ? 'active' : ''}`}
          onClick={toggleChat}
        >
          <span className="chat-icon">🎉</span>
          <span className="close-icon">✕</span>
          {!isOpen && messageCount > 0 && (
            <div className="notification-badge">{messageCount}</div>
          )}
        </button>

        <div className={`chat-window ${isOpen ? 'active' : ''}`}>
          <div className="chat-header">
            <div className="chat-title">
              <span>EventBot Assistant</span>
              <div className="status-dot"></div>
            </div>
            <div className="chat-subtitle">Ready to help you plan the perfect event! ✨</div>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div 
                  className="message-avatar" 
                  style={{
                    backgroundImage: message.type === 'user' 
                      ? "url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face')"
                      : "url('https://images.unsplash.com/photo-1553775282-20af80779df7?w=150&h=150&fit=crop&crop=face')"
                  }}
                ></div>
                <div className="message-bubble">
                  <div className="message-info">
                    <div className="message-name">{message.type === 'user' ? 'You' : 'EventBot'}</div>
                    <div className="message-time">{message.time}</div>
                  </div>
                  <div>{message.text}</div>
                  {message.showSuggestions && (
                    <div className="event-suggestions">
                      <div className="suggestion-chip" onClick={() => handleSuggestion('Wedding')}>Wedding</div>
                      <div className="suggestion-chip" onClick={() => handleSuggestion('Birthday')}>Birthday</div>
                      <div className="suggestion-chip" onClick={() => handleSuggestion('Corporate')}>Corporate</div>
                      <div className="suggestion-chip" onClick={() => handleSuggestion('Conference')}>Conference</div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div 
                  className="message-avatar" 
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1553775282-20af80779df7?w=150&h=150&fit=crop&crop=face')"
                  }}
                ></div>
                <div className="message-bubble typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSubmit}>
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Type your message..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required 
            />
            <button type="submit" className="chat-send-btn">➤</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
