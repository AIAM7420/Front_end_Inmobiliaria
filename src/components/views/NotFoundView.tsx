import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { Home } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center flex-1 w-full h-full min-h-[70vh] p-6 md:p-12 gap-8 md:gap-20 animate-in fade-in duration-500 max-w-5xl mx-auto">
      
      {/* Imagen GIGANTE (reducida a la mitad) */}
      <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-[200px] md:h-[200px] relative flex-shrink-0 group">
        <img 
          src="/side-eye.png" 
          alt="Side eye emoji" 
          className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3" 
        />
      </div>
      
      {/* Contenido de Texto */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
        <h1 className="font-montserrat font-black text-6xl md:text-8xl text-gray-300 dark:text-gray-700 leading-none mb-2 select-none">
          404
        </h1>
        <h2 className="text-2xl md:text-4xl font-montserrat font-bold text-inmo-secondary dark:text-white mb-4 leading-tight">
          Uhm... ¿Hola?
        </h2>
        
        <p className="text-gray-500 dark:text-gray-400 font-inter text-base md:text-lg leading-relaxed mb-8">
          Parece que estás perdido, intenta volver al inicio.
        </p>

        <Button 
          onClick={() => navigate('/')} 
          variant="secondary" 
          icon={<Home className="w-6 h-6" />}
          className="rounded-full shadow-soft w-14 h-14 !p-0 flex items-center justify-center"
          aria-label="Volver al Inicio"
        />
      </div>

    </div>
  );
};
