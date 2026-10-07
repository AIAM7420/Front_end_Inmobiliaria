// src/components/organisms/ChatBotPanel.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User, CloudOff, Ghost } from 'lucide-react';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { Input } from '../atoms/Input';
import { EmptyState } from '../molecules/EmptyState';
import { ChatbotAvatar } from '../atoms/ChatbotAvatar';
import { useChatbotQuery } from '../../integrations/backend/hooks/useNlp';
import { useGetProperties } from '../../integrations/backend/hooks/useProperties';

export interface ChatbotPanelProps {
  onClose: () => void;
  hideCloseButton?: boolean;
  isEmbedded?: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
}

const SHORT_GREETINGS = [
  '¿En qué puedo ayudarte?',
  '¿Qué espacio buscas hoy?',
  '¿En qué te colaboro hoy?',
  '¿Buscamos tu nuevo hogar?',
  '¿Qué tienes en mente hoy?'
];

export const ChatbotPanel: React.FC<ChatbotPanelProps> = ({ onClose, hideCloseButton = false, isEmbedded = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '¡Hola! ¿En qué te puedo ayudar hoy a encontrar tu espacio ideal?', sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [greetingText] = useState(() => {
    const randomIndex = Math.floor(Math.random() * SHORT_GREETINGS.length);
    return SHORT_GREETINGS[randomIndex];
  });

  const chatbot = useChatbotQuery();
  const publicCatalog = useGetProperties({ limit: 1 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasStarted = messages.length > 1 || isTyping;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (suggestion?: string) => {
    const text = (suggestion ?? inputValue).trim();
    if (!text || isTyping) return;

    const newUserMsg: Message = { id: crypto.randomUUID(), text, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const result = await chatbot.mutateAsync(text);
      const reply = result.estado === 'ACLARACION'
        ? result.aclaracion ?? 'Cuéntame qué tipo de propiedad buscas en León.'
        : result.estado === 'SIN_RESULTADOS'
          ? 'No encontramos propiedades que coincidan con esos criterios. Prueba con otra zona o presupuesto.'
          : `Encontramos ${result.resultados.length} propiedades: ${result.resultados.slice(0, 3).map((item) => item.titulo).join(', ')}.`;
      setMessages(prev => [...prev, { id: crypto.randomUUID(), text: reply, sender: 'bot' }]);
    } catch {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), text: 'No pudimos procesar tu consulta. Inténtalo de nuevo.', sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const lastBotIndex = !isTyping ? messages.map(m => m.sender).lastIndexOf('bot') : -1;

  return (
    <div className={`w-full h-full flex flex-col relative z-20 ${isEmbedded ? 'bg-transparent' : 'bg-white dark:bg-inmo-darkcard rounded-t-3xl md:rounded-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)]'}`}>

      {/* Header del Panel */}
      <div className={`flex justify-between items-center px-6 py-4 ${hasStarted ? 'border-b border-gray-100 dark:border-inmo-darktertiary' : ''} transition-all duration-500`}>
        <div className={`flex items-center gap-2.5 mx-auto transition-opacity duration-500 ${hasStarted ? 'opacity-100' : 'opacity-0'}`}>
          <ChatbotAvatar className="w-5 h-5 pointer-events-none" />
          <span className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Chatbot</span>
        </div>
        {!hideCloseButton && (
          <IconButton
            onClick={onClose}
            aria-label="Cerrar asistente"
            variant="secondary"
            size="sm"
            className="absolute right-6 !bg-gray-50 dark:!bg-inmo-darkbg"
            icon={<X className="w-4 h-4 text-gray-400" strokeWidth={2.5} />}
          />
        )}
      </div>

      {/* ERROR OR EMPTY STATE */}
      {(publicCatalog.isError || (publicCatalog.isSuccess && publicCatalog.data.items.length === 0)) && (
        <div className="flex-1 flex flex-col p-6">
          <EmptyState
            className="w-full h-full"
            icon={publicCatalog.isError ? <CloudOff /> : <Ghost />}
            title={publicCatalog.isError ? "El asistente no está disponible" : "Aún no hay propiedades"}
            description={publicCatalog.isError ? "No pudimos conectarnos al servidor. Inténtalo de nuevo más tarde." : "Nuestros asesores están preparando nuevas opciones en León. Vuelve pronto."}
          />
        </div>
      )}

      {/* INITIAL GREETING STATE: Avatar y greeting centrados vertical y horizontalmente */}
      {!publicCatalog.isError && !(publicCatalog.isSuccess && publicCatalog.data.items.length === 0) && !hasStarted && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="group mb-5 flex items-center justify-center transition-transform duration-300 hover:scale-105">
            <ChatbotAvatar className="w-24 h-24 md:w-28 md:h-28 drop-shadow-xl" />
          </div>

          <h2 className="text-xl md:text-2xl font-montserrat font-bold text-inmo-secondary dark:text-white text-center tracking-tight max-w-xs">
            {greetingText}
          </h2>
        </div>
      )}

      {/* CHAT MESSAGES STATE */}
      {hasStarted && (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
          {messages.map((msg, idx) => {
            const isBot = msg.sender === 'bot';
            const showBotAvatar = isBot && idx === lastBotIndex;

            return (
              <div key={msg.id} className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
                {isBot ? (
                  showBotAvatar ? (
                    <div className="w-8 h-8 rounded-atom flex items-center justify-center shrink-0">
                      <ChatbotAvatar className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 shrink-0" aria-hidden="true" />
                  )
                ) : (
                  <div className="w-8 h-8 rounded-atom flex items-center justify-center shrink-0 bg-inmo-accent text-white">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className={`rounded-2xl p-4 max-w-[80%] shadow-sm ${
                  isBot
                    ? 'bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary text-inmo-secondary dark:text-white rounded-tl-none'
                    : 'bg-inmo-accent text-white rounded-tr-none'
                }`}>
                  <p className="font-inter text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })}

          {/* Thinking state con avatar pensando y "..." */}
          {isTyping && (
            <div role="status" aria-label="Procesando consulta" className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-8 h-8 rounded-atom flex items-center justify-center shrink-0">
                <ChatbotAvatar className="w-8 h-8" isThinking={true} />
              </div>
              <div className="bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-inmo-darktertiary text-inmo-secondary dark:text-white rounded-2xl rounded-tl-none px-4 py-3.5 shadow-sm flex items-center gap-1.5 min-h-[42px]">
                <span className="w-2 h-2 rounded-full bg-inmo-secondary/60 dark:bg-white/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-inmo-secondary/60 dark:bg-white/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-inmo-secondary/60 dark:bg-white/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* DOCKED BOTTOM AREA: Sugerencias justo sobre el input + Input en la parte inferior */}
      <div className={`p-4 border-t border-gray-100 dark:border-inmo-darktertiary animate-in slide-in-from-bottom-4 duration-300 ${isEmbedded ? 'bg-transparent border-t-0' : 'bg-white dark:bg-inmo-darkcard'}`}>
        {/* Sugerencias sobre el input */}
        {!hasStarted && (
          <div className="flex gap-2 mb-3 flex-wrap justify-center">
            <Button
              variant="secondary"
              onClick={() => void handleSend('Quiero comprar una casa en León')}
              className="px-3 py-1.5 !h-auto !text-xs !bg-gray-50 dark:!bg-inmo-darkbg border border-gray-100 dark:border-inmo-darktertiary !text-inmo-secondary dark:!text-gray-300 hover:!border-inmo-accent hover:!bg-white dark:hover:!bg-inmo-darktertiary !shadow-none rounded-full"
            >
              Buscar casa
            </Button>
            <Button
              variant="secondary"
              onClick={() => void handleSend('Departamentos en venta en León')}
              className="px-3 py-1.5 !h-auto !text-xs !bg-gray-50 dark:!bg-inmo-darkbg border border-gray-100 dark:border-inmo-darktertiary !text-inmo-secondary dark:!text-gray-300 hover:!border-inmo-accent hover:!bg-white dark:hover:!bg-inmo-darktertiary !shadow-none rounded-full"
            >
              Departamentos
            </Button>
            <Button
              variant="secondary"
              onClick={() => void handleSend('Terrenos en León')}
              className="px-3 py-1.5 !h-auto !text-xs !bg-gray-50 dark:!bg-inmo-darkbg border border-gray-100 dark:border-inmo-darktertiary !text-inmo-secondary dark:!text-gray-300 hover:!border-inmo-accent hover:!bg-white dark:hover:!bg-inmo-darktertiary !shadow-none rounded-full"
            >
              Terrenos
            </Button>
          </div>
        )}

        <div className="relative w-full mb-1">
          <div className="absolute -inset-3 bg-gradient-to-r from-inmo-accent/40 via-inmo-accent/60 to-inmo-accent/40 dark:from-inmo-accent/50 dark:via-inmo-accent/70 dark:to-inmo-accent/50 blur-xl rounded-[40px] pointer-events-none opacity-100 animate-pulse" style={{ animationDuration: '3s' }} />

          <div className="relative z-10">
            <Input
              type="text"
              aria-label="Consulta al asistente"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleSend()}
              placeholder="Pregunta a INMO AI..."
              className="!text-sm !px-0 bg-transparent"
              wrapperClassName="!h-14 !bg-white dark:!bg-inmo-darkbg !px-2 border border-gray-200 dark:border-white/10 focus-within:!ring-1 focus-within:!ring-inmo-accent/30 shadow-sm rounded-2xl"
              rightIcon={
                <IconButton
                  onClick={() => void handleSend()}
                  aria-label="Enviar consulta"
                  disabled={isTyping || !inputValue.trim()}
                  variant="tertiary"
                  size="sm"
                  className="!bg-inmo-secondary !text-white hover:!bg-inmo-accent transition-colors"
                  icon={<Send className="w-4 h-4 ml-0.5" strokeWidth={2.5} />}
                />
              }
            />
          </div>
        </div>
      </div>

    </div>
  );
};
