import React from 'react';
import { ChatbotAvatar } from '../atoms/ChatbotAvatar';
import { ChatbotPanel } from './ChatBotPanel';
import { useGetProperties } from '../../integrations/backend/hooks/useProperties';

export interface GlobalChatbotProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const GlobalChatbot: React.FC<GlobalChatbotProps> = ({ isOpen, onOpen, onClose }) => {
  const publicCatalog = useGetProperties({ limit: 1 });
  const isInvalidState = publicCatalog.isError || (publicCatalog.isSuccess && publicCatalog.data.items.length === 0);

  return (
    <>
      {/* DESKTOP CHATBOT BUTTON (PC ONLY) */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={onOpen}
          aria-label="Abrir asistente virtual"
          className="group relative w-[64px] h-[64px] rounded-full p-0 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.08)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-inmo-accent shrink-0"
        >
          <ChatbotAvatar className="w-full h-full pointer-events-none drop-shadow-sm" />
        </button>
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
      
      {/* INVISIBLE CLICK-OUTSIDE BACKDROP FOR DESKTOP IN ERROR/EMPTY STATE */}
      {isOpen && isInvalidState && (
        <div 
          className="hidden md:block fixed inset-0 z-[50]" 
          onClick={onClose}
        />
      )}
    </>
  );
};
