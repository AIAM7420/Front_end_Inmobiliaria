import React from 'react';
import { Bot } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';
import { ChatbotPanel } from './ChatBotPanel';

export interface GlobalChatbotProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const GlobalChatbot: React.FC<GlobalChatbotProps> = ({ isOpen, onOpen, onClose }) => {
  return (
    <>
      {/* DESKTOP CHATBOT BUTTON (PC ONLY) */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-40">
        <IconButton 
          onClick={onOpen}
          icon={<Bot className="w-7 h-7 text-inmo-secondary dark:text-white" strokeWidth={1.75} />}
          variant="secondary"
          className="!w-[64px] !h-[64px] !bg-white/40 dark:!bg-black/40 backdrop-blur-2xl border-t border-l border-white/60 dark:border-white/20 !shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] !rounded-full shrink-0"
        />
      </div>

      {/* CHATBOT (MOBILE) */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-[60] flex justify-center transform transition-all duration-300 ease-out origin-bottom ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-[500px] h-[80vh] max-h-[85vh]">
          <ChatbotPanel onClose={onClose} />
        </div>
      </div>

      {/* CHATBOT (DESKTOP SIDE PANEL) */}
      <div 
        className={`hidden md:flex fixed top-[200px] bottom-[140px] right-6 z-[60] w-[420px] bg-white/95 dark:bg-inmo-darkcard/95 backdrop-blur-3xl rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50 dark:border-white/10 transition-all duration-500 ease-out flex-col overflow-hidden ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0 pointer-events-none'
        }`}
      >
        <ChatbotPanel onClose={onClose} />
      </div>

      {/* BACKDROP DEL CHAT (SOLO MOBILE) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 dark:bg-black/60 z-[50] transition-opacity backdrop-blur-md"
          onClick={onClose}
        />
      )}
    </>
  );
};
