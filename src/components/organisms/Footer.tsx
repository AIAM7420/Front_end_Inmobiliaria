import { Link } from 'react-router-dom';
import { SkylineTransition } from '../atoms/SkylineTransition';

export function Footer() {
  const linkClass = 'text-sm text-gray-500 dark:text-gray-400 hover:text-inmo-accent transition-colors font-medium';
  
  return (
    <footer className="w-full bg-white dark:bg-inmo-darkbg mt-auto hidden md:block relative pt-16 border-t border-gray-100 dark:border-inmo-darktertiary/50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center relative z-10 pb-8">
        {/* INMO LOGO - Centered horizontally at the top */}
        <div className="flex justify-center w-full mb-8">
           <img src="/inmo.png" alt="INMO" className="h-10 md:h-24 object-contain dark:hidden drop-shadow-sm" />
           <img src="/inmo white.png" alt="INMO" className="h-10 md:h-24 object-contain hidden dark:block drop-shadow-sm" />
        </div>
        
        {/* Links Sections - Centered and grouped closer */}
        <div className="w-full flex flex-col md:flex-row justify-center items-start gap-12 md:gap-16 mb-12 mt-4">
           {/* Section: Público */}
           <div className="flex flex-col gap-3 min-w-[140px] text-left">
              <h4 className="font-bold text-lg text-inmo-secondary dark:text-white mb-1">Público</h4>
              <Link to="/map" className={linkClass}>Buscar Propiedades</Link>
              <Link to="/profile" className={linkClass}>Mi cuenta</Link>
           </div>
           
           {/* Section: Asesores */}
           <div className="flex flex-col gap-3 min-w-[140px] text-left">
              <h4 className="font-bold text-lg text-inmo-secondary dark:text-white mb-1">Asesores</h4>
              <Link to="/asesor/propiedades" className={linkClass}>Gestionar inventario</Link>
              <Link to="/asesor/mensajes" className={linkClass}>Mensajes</Link>
           </div>
           
           {/* Section: Soporte */}
           <div className="flex flex-col gap-3 min-w-[140px] text-left">
              <h4 className="font-bold text-lg text-inmo-secondary dark:text-white mb-1">Soporte</h4>
              <Link to="/faq" className={linkClass}>Preguntas Frecuentes</Link>
              <Link to="/contacto" className={linkClass}>Centro de Ayuda</Link>
              <Link to="/terminos" className={linkClass}>Términos y Privacidad</Link>
           </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} INMO. Todos los derechos reservados.</p>
          <span className="text-xs text-gray-400">Hecho en México 🇲🇽</span>
        </div>
      </div>

      {/* Custom Skyline Vector Transition at the bottom spilling over the top */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none opacity-80 dark:opacity-40 z-0 flex items-end">
         <SkylineTransition className="w-full h-auto drop-shadow-xl text-gray-300 dark:text-inmo-darktertiary fill-current" preserveAspectRatio="xMidYMax meet" style={{ minWidth: '100%' }} />
      </div>
    </footer>
  );
}
