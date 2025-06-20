import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Conversation, User } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical, 
  Search,
  ArrowLeft,
  Image,
  File,
  Mic,
  X
} from 'lucide-react';

interface ChatInterfaceProps {
  user: User;
  conversations: Conversation[];
  activeConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
  onSendMessage: (conversationId: string, message: string, attachments?: any[]) => void;
  onStartConversation: (userId: string) => void;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  user,
  conversations,
  activeConversation,
  onSelectConversation,
  onSendMessage,
  onStartConversation,
  onClose
}) => {
  const { isDark } = useTheme();
  const { addNotification } = useNotifications();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversation);

  useEffect(() => {
    if (activeConversation) {
      // Load messages for active conversation
      const savedMessages = localStorage.getItem(`messages-${activeConversation}`);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(parsed);
      } else {
        setMessages([]);
      }
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && activeConversation) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        conversationId: activeConversation,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        receiverId: activeConv?.participants.find(p => p !== user.id) || '',
        message: newMessage.trim(),
        messageType: 'text',
        timestamp: new Date(),
        read: false
      };

      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      localStorage.setItem(`messages-${activeConversation}`, JSON.stringify(updatedMessages));
      
      onSendMessage(activeConversation, newMessage.trim());
      setNewMessage('');

      // Add notification for receiver
      const receiver = activeConv?.participantDetails.find(p => p.id !== user.id);
      if (receiver) {
        addNotification({
          type: 'message',
          title: 'New Message',
          message: `${user.name} sent you a message`,
          fromUser: {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          },
          read: false
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantDetails.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg w-full max-w-6xl h-[80vh] flex overflow-hidden`}>
        {/* Conversations List */}
        <div className={`w-1/3 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-r flex flex-col`}>
          <div className={`p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Messages
              </h2>
              <button
                onClick={onClose}
                className={`p-2 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center">
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No conversations yet
                </p>
              </div>
            ) : (
              filteredConversations.map(conversation => {
                const otherParticipant = conversation.participantDetails.find(p => p.id !== user.id);
                const isActive = activeConversation === conversation.id;
                
                return (
                  <div
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isActive 
                        ? isDark ? 'bg-gray-700' : 'bg-blue-50'
                        : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          {otherParticipant?.avatar ? (
                            <img 
                              src={otherParticipant.avatar} 
                              alt={otherParticipant.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span className="text-white font-medium">
                              {otherParticipant?.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {otherParticipant?.name}
                          </h3>
                          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {conversation.lastMessage?.message || 'No messages yet'}
                          </p>
                          {conversation.unreadCount[user.id] > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conversation.unreadCount[user.id]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConversation && activeConv ? (
            <>
              {/* Chat Header */}
              <div className={`p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-b flex items-center justify-between`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    {activeConv.participantDetails.find(p => p.id !== user.id)?.avatar ? (
                      <img 
                        src={activeConv.participantDetails.find(p => p.id !== user.id)?.avatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-white font-medium">
                        {activeConv.participantDetails.find(p => p.id !== user.id)?.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {activeConv.participantDetails.find(p => p.id !== user.id)?.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activeConv.participantDetails.find(p => p.id !== user.id)?.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className={`p-2 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}>
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className={`p-2 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}>
                    <Video className="w-5 h-5" />
                  </button>
                  <button className={`p-2 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}>
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => {
                  const isOwn = message.senderId === user.id;
                  const showDate = index === 0 || 
                    formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                  
                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center my-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn 
                            ? 'bg-blue-600 text-white' 
                            : isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            isOwn 
                              ? 'text-blue-100' 
                              : isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className={`p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                <div className="flex items-end space-x-2">
                  <div className="flex space-x-1">
                    <button
                      onClick={handleFileUpload}
                      className={`p-2 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className={`p-2 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}>
                      <Image className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={1}
                      className={`w-full px-4 py-2 border ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                    />
                  </div>
                  <div className="flex space-x-1">
                    <button className={`p-2 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-colors`}>
                      <Smile className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className={`w-16 h-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Send className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Select a conversation
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            // Handle file upload
            console.log('Files selected:', e.target.files);
          }}
        />
      </div>
    </div>
  );
};

export default ChatInterface;