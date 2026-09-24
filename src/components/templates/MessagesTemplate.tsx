import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Send, MoreVertical, CheckCircle2, Paperclip, Bot, X } from 'lucide-react';
import { SearchBar } from '../molecules/SearchBar';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { SplitViewLayout } from './SplitViewLayout';
import { ChatbotPanel } from '../organisms/ChatBotPanel';
import { ModuleLayout } from './ModuleLayout';

const MOCK_CHATS = [
  { id: 1, name: 'Asesor Juan Pérez', lastMessage: 'Hola, ¿te interesa la propiedad?', time: '10:42 AM', isOnline: true },
  { id: 2, name: 'Soporte INMO', lastMessage: 'Tu solicitud ha sido aprobada.', time: 'Ayer', isOnline: false },
  { id: 3, name: 'Asesora María López', lastMessage: 'Podemos agendar una cita mañana.', time: 'Lunes', isOnline: true },
  { id: 4, name: 'Asesor Carlos Ruiz', lastMessage: 'Te envié los documentos al correo.', time: 'Hace 1 sem', isOnline: false },
  { id: 5, name: 'Soporte Técnico', lastMessage: 'Problema resuelto.', time: 'Hace 2 sem', isOnline: false },
];

export interface MessagesTemplateProps {}

export const MessagesTemplate: React.FC<MessagesTemplateProps> = () => {
  const [isWireframeMode, setIsWireframeMode] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<typeof MOCK_CHATS[0] & { isBot?: boolean } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsWireframeMode(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const AI_CHAT = {
    id: 'ai',
    name: 'Asistente IA',
    lastMessage: '¡Hola! ¿En qué te puedo ayudar hoy a encontrar tu espacio ideal?',
    time: 'Ahora',
    isOnline: true,
    isBot: true,
  };

  const openAiChat = () => {
    setSelectedChat(AI_CHAT);
  };

  const renderChatContent = () => {
    if (!selectedChat) return null;

    if (selectedChat.isBot) {
      return (
        <div className="w-full h-full relative">
          <ChatbotPanel onClose={() => setSelectedChat(null)} hideCloseButton={true} isEmbedded={true} />
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full w-full bg-transparent relative font-inter overflow-hidden">
        
        {/* Header - Floating Pill */}
        <div className="absolute top-2 left-4 right-4 md:top-4 md:left-6 md:right-6 z-20 h-auto md:h-16 border border-white/50 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-xl flex items-center justify-between px-3 py-2 md:px-4 shrink-0 shadow-sm rounded-full">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-inmo-accent/10 flex items-center justify-center relative text-inmo-accent shrink-0">
               {selectedChat.isBot ? (
                 <Bot className="w-5 h-5" />
               ) : (
                 <span className="font-bold">{selectedChat.name.charAt(0)}</span>
               )}
               {selectedChat.isOnline && (
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-inmo-success rounded-full border-2 border-white dark:border-inmo-darkcard" />
               )}
             </div>
             <div className="flex flex-col min-w-0">
               <span className="font-bold text-sm text-inmo-secondary dark:text-white leading-tight truncate">{selectedChat.name}</span>
               <span className="text-[11px] text-gray-500 font-medium truncate">{selectedChat.isOnline ? 'En línea' : 'Última vez hoy'}</span>
             </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <IconButton 
              icon={<X className="w-5 h-5 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />} 
              variant="ghost" 
              className="!w-10 !h-10 !rounded-full hover:!bg-gray-100 dark:hover:!bg-white/10" 
              onClick={() => setSelectedChat(null)}
            />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 pt-20 md:p-6 md:pt-24 flex flex-col gap-4 relative z-10 custom-scrollbar">
           <div className="flex justify-center mb-2">
             <span className="bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary px-3 py-1 rounded-full text-[11px] font-bold text-gray-500 uppercase tracking-widest shadow-sm">Hoy</span>
           </div>
           
           {/* Received Message */}
           <div className="flex flex-col gap-1 items-start max-w-[80%] md:max-w-[70%]">
             <div className="bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary text-gray-700 dark:text-gray-300 p-3 sm:p-4 rounded-2xl rounded-tl-sm shadow-sm">
               <p className="text-sm">{selectedChat.lastMessage}</p>
             </div>
             <span className="text-[10px] text-gray-400 font-medium ml-1">{selectedChat.time}</span>
           </div>

           {/* Sent Message */}
           {!selectedChat.isBot && (
             <div className="flex flex-col gap-1 items-end max-w-[80%] md:max-w-[70%] self-end">
               <div className="bg-inmo-accent text-white p-3 sm:p-4 rounded-2xl rounded-tr-sm shadow-sm">
                 <p className="text-sm">¡Claro! En un momento te envío más detalles al respecto. ¿Tienes disponibilidad mañana por la tarde?</p>
               </div>
               <div className="flex items-center gap-1 mr-1">
                 <span className="text-[10px] text-gray-400 font-medium">10:45 AM</span>
                 <CheckCircle2 className="w-3 h-3 text-inmo-accent" />
               </div>
             </div>
           )}
        </div>

        {/* Input Area (Transparent) */}
        <div className="p-4 bg-transparent shrink-0 relative z-10 pb-6">
          <div className="flex items-end gap-2 max-w-4xl mx-auto w-full">
            <IconButton 
              icon={<Paperclip className="w-[22px] h-[22px]" />} 
              variant="ghost"
              className="!w-[50px] !h-[50px] !rounded-full shrink-0 text-gray-400 hover:text-inmo-accent bg-white/50 dark:bg-inmo-darkcard/50 backdrop-blur-md shadow-sm border border-gray-100 dark:border-white/10"
            />
            <div className="flex-1 bg-white/80 dark:bg-inmo-darkcard/80 backdrop-blur-md border border-gray-200 dark:border-inmo-darktertiary rounded-2xl min-h-[50px] p-1 flex items-end transition-colors focus-within:border-inmo-accent focus-within:bg-white dark:focus-within:bg-inmo-darkcard shadow-sm">
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

  const filtersContent = (
    <>
      <div className="flex items-center bg-gray-50 dark:bg-inmo-darkbg rounded-2xl">
        <Select className="text-sm font-medium w-full" wrapperClassName="!h-[50px] !bg-transparent !shadow-none">
          <option value="all" className="text-black">Todos los mensajes</option>
          <option value="unread" className="text-black">No leídos</option>
          <option value="archived" className="text-black">Archivados</option>
        </Select>
      </div>
      <Button 
        onClick={() => setIsFiltersOpen(false)}
        className="w-full h-12 mt-1"
      >
        Aplicar Filtros
      </Button>
    </>
  );

  // Fijo a 30vw menos el padding interno (px-6 = 3rem) en desktop para que no haya squish ni overflow
  const layoutWidthClass = "w-full md:max-w-[calc(30vw-3rem)] mx-auto";

  const renderMainContent = () => (
    <ModuleLayout
      title="Mensajes"
      subtitle={`Tienes ${MOCK_CHATS.length} conversaciones activas.`}
      isFullScreen={true}
      searchPlaceholder="¿Qué estás buscando?"
      isFiltersOpen={isFiltersOpen}
      onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
      onCloseFilters={() => setIsFiltersOpen(false)}
      filtersContent={filtersContent}
      controlsMaxWidthClass={layoutWidthClass}
      noScroll={true}
      actions={
        <IconButton 
          onClick={openAiChat}
          icon={<Bot className="w-5 h-5" strokeWidth={2} />}
          variant="secondary"
          className="hidden md:flex w-[44px] h-[44px] !bg-white/40 dark:!bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 !shadow-sm hover:!bg-white/60 dark:hover:!bg-black/40 shrink-0 text-inmo-accent"
        />
      }
    >

      {/* Lista de Chats */}
      <div className={`w-full flex-1 min-h-0 overflow-y-auto max-md:hide-scrollbar flex flex-col gap-3 pb-32 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${layoutWidthClass}`}>
        {isWireframeMode ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="w-full h-[76px] bg-gray-50 dark:bg-inmo-darkcard rounded-[20px] flex items-center px-4 shadow-sm animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-inmo-darkbg shrink-0" />
              <div className="flex flex-col flex-1 min-w-0 ml-4 gap-2">
                <div className="flex justify-between items-center">
                  <div className="w-1/2 h-4 bg-gray-200 dark:bg-inmo-darkbg rounded" />
                  <div className="w-8 h-3 bg-gray-200 dark:bg-inmo-darkbg rounded" />
                </div>
                <div className="w-3/4 h-3 bg-gray-200 dark:bg-inmo-darkbg rounded" />
              </div>
            </div>
          ))
        ) : (
          MOCK_CHATS.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChat(chat)}
              className={`w-full h-[76px] rounded-[20px] flex items-center px-4 cursor-pointer transition-all border ${
                selectedChat?.id === chat.id 
                  ? 'bg-white dark:bg-inmo-darkcard border-inmo-accent shadow-[0_8px_30px_-12px_rgba(239,68,68,0.3)]' 
                  : 'bg-white dark:bg-inmo-darkcard border-gray-100 dark:border-inmo-darktertiary shadow-sm hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="w-12 h-12 bg-inmo-accent/10 dark:bg-inmo-darktertiary rounded-full shrink-0 flex items-center justify-center text-inmo-accent dark:text-white font-bold font-montserrat shadow-sm relative">
                {chat.name.charAt(0)}
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-inmo-success rounded-full border-2 border-white dark:border-inmo-darkcard" />
                )}
              </div>
              <div className="ml-4 flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-montserrat font-bold text-[13px] md:text-sm text-inmo-secondary dark:text-white truncate">
                    {chat.name}
                  </h3>
                  <span className="text-[10px] md:text-[11px] font-bold text-gray-400 font-inter whitespace-nowrap ml-2 uppercase tracking-wide">
                    {chat.time}
                  </span>
                </div>
                <p className="text-[12px] md:text-[13px] text-gray-500 dark:text-gray-400 font-inter font-medium truncate">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </ModuleLayout>
  );

  return (
    <SplitViewLayout
      isOpen={selectedChat !== null}
      onClose={() => setSelectedChat(null)}
      sideTitle=""
      sidePosition="right"
      sidePanelWidthClass="w-full md:w-[70%]"
      mainPanelWidthClass="md:w-[30%]"
      sideContent={renderChatContent()}
      mainContent={renderMainContent()}
      bottomSheetNoPadding={true}
      bottomSheetFullHeight={true}
      desktopNoPadding={true}
      sidePanelTransparent={true}
      hideDesktopCloseButton={true}
      bottomSheetIsHero={false}
      bottomSheetHeightMode="fixed-85"
      wrapperClassName="bg-transparent"
      mainPanelNoScroll={true}
    />
  );
};
