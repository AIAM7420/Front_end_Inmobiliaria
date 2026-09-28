import React from 'react';
import { Mail, Phone, MapPin, Globe, MessageCircle, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-inmo-darkcard border-t border-gray-100 dark:border-inmo-darktertiary mt-auto hidden md:block">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <img
                src="/inmo.png"
                alt="INMO"
                className="h-8 object-contain dark:hidden"
              />
              <img
                src="/inmo white.png"
                alt="INMO"
                className="h-8 object-contain hidden dark:block"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              La plataforma inmobiliaria más avanzada de México. Encuentra tu hogar ideal con la ayuda de expertos locales y tecnología de punta.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-inmo-accent transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-inmo-accent transition-colors"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-inmo-accent transition-colors"><Share2 className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-inmo-secondary dark:text-white mb-4">Enlaces Rápidos</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-inmo-accent transition-colors">Buscar Propiedades</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-inmo-accent transition-colors">Vender mi Propiedad</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-inmo-accent transition-colors">Directorio de Asesores</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-inmo-accent transition-colors">Guía de Compra</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-inmo-secondary dark:text-white mb-4">Soporte</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-inmo-accent transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-inmo-accent transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-inmo-accent transition-colors">Aviso de Privacidad</a></li>
              <li><a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-inmo-accent transition-colors">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-inmo-secondary dark:text-white mb-4">Contacto</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Paseo de la Reforma 250, Juárez, 06600 Ciudad de México, CDMX</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500 dark:text-gray-400">+52 (55) 1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500 dark:text-gray-400">contacto@inmo.mx</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary mt-12 mb-6" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} INMO. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <span className="text-sm text-gray-400">Hecho en México 🇲🇽</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
