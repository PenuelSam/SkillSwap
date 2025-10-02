'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@supabase/auth-helpers-react';
import { chatService } from '@/lib/chatService';

interface MessageButtonProps {
  profileId: string;
}

export default function MessageButton({ profileId }: MessageButtonProps) {
  const router = useRouter();
  const user = useUser();

  const handleStartChat = async () => {
    if (!user) {
      alert('You need to be logged in to send a message.');
      return;
    }

    const conversation = await chatService.getOrCreateConversation(profileId, user);
    if (conversation) {
      router.push(`/dashboard/message?conversation=${conversation.id}`);
    } else {
      alert('Failed to start conversation.');
    }
  };

  return (
    <button
      onClick={handleStartChat}
      className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Send Message
    </button>
  );
}
