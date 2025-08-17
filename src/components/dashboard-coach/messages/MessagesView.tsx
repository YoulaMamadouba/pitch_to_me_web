'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MoreVertical, 
  Paperclip, 
  Mic, 
  Smile, 
  Send, 
  ArrowLeft,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';
import Image from 'next/image';

// Types
type Message = {
  id: string;
  sender: 'me' | 'them';
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  isFirstInGroup?: boolean;
};

type Conversation = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
};

// Données de démonstration
const demoConversations: Conversation[] = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Jean Dupont',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
      role: 'Étudiant - Niveau Intermédiaire',
      isOnline: true,
    },
    lastMessage: 'Je vais préparer les slides pour notre prochaine session',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unreadCount: 2,
    messages: [
      {
        id: '1-1',
        sender: 'them',
        content: 'Bonjour, comment allez-vous ?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        status: 'read',
        isFirstInGroup: true,
      },
      {
        id: '1-2',
        sender: 'me',
        content: 'Très bien merci, et vous ?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: 'read',
        isFirstInGroup: true,
      },
      {
        id: '1-3',
        sender: 'them',
        content: 'Je vais bien aussi, merci !',
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
        status: 'read',
      },
      {
        id: '1-4',
        sender: 'them',
        content: 'Je vais préparer les slides pour notre prochaine session',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        status: 'delivered',
      },
    ],
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Marie Martin',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces',
      role: 'Étudiante - Niveau Avancé',
      isOnline: false,
    },
    lastMessage: 'Merci pour vos précieux conseils !',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    messages: [
      {
        id: '2-1',
        sender: 'them',
        content: 'Bonjour, je vous remercie pour votre aide',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        status: 'read',
        isFirstInGroup: true,
      },
      {
        id: '2-2',
        sender: 'me',
        content: 'Je vous en prie, c\'est avec plaisir !',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5), // 2.5 hours ago
        status: 'read',
        isFirstInGroup: true,
      },
      {
        id: '2-3',
        sender: 'them',
        content: 'Merci pour vos précieux conseils !',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: 'read',
      },
    ],
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Groupe Formation RH',
      avatar: 'https://images.unsplash.com/photo-1579403124614-197f69d8187b?w=200&h=200&fit=crop&crop=faces',
      role: 'Groupe - 5 participants',
      isOnline: true,
    },
    lastMessage: 'Sophie: La réunion est reportée à demain',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    unreadCount: 5,
    messages: [
      {
        id: '3-1',
        sender: 'them',
        content: 'Bonjour à tous, je vous rappelle notre réunion demain à 14h',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        status: 'read',
        isFirstInGroup: true,
      },
      {
        id: '3-2',
        sender: 'me',
        content: 'Merci pour le rappel, je serai présent',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20), // 20 hours ago
        status: 'read',
        isFirstInGroup: true,
      },
      {
        id: '3-3',
        sender: 'them',
        content: 'Sophie: La réunion est reportée à demain',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        status: 'delivered',
      },
    ],
  },
];

const MessagesView = () => {
  const [conversations, setConversations] = useState<Conversation[]>(demoConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filtre les conversations selon la recherche
  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sélectionne une conversation
  const selectConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      // Marquer les messages comme lus
      const updatedConversations = conversations.map(c => {
        if (c.id === conversationId) {
          return { ...c, unreadCount: 0 };
        }
        return c;
      });
      setConversations(updatedConversations);
      setSelectedConversation(conversation);
    }
  };

  // Envoie un nouveau message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      content: newMessage,
      timestamp: new Date(),
      status: 'sent',
      isFirstInGroup: true,
    };

    // Mise à jour de la conversation actuelle
    const updatedConversation = {
      ...selectedConversation,
      lastMessage: newMessage,
      lastMessageTime: new Date(),
      messages: [...selectedConversation.messages, newMsg],
    };

    // Mise à jour de la liste des conversations
    const updatedConversations = conversations.map(c => 
      c.id === selectedConversation.id ? updatedConversation : c
    );

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversation);
    setNewMessage('');
  };

  // Fait défiler vers le bas automatiquement
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  // Gestion de la touche Entrée pour envoyer un message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Formatage de la date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Hier';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    }
    return date.toLocaleDateString();
  };

  // Composant d'indicateur d'état du message
  const MessageStatus = ({ status }: { status: Message['status'] }) => {
    switch (status) {
      case 'sent':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-900 rounded-xl overflow-hidden">
      {/* Liste des conversations */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 border-r border-gray-800 bg-gray-900`}>
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white mb-2">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher des conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 hover:bg-gray-800/50 cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-gray-800/70' : ''
                  }`}
                  onClick={() => selectConversation(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={conversation.user.avatar}
                          alt={conversation.user.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {conversation.user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white truncate">{conversation.user.name}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {formatDate(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{conversation.user.role}</span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
              <p>Aucune conversation trouvée</p>
              <p className="text-sm mt-2">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </div>

      {/* Zone de conversation */}
      {selectedConversation ? (
        <div className="flex flex-col w-full md:w-2/3 bg-gray-900">
          {/* En-tête de la conversation */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <button 
                className="md:hidden p-1 rounded-full hover:bg-gray-800"
                onClick={() => setSelectedConversation(null)}
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={selectedConversation.user.avatar}
                    alt={selectedConversation.user.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedConversation.user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-white">{selectedConversation.user.name}</h3>
                <p className="text-xs text-gray-400">
                  {selectedConversation.user.isOnline ? 'En ligne' : 'Hors ligne'}
                </p>
              </div>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
            <div className="text-center mb-4">
              <span className="px-3 py-1 text-xs text-gray-500 bg-gray-800 rounded-full">
                {new Date(selectedConversation.messages[0]?.timestamp).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <AnimatePresence>
              {selectedConversation.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-2 ${
                      message.sender === 'me'
                        ? 'bg-yellow-500 text-white rounded-br-none'
                        : 'bg-gray-800 text-white rounded-bl-none'
                    }`}
                  >
                    {(message.isFirstInGroup || index === 0) && (
                      <div className="text-xs font-medium mb-1">
                        {message.sender === 'me' ? 'Vous' : selectedConversation.user.name.split(' ')[0]}
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.sender === 'me' && (
                        <MessageStatus status={message.status} />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          {/* Zone de saisie */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <textarea
                  placeholder="Écrivez un message..."
                  className="w-full px-4 py-3 pr-12 bg-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                  rows={1}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button
                className="p-2 rounded-full bg-yellow-500 text-black hover:bg-yellow-600 transition-colors"
                onClick={sendMessage}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-col items-center justify-center w-2/3 bg-gray-900/50 text-center p-8">
          <div className="max-w-md">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Sélectionnez une conversation</h3>
            <p className="text-gray-400 mb-6">
              Choisissez une conversation existante ou commencez-en une nouvelle pour démarrer la discussion.
            </p>
            <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors">
              Nouveau message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesView;
