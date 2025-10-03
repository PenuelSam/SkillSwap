'use client';
import { useState } from 'react';
import { Conversation } from '@/lib/chatService';
import ConversationList from '@/components/chat/conversationList';
import ChatWindow from '@/components/chat/chatWindow';


export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Helper to reset selection, for mobile back button
  const handleBackToConversations = () => setSelectedConversation(null);

  return (
    <div className="h-full w-full flex bg-gray-50 ">
      {/* Sidebar: visible on md and up, or visible on mobile only if no selected conversation */}
      <div className={`bg-white border-r border-gray-200 overflow-y-auto
        ${selectedConversation ? 'hidden md:flex md:w-80' : 'flex w-full md:w-80'}`}
      >
        <ConversationList
          onSelectConversation={setSelectedConversation}
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
            <div className="md:hidden fixed top-2 right-0 z-[999] p-2 bg-white">
              <button
                onClick={handleBackToConversations}
                className="text-blue-600 hover:underline"
              >
                &larr; Back
              </button>
            </div>
            <ChatWindow conversation={selectedConversation} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white p-4 text-center text-gray-500">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
