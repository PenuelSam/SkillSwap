'use client';
import { useEffect, useState } from 'react';
import { chatService, Conversation } from '@/lib/chatService';
import ConversationList from '@/components/chat/conversationList';
import ChatWindow from '@/components/chat/chatWindow';
import { BsChatDots } from "react-icons/bs";
import { useUser } from '@supabase/auth-helpers-react';
import { IoIosArrowBack } from "react-icons/io";




export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const user = useUser();



const handleSelectConversation = async (conversation: Conversation) => {
  setSelectedConversation(conversation);
  if (!user) return;
  await chatService.markMessagesAsRead(conversation.id, user);
  setSelectedConversation(conversation);
  // Store selection in localStorage to persist
  localStorage.setItem('selectedConversationId', conversation.id);
};

  // Helper to reset selection, for mobile back button
  const handleBackToConversations = () => setSelectedConversation(null);

  return (
    <div className="h-full w-full flex bg-gray-50 ">
      {/* Sidebar: visible on md and up, or visible on mobile only if no selected conversation */}
      <div className={`bg-white border-r border-gray-200 overflow-y-auto
        ${selectedConversation ? 'hidden md:flex md:w-80' : 'flex w-full md:w-80'}`}
      >
        <ConversationList
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversation?.id}
        />
      </div>

      {/* Chat window: visible on md and up or visible on mobile only if a conversation selected */}
      <div className={`flex-1 flex flex-col 
        ${selectedConversation ? 'flex w-full md:block' : 'hidden md:block'}`}
      >
        {selectedConversation ? (
          <>
            {/* Mobile back button */}
            <div className="md:hidden fixed top-3 left-2 z-[999] p-2 ">
              <IoIosArrowBack
                onClick={handleBackToConversations}
                fontSize={25}
              />
               
            </div>
            <ChatWindow conversation={selectedConversation} />
          </>
        ) : (
          <div className="flex-1 flex flex-col gap-4 items-center justify-center h-full bg-white p-4 text-center text-gray-500">
             <BsChatDots fontSize={48} className="mb-4" />
            <p className="font-HelveticaMid">Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
