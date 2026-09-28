import React, { useState } from 'react';
import { ModuleLayout } from '../../templates/ModuleLayout';
import { Check, X, Search, ShieldAlert, UserCheck, UserX, UserMinus, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../../atoms/Button';

type UserTab = 'activos' | 'solicitudes';

export const AdminUsersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserTab>('activos');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for requests (Solicitudes)
  const pendingRequests = [
    { id: '1', name: 'Laura Martínez', email: 'laura.m@example.com', date: '2026-09-24', company: 'Inmobiliaria LM', docs: 'pending' },
    { id: '2', name: 'Carlos Díaz', email: 'carlos.diaz@example.com', date: '2026-09-23', company: 'Independiente', docs: 'verified' },
    { id: '3', name: 'Grupo Inmobiliario Sur', email: 'contacto@gruposur.mx', date: '2026-09-22', company: 'Agencia', docs: 'missing' },
  ];

  // Mock data for active users
  const activeUsers = [
    { id: '10', name: 'Roberto Estate', email: 'roberto@estate.com', plan: 'PRO', properties: 12, joined: '2026-01-15', status: 'active' },
    { id: '11', name: 'Ana Gómez', email: 'ana.gomez@gmail.com', plan: 'BÁSICO', properties: 4, joined: '2026-03-22', status: 'active' },
    { id: '12', name: 'Premium Homes MX', email: 'info@premiumhomes.mx', plan: 'ÉLITE', properties: 85, joined: '2025-11-05', status: 'active' },
    { id: '13', name: 'Jorge Real', email: 'jorge.real@outlook.com', plan: 'BÁSICO', properties: 0, joined: '2026-08-10', status: 'suspended' },
  ];

  return (
    <ModuleLayout
      title="Usuarios y Solicitudes"
      subtitle="Gestiona el acceso de los asesores a la plataforma."
      showSearch={true}
      searchPlaceholder="Buscar por nombre o correo..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      headerEndContent={
        <div className="flex bg-gray-100 dark:bg-inmo-darkbg rounded-lg p-1">
          <button
            onClick={() => setActiveTab('activos')}
            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'activos' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Usuarios Activos
          </button>
          <button
            onClick={() => setActiveTab('solicitudes')}
            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all flex items-center gap-2 ${activeTab === 'solicitudes' ? 'bg-white dark:bg-inmo-darkcard shadow-sm text-inmo-secondary dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Solicitudes
            <span className="bg-inmo-accent text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">3</span>
          </button>
        </div>
      }
    >
      <div className="h-full overflow-y-auto w-full pb-20 animate-in fade-in duration-300 px-4 md:px-6">
        
        {activeTab === 'solicitudes' ? (
          <div className="flex flex-col gap-4 max-w-5xl mx-auto">
            <h3 className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white mb-2">Solicitudes Pendientes de Aprobación</h3>
            
            {pendingRequests.map(req => (
              <div key={req.id} className="bg-white dark:bg-inmo-darkcard border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-inmo-accent/10 flex items-center justify-center shrink-0">
                    <UserCheck className="w-6 h-6 text-inmo-accent" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-inmo-secondary dark:text-white text-lg leading-tight">{req.name}</h4>
                    <span className="text-gray-500 dark:text-gray-400 text-sm mb-1">{req.email}</span>
                    <div className="flex items-center gap-3 text-xs font-medium mt-1">
                      <span className="text-gray-400">Agencia: {req.company}</span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span className="text-gray-400">Fecha: {req.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/5">
                    <span className="text-gray-500">Expediente:</span>
                    {req.docs === 'verified' && <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> Completo</span>}
                    {req.docs === 'pending' && <span className="text-yellow-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> En revisión</span>}
                    {req.docs === 'missing' && <span className="text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/> Incompleto</span>}
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none !px-3 !py-1.5 !text-red-500 !border-red-200 hover:!bg-red-50 dark:hover:!bg-red-500/10" icon={<X className="w-4 h-4" />}>Rechazar</Button>
                    <Button variant="secondary" className="flex-1 md:flex-none !px-3 !py-1.5" icon={<FileText className="w-4 h-4" />}>Revisar Docs</Button>
                    <Button variant="accent" className="flex-1 md:flex-none !px-3 !py-1.5" icon={<Check className="w-4 h-4" />} disabled={req.docs !== 'verified'}>Aprobar</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col max-w-6xl mx-auto w-full">
            <div className="bg-white dark:bg-inmo-darkcard rounded-3xl border border-gray-100 dark:border-white/5 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-inmo-darkbg border-b border-gray-100 dark:border-white/5">
                      <th className="py-4 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Asesor / Agencia</th>
                      <th className="py-4 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="py-4 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider text-center">Propiedades</th>
                      <th className="py-4 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="py-4 px-6 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeUsers.map(user => (
                      <tr key={user.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-inmo-secondary dark:text-white">{user.name}</span>
                            <span className="text-xs text-gray-400">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold tracking-wide ${
                            user.plan === 'PRO' ? 'bg-inmo-accent/10 text-inmo-accent' : 
                            user.plan === 'ÉLITE' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 
                            'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400'
                          }`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="font-montserrat font-bold text-inmo-secondary dark:text-white">{user.properties}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {user.status === 'active' ? 'Activo' : 'Suspendido'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-inmo-secondary dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/5" title="Ver Perfil">
                              <UserCheck className="w-4 h-4" />
                            </button>
                            {user.status === 'active' ? (
                              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10" title="Suspender Usuario">
                                <UserMinus className="w-4 h-4" />
                              </button>
                            ) : (
                              <button className="p-2 text-gray-400 hover:text-green-500 transition-colors rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10" title="Reactivar Usuario">
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </ModuleLayout>
  );
};
