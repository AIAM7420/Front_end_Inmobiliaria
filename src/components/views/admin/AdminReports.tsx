import React, { useState } from 'react';
import { Download, SlidersHorizontal, MoreVertical, User, Home, CreditCard } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { IconButton } from '../../atoms/IconButton';
import { Select } from '../../atoms/Select';
import { SearchBar } from '../../molecules/SearchBar';

// Mock Data
type ReportStatus = 'Activo' | 'Pausado' | 'Pendiente' | 'Reportado';
type ReportType = 'Usuario' | 'Propiedad' | 'Suscripción';

interface AdminReport {
  id: string;
  type: ReportType;
  title: string;
  subtitle: string;
  status: ReportStatus;
  lastActivity: string;
}

const MOCK_ADMIN_REPORTS: AdminReport[] = [
  { id: '1', type: 'Usuario', title: 'Juan Pérez', subtitle: 'Asesor PRO', status: 'Activo', lastActivity: 'Hace 2 horas' },
  { id: '2', type: 'Propiedad', title: 'Casa en Las Lomas', subtitle: 'Reporte por contenido', status: 'Reportado', lastActivity: 'Hace 5 horas' },
  { id: '3', type: 'Usuario', title: 'María Gómez', subtitle: 'Usuario Regular', status: 'Pausado', lastActivity: 'Ayer' },
  { id: '4', type: 'Suscripción', title: 'Agencia Inmobiliaria XYZ', subtitle: 'Plan Premium', status: 'Pendiente', lastActivity: 'Hace 2 días' },
  { id: '5', type: 'Usuario', title: 'Carlos Rodríguez', subtitle: 'Asesor PRO', status: 'Reportado', lastActivity: 'Hace 1 hora' },
];

