// src/components/organisms/ChatBotPanel.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, Send, User } from 'lucide-react';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { Input } from '../atoms/Input';
import { Skeleton } from '../atoms/Skeleton';
import { useChatbotQuery } from '../../integrations/backend/hooks/useNlp';

interface ChatbotPanelProps {
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
}

export const ChatbotPanel: React.FC<ChatbotPanelProps> = ({ onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '¡Hola! ¿En qué te puedo ayudar hoy a encontrar tu espacio ideal?', sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatbot = useChatbotQuery();
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

  return (
    <div className="bg-white dark:bg-inmo-darkcard w-full h-full flex flex-col relative z-20 rounded-t-3xl md:rounded-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)]">
      
      {/* Header del Panel */}
      <div className={`flex justify-between items-center px-6 py-5 ${hasStarted ? 'border-b border-gray-100 dark:border-inmo-darktertiary' : ''} transition-all duration-500`}>
        <div className={`flex items-center gap-3 mx-auto transition-opacity duration-500 ${hasStarted ? 'opacity-100' : 'opacity-0'}`}>
          <span className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Chatbot</span>
        </div>
        <IconButton 
          onClick={onClose} 
          variant="secondary"
          size="sm"
          className="absolute right-6 !bg-gray-50 dark:!bg-inmo-darkbg"
          icon={<X className="w-4 h-4 text-gray-400" strokeWidth={2.5} />}
        />
      </div>
      
      {/* INITIAL STATE (Gemini-like) */}
      {!hasStarted && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20 animate-in fade-in zoom-in-95 duration-500">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-inmo-secondary dark:text-white mb-8 text-center">
            Hola, ¿qué quieres hacer?
          </h2>
          
          <div className="w-full max-w-md relative">
            {/* Efecto de Aura Centrada */}
            <div className="absolute -inset-4 bg-gradient-to-r from-inmo-accent/40 via-inmo-accent/60 to-inmo-accent/40 dark:from-inmo-accent/50 dark:via-inmo-accent/70 dark:to-inmo-accent/50 blur-2xl rounded-[40px] pointer-events-none opacity-100 animate-pulse" style={{ animationDuration: '3s' }} />

            <div className="relative z-10">
              <Input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && void handleSend()}
                placeholder="Pregúntale a INMO AI..." 
                className="!text-sm !px-0 bg-transparent"
                wrapperClassName="!h-14 !bg-white dark:!bg-inmo-darkcard !px-2 border border-gray-200 dark:border-white/10 focus-within:!ring-1 focus-within:!ring-inmo-accent/30 shadow-xl rounded-2xl"
                rightIcon={
                  <IconButton 
                    onClick={() => void handleSend()}
                    disabled={!inputValue.trim()}
                    variant="tertiary"
                    size="sm"
                    className="!bg-inmo-secondary !text-white hover:!bg-inmo-accent transition-colors"
                    icon={<Send className="w-4 h-4 ml-0.5" strokeWidth={2.5} />}
                  />
                }
              />
            </div>
          </div>

          <div className="flex gap-2 mt-8 flex-wrap justify-center">
            <Button variant="secondary" onClick={() => void handleSend('Quiero comprar una casa en León')} className="px-4 py-2 !h-auto !text-xs !bg-gray-50 dark:!bg-inmo-darkbg border border-gray-100 dark:border-inmo-darktertiary !text-inmo-secondary dark:!text-gray-300 hover:!border-inmo-accent hover:!bg-white !shadow-none">Buscar casa</Button>
          </div>
        </div>
      )}

      {/* CHAT STATE */}
      {hasStarted && (
        <>
          {/* Área de Mensajes */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-atom flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-inmo-accent text-white' : 'bg-gray-100 dark:bg-inmo-darktertiary text-inmo-secondary dark:text-white'}`}>
                  {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`rounded-2xl p-4 max-w-[80%] shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-inmo-accent text-white rounded-tr-none' 
                    : 'bg-gray-100 dark:bg-inmo-darktertiary text-inmo-secondary dark:text-white rounded-tl-none'
                }`}>
                  <p className="font-inter text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-atom bg-gray-100 dark:bg-inmo-darktertiary flex items-center justify-center shrink-0 text-inmo-secondary dark:text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <Skeleton className="w-40 h-10 rounded-2xl" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area Docked */}
          <div className="p-4 bg-white dark:bg-inmo-darkcard border-t border-gray-100 dark:border-inmo-darktertiary animate-in slide-in-from-bottom-4 duration-300">
            <div className="relative w-full mt-2 mb-1">
              <div className="absolute -inset-3 bg-gradient-to-r from-inmo-accent/40 via-inmo-accent/60 to-inmo-accent/40 dark:from-inmo-accent/50 dark:via-inmo-accent/70 dark:to-inmo-accent/50 blur-xl rounded-[40px] pointer-events-none opacity-100 animate-pulse" style={{ animationDuration: '3s' }} />

              <div className="relative z-10">
                <Input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void handleSend()}
                  placeholder="Pregunta a inmo..." 
                  className="!text-sm !px-0 bg-transparent"
                  wrapperClassName="!h-14 !bg-white dark:!bg-inmo-darkbg !px-2 border border-gray-200 dark:border-white/10 focus-within:!ring-1 focus-within:!ring-inmo-accent/30 shadow-sm rounded-2xl"
                  rightIcon={
                    <IconButton 
                      onClick={() => void handleSend()}
                      disabled={!inputValue.trim()}
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
        </>
      )}
    </div>
  );
};
