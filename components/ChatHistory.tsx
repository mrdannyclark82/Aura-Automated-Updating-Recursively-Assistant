import React, { useRef, useEffect } from 'react';
import { Message, FeedbackRating } from '../types';
import ChatBubble from './ChatBubble';

interface ChatHistoryProps {
  messages: Message[];
  onFeedbackSubmit: (messageId: string, feedback: FeedbackRating) => void;
  onSpeakText?: (text: string) => void;
  isAdapting?: boolean;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  onFeedbackSubmit,
  onSpeakText,
  isAdapting = false,
}) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-1">
      {messages.map((msg) => (
        <ChatBubble
          key={msg.id}
          message={msg}
          onFeedbackSubmit={onFeedbackSubmit}
          onSpeakText={onSpeakText}
          isAdapting={isAdapting}
        />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatHistory;
