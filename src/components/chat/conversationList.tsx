// components/chat/ConversationList.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { chatService, Conversation } from '@/lib/chatService';
import { useUser } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import { BsChatDots } from "react-icons/bs";

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

export default function ConversationList({ onSelectConversation, selectedConversationId }: ConversationListProps) {
  const user = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  

  const loadConversations = async () => {
    try {
      if (!user) return;
      const convs = await chatService.getUserConversations(user);
      setConversations(convs);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

 // components/chat/ConversationList.tsx (continued)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="bg-white h-16 px-4 flex items-center border-b border-gray-200">
        <h2 className="text-xl font-HelveticaBold text-gray-900">Messages</h2>
      </div>
      
      <div className="divide-y  divide-gray-100">
        {conversations.map((conversation) => (
          <motion.button
            key={conversation.id}
            whileHover={{ backgroundColor: '#f7f7f7' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectConversation(conversation)}
            className={`w-full p-4 text-left transition-colors ${
              selectedConversationId === conversation.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
            }`}
          >
            <div className="flex items-center  space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {conversation.other_user?.avatar_url ? (
                    <Image
                      src={conversation.other_user.avatar_url}
                      alt={conversation.other_user.display_name || 'User'}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {conversation.other_user?.display_name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                {/* {conversation.unread_count && conversation.unread_count > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                    </span>
                  </div>
                )} */}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="md:text-[14px] text-[14px] font-HelveticaMid text-gray-700">
                      {conversation.other_user?.display_name || 'Unknown User'}
                    </p>
                    <p className="md:text-[14px] text-[14px] font-HelveticaLight text-gray-700 truncate max-w-[200px]">
                      {conversation.last_message?.content || 'No messages yet'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-center space-x-1">
                    
                    {conversation.last_message && (
                      <span className="md:text-[12px] text-[12px] font-HelveticaLight text-gray-500">
                        {formatTime(conversation.last_message.created_at)}
                      </span>
                    )}
                    {conversation.unread_count && conversation.unread_count > 0 && (
                     <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-HelveticaMid">
                          {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <BsChatDots fontSize={48} className="mb-4" />
          <p className="text-center font-HelveticaMid">No conversations yet</p>
          <p className="text-sm text-center font-HelveticaMid">Start chatting with other users!</p>
        </div>
      )}
    </div>
  );
}