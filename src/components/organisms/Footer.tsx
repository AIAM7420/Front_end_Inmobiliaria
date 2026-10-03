import { Link } from 'react-router-dom';
import { MapPin, Search, Shield, User } from 'lucide-react';
export function Footer() {
  const linkClass = 'text-sm text-gray-500 dark:text-gray-400 hover:text-inmo-accent transition-colors';
  return <footer className="w-full bg-white dark:bg-inmo-darkcard border-t border-gray-100 dark:border-inmo-darktertiary mt-auto hidden md:block">
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4"><div className="flex items-center gap-2 mb-2"><img src="/inmo.png" alt="INMO" className="h-8 object-contain dark:hidden" /><img src="/inmo white.png" alt="INMO" className="h-8 object-contain hidden dark:block" /></div><p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Encuentra tu hogar ideal con la ayuda de expertos locales y tecnología de punta.</p><div className="flex gap-4 mt-2"><Link aria-label="Mapa de propiedades" to="/map" className={linkClass}><MapPin className="w-5 h-5" /></Link><Link aria-label="Mi cuenta" to="/profile" className={linkClass}><User className="w-5 h-5" /></Link></div></div>
        <div><h4 className="font-bold text-inmo-secondary dark:text-white mb-4">Enlaces Rápidos</h4><ul className="flex flex-col gap-3"><li><Link to="/map" className={linkClass}>Buscar Propiedades</Link></li><li><Link to="/asesor/propiedades" className={linkClass}>Gestionar mi inventario</Link></li><li><Link to="/messages" className={linkClass}>Mis conversaciones</Link></li><li><Link to="/profile" className={linkClass}>Mi cuenta</Link></li></ul></div>
        <div><h4 className="font-bold text-inmo-secondary dark:text-white mb-4">Tu cuenta</h4><ul className="flex flex-col gap-3"><li><Link to="/login" className={linkClass}>Iniciar sesión</Link></li><li><Link to="/login?view=register" className={linkClass}>Crear una cuenta</Link></li><li><Link to="/login?view=recovery" className={linkClass}>Recuperar contraseña</Link></li></ul></div>
        <div><h4 className="font-bold text-inmo-secondary dark:text-white mb-4">Encuentra tu espacio</h4><ul className="flex flex-col gap-4"><li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" /><span className="text-sm text-gray-500 dark:text-gray-400">León, Guanajuato</span></li><li className="flex items-start gap-3"><Search className="w-5 h-5 text-gray-400 shrink-0" /><span className="text-sm text-gray-500 dark:text-gray-400">Filtra por precio, zona y características.</span></li><li className="flex items-start gap-3"><Shield className="w-5 h-5 text-gray-400 shrink-0" /><span className="text-sm text-gray-500 dark:text-gray-400">La ubicación pública es aproximada.</span></li></ul></div>
      </div>
      <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary mt-12 mb-6" /><div className="flex flex-col md:flex-row items-center justify-between gap-4"><p className="text-sm text-gray-400">© {new Date().getFullYear()} INMO. Todos los derechos reservados.</p><span className="text-sm text-gray-400">Hecho en México 🇲🇽</span></div>
    </div>
  </footer>;
}
