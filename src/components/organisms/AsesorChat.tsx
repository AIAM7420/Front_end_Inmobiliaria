import React from 'react';
import { Send, CheckCircle2, Paperclip, X } from 'lucide-react';
import { IconButton } from '../atoms/IconButton';

interface AsesorChatProps {
  onClose?: () => void;
  asesorName?: string;
  initialMessage?: string;
  isOnline?: boolean;
  hideHeader?: boolean;
}

export const AsesorChat: React.FC<AsesorChatProps> = ({ 
  onClose, 
  asesorName = 'Asesor', 
  initialMessage = '¡Hola! ¿En qué te puedo ayudar hoy?',
  isOnline = true,
  hideHeader = false
}) => {
  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-inmo-darkcard relative font-inter overflow-hidden">
      
      {/* Header - Floating Pill */}
      {!hideHeader && (
        <div className="absolute top-2 left-4 right-4 md:top-4 md:left-6 md:right-6 z-20 h-auto md:h-16 border border-gray-100 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl flex items-center justify-between px-3 py-2 md:px-4 shrink-0 shadow-sm rounded-full">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-inmo-accent/10 flex items-center justify-center relative text-inmo-accent shrink-0">
               <span className="font-bold">{asesorName.charAt(0)}</span>
               {isOnline && (
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-inmo-success rounded-full border-2 border-white dark:border-inmo-darkcard" />
               )}
             </div>
             <div className="flex flex-col min-w-0">
               <span className="font-bold text-sm text-inmo-secondary dark:text-white leading-tight truncate">{asesorName}</span>
               <span className="text-[11px] text-gray-500 font-medium truncate">{isOnline ? 'En línea' : 'Última vez hoy'}</span>
             </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {onClose && (
              <IconButton 
                icon={<X className="w-5 h-5 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />} 
                variant="ghost" 
                className="!w-10 !h-10 !rounded-full hover:!bg-gray-100 dark:hover:!bg-white/10" 
                onClick={onClose}
              />
            )}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 relative z-10 custom-scrollbar ${hideHeader ? 'pt-4 md:pt-6' : 'pt-20 md:pt-24'}`}>
         <div className="flex justify-center mb-2">
           <span className="bg-gray-50 dark:bg-inmo-darkbg border border-gray-100 dark:border-inmo-darktertiary px-3 py-1 rounded-full text-[11px] font-bold text-gray-500 uppercase tracking-widest shadow-sm">Hoy</span>
         </div>
         
         {/* Received Message */}
         <div className="flex flex-col gap-1 items-start max-w-[80%] md:max-w-[70%]">
           <div className="bg-gray-50 dark:bg-inmo-darkbg border border-gray-100 dark:border-inmo-darktertiary text-gray-700 dark:text-gray-300 p-3 sm:p-4 rounded-2xl rounded-tl-sm shadow-sm">
             <p className="text-sm">{initialMessage}</p>
           </div>
           <span className="text-[10px] text-gray-400 font-medium ml-1">Ahora</span>
         </div>

      </div>

      {/* Input Area (Transparent) */}
      <div className="p-4 bg-transparent shrink-0 relative z-10 pb-6 md:pb-6">
        <div className="flex items-end gap-2 max-w-4xl mx-auto w-full">
          <IconButton 
            icon={<Paperclip className="w-[22px] h-[22px]" />} 
            variant="ghost"
            className="!w-[50px] !h-[50px] !rounded-full shrink-0 text-gray-400 hover:text-inmo-accent bg-gray-50/80 dark:bg-inmo-darkbg/80 backdrop-blur-md shadow-sm border border-gray-100 dark:border-white/10"
          />
          <div className="flex-1 bg-gray-50/80 dark:bg-inmo-darkbg/80 backdrop-blur-md border border-gray-200 dark:border-inmo-darktertiary rounded-2xl min-h-[50px] p-1 flex items-end transition-colors focus-within:border-inmo-accent focus-within:bg-white dark:focus-within:bg-inmo-darkcard shadow-sm">
             <textarea 
               placeholder="Escribe un mensaje..."
               className="flex-1 bg-transparent border-none outline-none resize-none px-3 py-2.5 text-sm max-h-[120px] custom-scrollbar text-inmo-secondary dark:text-white"
               rows={1}
             />
          </div>
          <IconButton 
            icon={<Send className="w-5 h-5 ml-0.5" />} 
            variant="accent"
            className="!w-[50px] !h-[50px] !rounded-full shrink-0 shadow-glow"
          />
        </div>
      </div>
    </div>
  );
};
