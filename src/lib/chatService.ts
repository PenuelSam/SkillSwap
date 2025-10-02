// lib/chatService.ts
import { supabaseClient as supabase } from "@/lib/supabaseClient"; // your existing client import
import { RealtimeChannel } from "@supabase/supabase-js";

export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  created_at: string;
  updated_at: string;
  other_user?: {
    id: string;
    display_name: string;
    avatar_url: string;
  };
  last_message?: {
    content: string;
    created_at: string;
  };
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender?: {
    display_name: string;
    avatar_url: string;
  };
}

class ChatService {
  // Get or create conversation between two users
  async getOrCreateConversation(otherUserId: string, loggedInUser: { id: string } | null): Promise<Conversation | null> {
    if (!loggedInUser) return null;
    const userId = loggedInUser.id;

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("*")
      .or(`and(participant_1.eq.${userId},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${userId})`)
      .single();

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const { data: newConversation, error } = await supabase
      .from("conversations")
      .insert({
        participant_1: userId,
        participant_2: otherUserId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      return null;
    }

    return newConversation;
  }

  // Get all conversations for current user
  async getUserConversations(loggedInUser: { id: string } | null): Promise<Conversation[]> {
    if (!loggedInUser) return [];
    const userId = loggedInUser.id;

    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        *,
        messages:messages(content, created_at)
      `)
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }

    // Enhance conversations with other user info and last message
    const enhancedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.participant_1 === userId ? conv.participant_2 : conv.participant_1;

        // Get other user's profile
        const { data: otherUser } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .eq("id", otherUserId)
          .single();

        // Get last message
        const { data: lastMessage } = await supabase
          .from("messages")
          .select("content, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        // Get unread count
        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("is_read", false)
          .neq("sender_id", userId);

        return {
          ...conv,
          other_user: otherUser,
          last_message: lastMessage,
          unread_count: unreadCount || 0,
        };
      })
    );

    return enhancedConversations;
  }

  // Get messages for a conversation
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    const { data: messages, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(display_name, avatar_url)
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    return messages;
  }

  // Send a message
  async sendMessage(conversationId: string, content: string, loggedInUser: { id: string } | null, replyToId?: string): Promise<Message | null> {
    if (!loggedInUser) return null;
    const userId = loggedInUser.id;

   const insertData: Record<string, unknown> = {
    conversation_id: conversationId,
    sender_id: userId,
    content: content.trim(),
  };

  if (replyToId) {
    insertData.reply_to = replyToId; // make sure your DB has a 'reply_to' column or adapt accordingly
  }

  const { data: message, error } = await supabase
    .from("messages")
    .insert(insertData)
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(display_name, avatar_url)
      `)
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return null;
    }

    // Update conversation timestamp
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    return message;
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId: string, loggedInUser: { id: string } | null): Promise<void> {
    if (!loggedInUser) return;
    const userId = loggedInUser.id;

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
      .eq("is_read", false);
  }

  // Subscribe to real-time messages
  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data: fullMessage } = await supabase
            .from("messages")
            .select(`
              *,
              sender:profiles!messages_sender_id_fkey(display_name, avatar_url)
            `)
            .eq("id", payload.new.id)
            .single();

          if (fullMessage) {
            callback(fullMessage);
          }
        }
      )
      .subscribe();

    return subscription;
  }

  // Unsubscribe from real-time messages
 unsubscribeFromMessages(subscription: RealtimeChannel | null | undefined) {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
}
}
export const chatService = new ChatService();
