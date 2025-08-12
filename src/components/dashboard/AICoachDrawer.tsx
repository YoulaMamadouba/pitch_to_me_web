'use client';

import { useState, useEffect, useRef } from 'react';
import type { JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Paperclip, Send, MessageSquare, Mic, X, Check, ChevronDown, Video, VideoOff, BarChart3, Zap, MessageCircle, User, Activity, Award, MessageSquareText } from 'lucide-react';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  content: string | JSX.Element;
  timestamp: string;
  type?: 'text' | 'exercise' | 'quick-actions';
}

interface AICoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AICoachDrawer({ isOpen, onClose }: AICoachDrawerProps) {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      content: "Hello! I'm Alex, your AI speaking coach. I've analyzed your recent performance in Module 6. How can I help you improve today? 🎯",
      timestamp: '2:34 PM',
      type: 'text'
    },
    {
      id: 2,
      sender: 'user',
      content: "I'm struggling with my hand gestures. They feel awkward and unnatural.",
      timestamp: '2:35 PM',
      type: 'text'
    },
    {
      id: 3,
      sender: 'ai',
      content: (
        <div>
          <p className="mb-3">I understand! Based on your last recording, I noticed you tend to keep your hands close to your body. Here are 3 specific exercises:</p>
          <div className="space-y-3">
            <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-800/50">
              <p className="text-blue-400 font-medium text-sm">Exercise 1: Mirror Practice</p>
              <p className="text-white/90 text-sm">Practice in front of a mirror for 5 minutes daily</p>
            </div>
            <div className="bg-green-900/30 rounded-xl p-4 border border-green-800/50">
              <p className="text-green-400 font-medium text-sm">Exercise 2: Box Technique</p>
              <p className="text-white/90 text-sm">Imagine a box around your torso and gesture outside it</p>
            </div>
            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-800/50">
              <p className="text-purple-400 font-medium text-sm">Exercise 3: VR Practice</p>
              <p className="text-white/90 text-sm">Try the "Boardroom" VR scene for realistic practice</p>
            </div>
          </div>
        </div>
      ),
      timestamp: '2:36 PM',
      type: 'exercise'
    },
    {
      id: 4,
      sender: 'ai',
      content: (
        <div>
          <p className="mb-3">Quick actions for you:</p>
          <div className="space-y-2">
            <button className="w-full bg-yellow-500/90 hover:bg-yellow-400 transition-colors text-black font-medium py-2.5 px-4 rounded-xl text-sm flex items-center justify-center">
              <Video className="w-4 h-4 mr-2" /> Record Practice Session
            </button>
            <button className="w-full bg-cyan-600 hover:bg-cyan-500 transition-colors text-white font-medium py-2.5 px-4 rounded-xl text-sm flex items-center justify-center">
              <VideoOff className="w-4 h-4 mr-2" /> Start VR Training
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-500 transition-colors text-white font-medium py-2.5 px-4 rounded-xl text-sm flex items-center justify-center">
              <BarChart3 className="w-4 h-4 mr-2" /> View Progress Report
            </button>
          </div>
        </div>
      ),
      timestamp: '2:37 PM',
      type: 'quick-actions'
    }
  ]);

  const quickReplies = [
    { text: 'Voice tips', icon: <MessageCircle className="w-4 h-4 mr-2" /> },
    { text: 'Body language', icon: <User className="w-4 h-4 mr-2" /> },
    { text: 'Confidence', icon: <Award className="w-4 h-4 mr-2" /> },
    { text: 'VR training', icon: <Activity className="w-4 h-4 mr-2" /> },
    { text: 'Feedback', icon: <MessageSquareText className="w-4 h-4 mr-2" /> }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses: Message[] = [
        {
          id: messages.length + 2,
          sender: 'ai',
          content: "I've analyzed your request. Here are some personalized suggestions based on your progress...",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        }
      ];
      
      setMessages(prev => [...prev, ...aiResponses]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
                     {/* Drawer */}
           <motion.div
             initial={{ x: '100%' }}
             animate={{ x: 0 }}
             exit={{ x: '100%' }}
             transition={{ type: 'spring', damping: 25, stiffness: 200 }}
             className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white z-50 shadow-2xl flex flex-col"
           >
             {/* Header */}
             <header className="bg-black/40 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between flex-shrink-0">
               <div className="flex items-center space-x-4">
                 <button 
                   onClick={onClose}
                   className="text-gray-300 hover:text-white transition-colors p-2"
                 >
                   <X size={24} />
                 </button>
                 <div className="flex items-center space-x-3">
                   <div className="relative">
                     <div className="w-12 h-12 rounded-full bg-yellow-500/20 border-2 border-yellow-400/80 overflow-hidden">
                       <img 
                         src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                         alt="AI Coach"
                         className="w-full h-full object-cover"
                       />
                     </div>
                     <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                   </div>
                   <div>
                     <h1 className="font-semibold">Alex AI Coach</h1>
                     <p className="text-xs text-green-400 flex items-center">
                       <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                       Online
                     </p>
                   </div>
                 </div>
               </div>
               <button className="text-gray-300 hover:text-white p-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                 </svg>
               </button>
             </header>

             {/* Chat Container */}
             <div className="flex-1 overflow-y-auto p-4 space-y-6">
               <div className="max-w-full">
                 <AnimatePresence>
                   {messages.map((message) => (
                     <motion.div
                       key={message.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.3 }}
                       className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                     >
                       <div className={`max-w-[90%] w-full ${message.sender === 'user' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900' : 'bg-gray-800/70 backdrop-blur-sm border border-white/10'} rounded-2xl p-4 shadow-lg`}>
                         {typeof message.content === 'string' ? (
                           <p className="text-sm">{message.content}</p>
                         ) : (
                           message.content
                         )}
                         <p className={`text-xs mt-1.5 ${message.sender === 'user' ? 'text-gray-800' : 'text-gray-400'}`}>
                           {message.timestamp}
                         </p>
                       </div>
                     </motion.div>
                   ))}
                   
                   {isTyping && (
                     <motion.div
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-full w-fit"
                     >
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                     </motion.div>
                   )}
                   
                   <div ref={messagesEndRef} />
                 </AnimatePresence>
               </div>
             </div>

             {/* Input Area */}
             <div className="bg-gradient-to-t from-black to-transparent p-4 flex-shrink-0">
               <div className="max-w-full">
                 {showSuggestions && (
                   <div className="flex flex-wrap gap-2 mb-3">
                     {quickReplies.map((reply, index) => (
                       <button
                         key={index}
                         onClick={() => handleQuickReply(reply.text)}
                         className="bg-gray-800 hover:bg-gray-700 text-white/90 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center"
                       >
                         {reply.icon}
                         {reply.text}
                       </button>
                     ))}
                   </div>
                 )}
                 
                 <form onSubmit={handleSendMessage} className="relative">
                   <button 
                     type="button"
                     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                     onClick={() => setShowSuggestions(!showSuggestions)}
                   >
                     <ChevronDown className={`w-5 h-5 transition-transform ${showSuggestions ? 'rotate-180' : ''}`} />
                   </button>
                   
                   <input
                     ref={inputRef}
                     type="text"
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     placeholder="Ask me anything about speaking..."
                     className="w-full bg-gray-800/80 backdrop-blur-sm border border-white/10 rounded-full py-3 pl-12 pr-16 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all"
                   />
                   
                   <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                     <button 
                       type="button"
                       className="text-gray-400 hover:text-white transition-colors p-2"
                       onClick={() => {}}
                     >
                       <Paperclip className="w-5 h-5" />
                     </button>
                     <button 
                       type="button" 
                       className="text-gray-400 hover:text-white transition-colors p-2"
                       onClick={() => {}}
                     >
                       <Mic className="w-5 h-5" />
                     </button>
                     <button 
                       type="submit" 
                       className={`p-2 rounded-full transition-colors ${inputValue.trim() ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'text-gray-500 cursor-not-allowed'}`}
                       disabled={!inputValue.trim()}
                     >
                       <Send className="w-5 h-5" />
                     </button>
                   </div>
                 </form>
               </div>
             </div>
           </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
