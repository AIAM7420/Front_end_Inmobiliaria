// src/components/molecules/chatMessage.tsx
import React from 'react';
import { User } from 'lucide-react';
import { ChatbotAvatar } from '../atoms/ChatbotAvatar';

interface ChatMessageProps {
  message: string;
  isBot?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isBot = true 
}) => {
  return (
    <div className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-atom flex items-center justify-center shrink-0 ${
        isBot ? '' : 'bg-inmo-accent'
      }`}>
        {isBot ? (
          <ChatbotAvatar className="w-8 h-8 pointer-events-none" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>
      
      {/* Globo de mensaje[cite: 1] */}
      <div className={`p-4 max-w-[80%] ${
        isBot 
          ? 'bg-gray-100 dark:bg-inmo-darktertiary rounded-2xl rounded-tl-none text-inmo-secondary dark:text-white' 
          : 'bg-inmo-accent text-white rounded-2xl rounded-tr-none'
      }`}>
        <p className="font-inter text-sm whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};