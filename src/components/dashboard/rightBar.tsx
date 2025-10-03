import { motion, AnimatePresence } from 'framer-motion';

import { IoChatbubbleEllipsesSharp, IoCloseSharp } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { Conversation } from '@/lib/chatService';
import ConversationList from '../chat/conversationList';
import ChatWindow from '../chat/chatWindow';
import MatchSuggestions from './matchSuggestions';
import { supabaseClient } from '@/lib/supabaseClient';
import { useUser } from '@supabase/auth-helpers-react';
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";

interface RightSidebarProps {
  userId: string;
  isChatExpanded: boolean;
  setIsChatExpanded: (expanded: boolean) => void;
}

export default function RightSidebar({
  userId,
  isChatExpanded,
  setIsChatExpanded,
}: RightSidebarProps) {

  
const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [userSkillsTags, setUserSkillsTags] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;
    // Fetch user's skill tags
    const fetchUserSkillTags = async () => {
      const { data: skillPosts } = await supabaseClient
        .from("skill_posts")
        .select("tags")
        .eq("user_id", userId);

      const tags = (skillPosts || [])
        .flatMap((post) => post.tags || [])
        .filter((value, index, self) => self.indexOf(value) === index); // unique tags

      setUserSkillsTags(tags);
    };

    fetchUserSkillTags();
  }, [userId]);



  // Function to go back to conversation list from chat window (like mobile back button)
  const handleBack = () => setSelectedConversation(null);

  return (
    <div className={`
            hidden  fixed top-0 left-0 z-50 border-l py-20 md:flex flex-col items-center gap-5 h-full w-[350px] overflow-x-hidden bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out lg:translate-x-0
            lg:static lg:z-auto
          `}>

      <div className="w-full h-full bg-white px-4">
      {/* Other sidebar content like chat toggle */}
      <MatchSuggestions userId={userId} />
    </div>
      {/* Chat Toggle Button fixed at bottom right */}
      <div className="fixed bottom-0 left-4 right-4 z-50">
        {!isChatExpanded ? (
          <div className='flex items-center justify-between shadow-2xl  bg-white w-full p-4  rounded-t-2xl'>
            <div><p className=" text-[18px] md:leading-[1.8] leading-[1.6] tracking-tight font-HelveticaBold">Messages</p></div>
            <MdOutlineKeyboardDoubleArrowUp fontSize={28} className='cursor-pointer'  onClick={() => setIsChatExpanded(true)}/>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsChatExpanded(false);
              setSelectedConversation(null);
            }}
            aria-label="Close Chat"
            className="p-3 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition"
          >
            <IoCloseSharp size={28} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isChatExpanded && (
          <motion.aside
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 right-0 top-10 w-full bg-white shadow-lg   flex flex-col z-40"
          >
            {/* Show ConversationList if no conversation selected */}
            {!selectedConversation ? (
              <>
                <div className="p-4 border-b border-gray-200 shadow-2xl  flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Chat</h2>
                  <button
                    onClick={() => setIsChatExpanded(false)}
                    aria-label="Close Chat"
                    className="text-red-600 font-bold"
                  >
                    ×
                  </button>
                </div>
                <ConversationList
                  onSelectConversation={setSelectedConversation}
                  selectedConversationId={selectedConversation?.id}
                />
              </>
            ) : (
              <>
                {/* Mobile-style header with back button */}
                <div className="p-4 border-b border-gray-200 flex items-center space-x-4">
                  <button
                    onClick={handleBack}
                    aria-label="Back to conversations"
                    className="text-blue-600 font-semibold"
                  >
                    &larr; Back
                  </button>
                  <h3 className="font-semibold text-lg truncate">
                    {selectedConversation.other_user?.display_name || 'Chat'}
                  </h3>
                </div>
                <ChatWindow conversation={selectedConversation} />
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
