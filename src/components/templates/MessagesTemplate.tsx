import React, { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { SearchBar } from '../molecules/SearchBar';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';

const MOCK_CHATS = [
  { id: 1, name: 'Asesor Juan Pérez', lastMessage: 'Hola, ¿te interesa la propiedad?', time: '10:42 AM' },
  { id: 2, name: 'Soporte INMO', lastMessage: 'Tu solicitud ha sido aprobada.', time: 'Ayer' },
  { id: 3, name: 'Asesora María López', lastMessage: 'Podemos agendar una cita mañana.', time: 'Lunes' },
  { id: 4, name: 'Asesor Carlos Ruiz', lastMessage: 'Te envié los documentos al correo.', time: 'Hace 1 sem' },
  { id: 5, name: 'Soporte Técnico', lastMessage: 'Problema resuelto.', time: 'Hace 2 sem' },
];

export interface MessagesTemplateProps {}

export const MessagesTemplate: React.FC<MessagesTemplateProps> = () => {
  const [isWireframeMode, setIsWireframeMode] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsWireframeMode(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <>
      {/* CONTENIDO PRINCIPAL */}
      <main className="px-6 py-2 flex flex-col items-center gap-6 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        <h1 className="text-xl md:text-2xl font-montserrat font-bold text-inmo-secondary dark:text-white mt-2 self-start md:self-center">
          Chats
        </h1>

        {/* Search Bar & Filter */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex gap-3 w-full">
            <SearchBar
              placeholder="¿Qué estás buscando?"
              size="slim"
              className="flex-1"
            />
            <IconButton 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              icon={<SlidersHorizontal className="w-5 h-5" strokeWidth={2} />}
              variant="secondary"
              className="w-[44px] h-[44px] !bg-white/40 dark:!bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 !shadow-sm hover:!bg-white/60 dark:hover:!bg-black/40 shrink-0"
            />
          </div>

          {/* Expandable Dropdown Filters */}
          <div className={`w-full pointer-events-auto transition-all duration-300 ease-in-out origin-top ${isFiltersOpen ? 'opacity-100 scale-y-100 max-h-[400px]' : 'opacity-0 scale-y-95 max-h-0 overflow-hidden'}`}>
            <div className="bg-white/95 dark:bg-inmo-darkcard/95 backdrop-blur-xl p-5 rounded-card shadow-xl border border-gray-100 dark:border-inmo-darktertiary/50 mb-1">
              <div className="flex flex-col gap-3">
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
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Chats */}
        <div className="w-full flex flex-col gap-4 mt-2">
          {isWireframeMode ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="w-full h-[72px] bg-gray-50 dark:bg-inmo-darkcard rounded-2xl flex items-center px-4 shadow-sm animate-pulse">
                <div className="w-12 h-12 rounded-atom bg-gray-200 dark:bg-inmo-darkbg shrink-0" />
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
                className="w-full h-[72px] bg-gray-100 dark:bg-inmo-darkcard rounded-2xl flex items-center px-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-inmo-darktertiary transition-colors"
              >
                <div className="w-12 h-12 bg-white dark:bg-inmo-darktertiary rounded-atom shrink-0 flex items-center justify-center text-inmo-secondary dark:text-white font-bold font-montserrat shadow-sm">
                  {chat.name.charAt(0)}
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white truncate">
                      {chat.name}
                    </h3>
                    <span className="text-[10px] text-gray-500 font-inter whitespace-nowrap ml-2">
                      {chat.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-inter truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
};
