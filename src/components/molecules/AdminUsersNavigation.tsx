import { NavLink } from 'react-router-dom';

/** Equal-height pills never stretch to the height of the adjacent statistics card. */
export function AdminUsersNavigation() {
  return <nav aria-label="Administración de usuarios" className="flex flex-wrap items-center self-start gap-2">
    {[{ to: '/admin/asesores', label: 'Usuarios' }, { to: '/admin/solicitudes', label: 'Autorizaciones' }].map(item => <NavLink key={item.to} to={item.to}
      className={({ isActive }) => `inline-flex items-center justify-center h-11 min-w-[144px] px-5 rounded-full border font-inter font-bold text-sm shadow-soft transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inmo-accent ${isActive ? 'bg-inmo-accent border-inmo-accent text-white' : 'bg-white dark:bg-inmo-darkcard border-gray-100 dark:border-inmo-darktertiary text-inmo-secondary dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}>
      {item.label}
    </NavLink>)}
  </nav>;
}
