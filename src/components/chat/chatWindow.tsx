'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Image from 'next/image';
import { chatService, Message, Conversation } from '@/lib/chatService';
import { useUser } from '@supabase/auth-helpers-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdSend } from 'react-icons/io';
import { IoArrowUndo, IoClose } from 'react-icons/io5';
import { useSwipeable } from 'react-swipeable';

interface ChatWindowProps {
  conversation: Conversation;
}

interface SwipeableMessageProps {
  message: Message;
  isOwnMessage: boolean;
  onReply: (message: Message) => void;
  isHovered: boolean;
  onHoverChange: (id: string | null) => void;
  userId: string | undefined;
}

const SwipeableMessage = memo(function SwipeableMessage({
  message,
  isOwnMessage,
  onReply,
  isHovered,
  onHoverChange,
  userId,
}: SwipeableMessageProps) {
  const handlers = useSwipeable({
    onSwipedRight: () => onReply(message),
    delta: 30,
    trackMouse: false,
  });

  return (
    <motion.div
      {...handlers}
      onMouseEnter={() => onHoverChange(message.id)}
      onMouseLeave={() => onHoverChange(null)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 relative ${
          isOwnMessage
            ? 'bg-blue-600 text-white rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl'
            : 'bg-gray-100 text-gray-900 rounded-tl-2xl rounded-br-2xl rounded-tr-2xl'
        }`}
      >
        <p className="md:text-[14px] text-[14px] font-HelveticaMid">{message.content}</p>
        {/* {isHovered && (
          <motion.button
            onClick={() => onReply(message)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute ${isOwnMessage ? '-right-5' : '-right-5'} top-1  p-1 rounded hover:bg-gray-300`}
            aria-label="Reply to message"
          >
            <IoArrowUndo size={20} />
          </motion.button>
        )} */}
      </div>
      {/* <p className="md:text-[14px] text-[12px] font-HelveticaLight  mt-1 text-gray-500">
        {new Date(message.created_at).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })}
      </p> */}
    </motion.div>
  );
});

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useUser();


  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      try {
        const msgs = await chatService.getConversationMessages(conversation.id);
        setMessages(msgs);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    const markAsRead = async () => {
      try {
        await chatService.markMessagesAsRead(conversation.id, user);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    loadMessages();
    markAsRead();

    const subscription = chatService.subscribeToMessages(
      conversation.id,
      (message: Message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();

        if (message.sender_id !== user?.id) {
          chatService.markMessagesAsRead(conversation.id, user);
        }
      }
    );

    return () => {
      chatService.unsubscribeFromMessages(subscription);
    };
  }, [conversation.id, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !user) return;

    setSending(true);
    try {
      const message = await chatService.sendMessage(
        conversation.id,
        newMessage,
        user,
        replyTo?.id
      );
      if (message) {
        setNewMessage('');
        setMessages((prev) => [...prev, message]);
        setReplyTo(null);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full overflow-y-auto flex flex-col bg-white shadow-sm rounded-lg ">
      {/* Header */}
      <div className="p-2 md:pl-2 pl-10 border-b z-[998] border-gray-200 bg-white rounded-t-lg flex items-center space-x-2 fixed md:sticky top-0 w-full">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 rounded-full  overflow-hidden bg-gray-200">
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
        </motion.div>
        <div>
          <h3 className="md:text-[20px] text-[18px] font-HelveticaBold">{conversation.other_user?.display_name || 'Unknown User'}</h3>
          {/* <p className="md:text-[16px] text-[14px] font-HelveticaLight">Online</p> */}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 h-full overflow-y-auto p-4 md:py-10 py-20 space-y-4 scrollable-messages">
        <AnimatePresence>
          {messages.map((message) => (
            <SwipeableMessage
              key={message.id}
              message={message}
              isOwnMessage={message.sender_id === user?.id}
              onReply={setReplyTo}
              isHovered={hoveredMessageId === message.id}
              onHoverChange={setHoveredMessageId}
              userId={user?.id}
            />
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-100 text-gray-900">
              <p className="md:text-[16px] text-[14px] font-HelveticaLight">Typing...</p>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview Bar */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center px-4 py-2 bg-gray-100 border-t border-gray-300 rounded-t-md"
          >
            <p className="flex-1 text-gray-700 truncate">Replying to: {replyTo.content}</p>
            <button
              onClick={() => setReplyTo(null)}
              aria-label="Cancel reply"
              className="ml-4 p-1 rounded hover:bg-gray-300"
            >
              <IoClose size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input */}
     <form onSubmit={handleSendMessage} className="p-2 mt-5  bg-white rounded-b-lg fixed md:sticky md:bottom-0 bottom-12 w-full">
  <div className="flex space-x-2">
    <div className="relative w-full">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder={replyTo ? `Replying to: ${replyTo.content}` : 'Type a message...'}
        className="w-full rounded-full border font-interDisplayLight border-gray-300 bg-gray-50 px-4  py-3 text-sm md:text-[14px]  outline-none"
        disabled={sending}
        maxLength={1000}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {(isFocused || newMessage.trim()) && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-2 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <IoMdSend fontSize={20} />
          )}
        </motion.button>
      )}
    </div>
  </div>
</form>
    </div>
  );
}
