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
      className="px-4 py-2 cursor-pointer bg-black text-white rounded-full font-HelveticaMid hover:bg-black/50 transition-colors"
    >
      Send Message
    </button>
  );
}