export const AdminReports: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'Activo': return 'bg-inmo-success/10 text-inmo-success border-inmo-success/20';
      case 'Pausado': return 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700';
      case 'Pendiente': return 'bg-inmo-warning/10 text-inmo-warning border-inmo-warning/20';
      case 'Reportado': return 'bg-inmo-danger/10 text-inmo-danger border-inmo-danger/20';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const getTypeIcon = (type: ReportType) => {
    switch (type) {
      case 'Usuario': return <User className="w-4 h-4 md:w-5 md:h-5" />;
      case 'Propiedad': return <Home className="w-4 h-4 md:w-5 md:h-5" />;
      case 'Suscripción': return <CreditCard className="w-4 h-4 md:w-5 md:h-5" />;
      default: return <User className="w-4 h-4 md:w-5 md:h-5" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 h-full w-full pt-[100px] pb-[100px] px-4 md:px-6 animate-in fade-in">
      
      {/* Header */}
      <header className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="font-montserrat font-bold text-2xl text-inmo-secondary dark:text-white">Reportes y Auditoría</h1>
          <p className="font-inter text-sm text-gray-500 dark:text-gray-400">Gestión detallada del sistema</p>
        </div>
        <Button variant="secondary" icon={<Download className="w-4 h-4" />} className="hidden md:flex px-6">
          Exportar CSV
        </Button>
        <IconButton variant="secondary" icon={<Download className="w-5 h-5" />} className="md:hidden" />
      </header>

      {/* Barra de Herramientas */}
      <div className="flex flex-col gap-3 shrink-0">
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              size="slim"
              placeholder="Buscar usuarios, propiedades..."
            />
          </div>
          <IconButton 
            onClick={() => setShowFilters(!showFilters)}
            className={`w-[44px] h-[44px] md:w-[50px] md:h-[50px] rounded-xl border transition-all flex items-center justify-center shrink-0 ${showFilters ? 'bg-inmo-accent text-white border-inmo-accent shadow-glow' : 'bg-white dark:bg-inmo-darkcard text-gray-500 border-gray-200 dark:border-inmo-darktertiary shadow-soft hover:bg-gray-50 dark:hover:bg-inmo-darkbg'}`}
            icon={<SlidersHorizontal className="w-5 h-5" />}
          />
        </div>

        {/* Filtros Expandibles */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-inmo-darkcard rounded-atom border border-gray-100 dark:border-inmo-darktertiary animate-in slide-in-from-top-2 fade-in">
            <Select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              wrapperClassName="!h-[56px] !rounded-xl !shadow-none !border !border-gray-200 dark:!border-gray-700"
              className="!text-sm"
            >
              <option value="Todos">Cualquier Tipo</option>
              <option value="Usuario">Usuarios</option>
              <option value="Propiedad">Propiedades</option>
              <option value="Suscripción">Suscripciones</option>
            </Select>
            <Select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              wrapperClassName="!h-[56px] !rounded-xl !shadow-none !border !border-gray-200 dark:!border-gray-700"
              className="!text-sm"
            >
              <option value="Todos">Cualquier Estado</option>
              <option value="Activo">Activos</option>
              <option value="Pausado">Pausados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Reportado">Reportados</option>
            </Select>
          </div>
        )}
      </div>

      {/* Resultados - Mobile First (Cards) vs Desktop (Grid/List) */}
      <div className="flex-auto overflow-y-auto pb-10">
        
        {/* Encabezados Desktop */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 mb-2 font-inter font-semibold text-xs text-gray-500 uppercase tracking-wider">
          <div className="col-span-4">Elemento</div>
          <div className="col-span-3">Tipo / Rol</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-2">Última Actividad</div>
          <div className="col-span-1 text-center">Acciones</div>
        </div>

        <div className="flex flex-col gap-3">
          {MOCK_ADMIN_REPORTS.map((report) => (
            <div 
              key={report.id} 
              className="bg-white dark:bg-inmo-darkcard p-4 md:px-6 md:py-4 rounded-atom md:rounded-2xl shadow-soft border border-gray-100 dark:border-inmo-darktertiary flex flex-col md:grid md:grid-cols-12 md:items-center gap-3 md:gap-4 transition-all hover:border-gray-200 dark:hover:border-gray-700"
            >
              {/* Info Principal */}
              <div className="md:col-span-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-full bg-gray-50 dark:bg-inmo-darkbg text-gray-500 shrink-0`}>
                  {getTypeIcon(report.type)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-inter font-bold text-sm md:text-base text-inmo-secondary dark:text-white truncate">
                    {report.title}
                  </span>
                  <span className="md:hidden font-inter text-xs text-gray-500 truncate mt-0.5">
                    {report.type} • {report.subtitle}
                  </span>
                </div>
                
                {/* Menú Móvil */}
                <IconButton className="md:hidden ml-auto p-2 text-gray-400 hover:text-inmo-secondary dark:hover:text-white transition-colors !w-auto !h-auto !bg-transparent !border-none" icon={<MoreVertical className="w-5 h-5" />} />
              </div>

              {/* Tipo / Rol (Desktop) */}
              <div className="hidden md:flex md:col-span-3 flex-col">
                <span className="font-inter text-sm font-semibold text-inmo-secondary dark:text-white">{report.type}</span>
                <span className="font-inter text-xs text-gray-500">{report.subtitle}</span>
              </div>

              {/* Estado */}
              <div className="md:col-span-2 flex items-center">
                <span className={`px-2.5 py-1 rounded-full border text-caption md:text-xs font-bold font-inter ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>

              {/* Última Actividad */}
              <div className="hidden md:flex md:col-span-2 items-center">
                <span className="font-inter text-sm text-gray-500">{report.lastActivity}</span>
              </div>

              {/* Acciones Desktop */}
              <div className="hidden md:flex md:col-span-1 justify-center items-center">
                <IconButton className="p-2 text-gray-400 hover:text-inmo-secondary dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-inmo-darkbg !w-auto !h-auto !bg-transparent !border-none" icon={<MoreVertical className="w-5 h-5" />} />
              </div>

              {/* Footer Móvil */}
              <div className="flex md:hidden items-center justify-between mt-2 pt-3 border-t border-gray-100 dark:border-inmo-darktertiary">
                <span className="font-inter text-caption text-gray-400">Actualizado: {report.lastActivity}</span>
                <div role="button" tabIndex={0} className="font-inter text-xs font-bold text-inmo-accent cursor-pointer">Ver detalle</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
