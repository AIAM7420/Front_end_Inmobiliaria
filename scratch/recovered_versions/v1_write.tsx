import React, { useState, useMemo } from 'react';
import { PropertyCreatorWizard } from '../../organisms/PropertyCreatorWizard';
import { PropertyInlineEditor } from '../../organisms/PropertyInlineEditor';
import {
  Plus,
  Edit,
  EyeOff,
  Eye,
  MoreVertical,
  MapPin,
  MessageSquare,
  Power,
  Trash2,
} from 'lucide-react';
import { Button } from '../../atoms/Button';
import { IconButton } from '../../atoms/IconButton';
import { Badge } from '../../atoms/Badge';
import { SearchBar } from '../../molecules/SearchBar';
import { PeriodDropdown } from '../../molecules/PeriodDropdown';
import { SplitViewLayout } from '../../templates/SplitViewLayout';
import { ModuleLayout } from '../../templates/ModuleLayout';
import { PropertyDetailView } from '../../organisms/PropertyDetailView';
import { ActionMenu } from '../../molecules/ActionMenu';
import { useToast } from '../../../context/ToastContext';
import { ConfirmModal } from '../../molecules/ConfirmModal';
import type { ProcessingConfig } from '../../molecules/ConfirmModal';
import {
  usePropertiesList,
  useCreateProperty,
  useChangePropertyStatus,
  usePropertyDetail,
  isConflictError,
} from '../../../hooks/useProperties';
import type { PropertySummary, PropiedadCrearDTO, PropertyDetail } from '../../../types/property';

// ──── View Modes ────
type ViewMode = 'list' | 'detail' | 'create' | 'create-visual' | 'edit';

export const AsesorInventoryView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [wizardDraft, setWizardDraft] = useState<Partial<PropiedadCrearDTO> | null>(null);
  const { addToast } = useToast();

  // ──── React Query hooks ────
  const { data: listData, isLoading: isListLoading } = usePropertiesList({
    search: searchTerm || undefined,
    status: statusFilter,
  });
  const createMutation = useCreateProperty();
  const statusMutation = useChangePropertyStatus();
  const { data: selectedDetail } = usePropertyDetail(selectedId);

  const properties = useMemo(() => listData?.data ?? [], [listData]);

  // ──── Confirm modal state ────
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmVariant: 'accent' | 'danger' | 'warning' | 'secondary';
    confirmText: string;
    withDelay?: boolean;
    processingConfig?: ProcessingConfig;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmVariant: 'danger',
    confirmText: '',
    withDelay: false,
    onConfirm: () => {},
  });

  // ──── Handlers ────
  const handleCreateNew = () => {
    setSelectedId(null);
    setWizardDraft(null);
    setViewMode('create');
  };

  const handleWizardSave = async (dto: PropiedadCrearDTO) => {
    try {
      await createMutation.mutateAsync(dto);
      addToast('create', 'Propiedad publicada', 'Tu nueva propiedad se guardó como borrador.');
      setViewMode('list');
      setSelectedId(null);
      setWizardDraft(null);
    } catch {
      addToast('error', 'Error', 'No se pudo crear la propiedad.');
    }
  };

  const handleWizardVisual = (dto: PropiedadCrearDTO) => {
    // First create the property as draft, then open inline editor
    createMutation.mutate(dto, {
      onSuccess: (created) => {
        setSelectedId(created.id);
        setViewMode('create-visual');
        addToast('create', 'Borrador creado', 'Ahora puedes editar visualmente tu publicación.');
      },
      onError: () => {
        addToast('error', 'Error', 'No se pudo crear el borrador.');
      },
    });
  };

  const requestToggleStatus = (prop: PropertySummary) => {
    const isActive = prop.status === 'Activa';
    setConfirmModal({
      isOpen: true,
      title: isActive ? 'Pausar Propiedad' : 'Activar Propiedad',
      message: isActive
        ? '¿Estás seguro de que deseas pausar esta propiedad? Dejará de ser visible en las búsquedas.'
        : '¿Estás seguro de que deseas activar esta propiedad? Volverá a ser visible para los usuarios.',
      confirmVariant: isActive ? 'warning' : 'accent',
      confirmText: isActive ? 'Pausar' : 'Activar',
      withDelay: true,
      processingConfig: {
        title: isActive ? 'Ocultando...' : 'Mostrando...',
        duration: 1500,
        hideCancel: true,
        type: isActive ? 'muted' : 'success',
      },
      onConfirm: async () => {
        // We need the detail with ETag to perform the mutation
        const detail = await import('../../../services/propertiesService').then(s => s.getPropertyDetail(prop.id));
        try {
          await statusMutation.mutateAsync({
            id: prop.id,
            dto: { accion: isActive ? 'pausar' : 'activar' },
            etag: detail.etag,
          });
          addToast(
            isActive ? 'hide' : 'show',
            isActive ? 'Publicación pausada' : 'Publicación activada',
            isActive ? 'La propiedad ya no será visible en las búsquedas.' : 'La propiedad vuelve a estar visible para los usuarios.'
          );
        } catch (err) {
          if (isConflictError(err)) {
            addToast('error', 'Conflicto de versión', 'Recarga la lista e intenta de nuevo.');
          } else {
            addToast('error', 'Error', 'No se pudo cambiar el estado.');
          }
        }
      },
    });
  };

  const requestDelete = (prop: PropertySummary) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Propiedad',
      message: '¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.',
      confirmVariant: 'danger',
      confirmText: 'Eliminar',
      withDelay: true,
      processingConfig: {
        title: 'Eliminando...',
        steps: ['Desactivando publicación...', 'Borrando imágenes...', 'Removiendo del inventario...'],
        duration: 3500,
        successMessage: '¡Propiedad eliminada!',
        type: 'danger',
      },
      onConfirm: () => {
        // For now, just show toast since delete is not in the API contract
        if (selectedId === prop.id) {
          setSelectedId(null);
          setViewMode('list');
        }
        addToast('delete', 'Propiedad eliminada', 'La propiedad ha sido eliminada de tu inventario.');
      },
    });
  };

  // ──── Helpers ────
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Activa': return <Badge variant="success" text="Activa" />;
      case 'Pausada': return <Badge variant="warning" text="Pausada" />;
      case 'Borrador': return <Badge variant="secondary" text="Borrador" />;
      default: return null;
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Activa': return 'bg-inmo-success';
      case 'Pausada': return 'bg-inmo-warning';
      case 'Borrador': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const isOpen = viewMode !== 'list';
  const isCreating = viewMode === 'create';
  const isCreatingVisual = viewMode === 'create-visual';
  const isEditing = viewMode === 'edit';

  // ──── Side Content ────
  const renderSideContent = () => {
    if (isCreating) {
      return (
        <PropertyCreatorWizard
          initialData={wizardDraft || undefined}
          onCancel={() => { setViewMode('list'); setSelectedId(null); }}
          onSave={handleWizardSave}
          onProceedToVisual={handleWizardVisual}
          isSubmitting={createMutation.isPending}
        />
      );
    }

    if ((isCreatingVisual || isEditing) && selectedId) {
      return (
        <PropertyInlineEditor
          propertyId={selectedId}
          onCancel={() => { setViewMode(selectedId ? 'detail' : 'list'); }}
          onSave={() => {
            setViewMode('detail');
          }}
        />
      );
    }

    if (viewMode === 'detail' && selectedDetail) {
      return (
        <div className="h-full w-full overflow-y-auto custom-scrollbar">
          <PropertyDetailView
            property={{
              ...selectedDetail,
              tags: selectedDetail.tags || [
                { text: selectedDetail.type === 'renta' ? 'Renta' : 'Venta', variant: 'primary' },
              ],
            }}
            layout="horizontal"
            customHeaderActions={
              <>
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <div className="flex items-center gap-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-inmo-secondary dark:text-white shadow-sm transition-all">
                    <div className={`w-2 h-2 rounded-full ${getStatusDotColor(selectedDetail.status)}`} />
                    <span className="hidden md:inline text-[11px] font-bold tracking-wide uppercase">{selectedDetail.status}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-inmo-accent/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-white shadow-sm transition-all">
                    <span className="hidden md:inline text-[11px] font-bold tracking-wide uppercase">
                      {selectedDetail.operationType === 'renta' || selectedDetail.tags?.some(t => t.variant === 'renta') ? 'Renta' : 'Venta'}
                    </span>
                    <div className="md:hidden w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <IconButton
                    variant="secondary"
                    size="md"
                    icon={<Edit className="w-5 h-5 text-inmo-secondary dark:text-white" />}
                    onClick={() => setViewMode('edit')}
                    className="!rounded-full !bg-white/90 dark:!bg-inmo-darkbg/90 backdrop-blur-md shadow-sm border border-white/20"
                    title="Editar Publicación"
                  />
                </div>
              </>
            }
            customBottomBar={
              <div className="bg-white/90 dark:bg-inmo-darkcard/90 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] h-[64px] rounded-full flex items-center justify-between px-6 w-full max-w-[400px]">
                <div className="flex w-full justify-between items-center px-2">
                  <div className="flex flex-col items-center">
                    <span className="font-montserrat font-black text-[22px] text-inmo-secondary dark:text-white leading-none tracking-tight">{selectedDetail.views}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Vistas</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                  <div className="flex flex-col items-center">
                    <span className="font-montserrat font-black text-[22px] text-inmo-secondary dark:text-white leading-none tracking-tight">{selectedDetail.messages}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Consultas</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
                  <div className="flex flex-col items-center">
                    <span className="font-montserrat font-black text-[22px] text-inmo-success leading-none tracking-tight">12%</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">CTR</span>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      );
    }

    return null;
  };

  // ──── KPI Content ────
  const renderKpiContent = () => {
    const propertyLimit = 15;
    const currentCount = properties.length;
    const limitText = statusFilter === 'Todos' ? `de ${propertyLimit} disp.` : statusFilter;

    return (
      <>
        <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-secondary dark:text-white" preserveAspectRatio="none">
              <path d="M 0 40 L 0 25 Q 30 35 60 20 T 100 5 L 100 40 Z" fill="currentColor" />
              <path d="M 0 25 Q 30 35 60 20 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-secondary dark:text-white mb-1">
              {currentCount} <span className="text-base lg:text-lg text-gray-400 font-medium">{statusFilter === 'Todos' ? `/ ${propertyLimit}` : ''}</span>
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Publicaciones<br />{limitText}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.03]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-accent" preserveAspectRatio="none">
              <path d="M 0 40 L 0 35 Q 20 20 40 25 T 80 15 L 100 5 L 100 40 Z" fill="currentColor" />
              <path d="M 0 35 Q 20 20 40 25 T 80 15 L 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-accent mb-1">
              {properties.reduce((acc, p) => acc + p.views, 0)}
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Visitas Totales</span>
          </div>
        </div>
        <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.03]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-success" preserveAspectRatio="none">
              <path d="M 0 40 L 0 5 Q 30 20 60 10 T 100 25 L 100 40 Z" fill="currentColor" />
              <path d="M 0 5 Q 30 20 60 10 T 100 25" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-success mb-1">
              {properties.reduce((acc, p) => acc + p.messages, 0)}
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Leads (Contactos)</span>
          </div>
        </div>
      </>
    );
  };

  // ──── Main Content ────
  const mainContent = (
    <ModuleLayout
      title="Mis Propiedades"
      subtitle={isListLoading ? 'Cargando...' : `Tienes ${listData?.total ?? 0} propiedades.`}
      isFullScreen={true}
      noScroll={true}
      showSearch={true}
      searchPlaceholder="Buscar por título o ubicación..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      controlsMaxWidthClass="md:hidden"
      actions={
        <PeriodDropdown
          selectedPeriod={statusFilter}
          onChange={setStatusFilter}
          options={['Todos', 'Activas', 'Pausadas', 'Borradores']}
          className="!w-[44px] !h-[44px] shrink-0"
          iconOnly={true}
        />
      }
      headerEndContent={
        <div className="flex items-center gap-2 md:hidden">
          <IconButton
            variant="secondary"
            icon={<Trash2 className="w-4 h-4 shrink-0 text-inmo-secondary dark:text-white" />}
            className="w-[36px] h-[36px] !rounded-[10px] !bg-white/90 dark:!bg-inmo-darkcard/90 shadow-sm border border-gray-100 dark:border-white/10"
            title="Ver eliminadas"
            onClick={() => addToast('info', 'Próximamente', 'La vista de propiedades eliminadas estará disponible pronto.')}
          />
          <IconButton
            variant="accent"
            icon={<Plus className="w-4 h-4 shrink-0" strokeWidth={2} />}
            className="w-[36px] h-[36px] !rounded-[10px] shadow-glow"
            onClick={handleCreateNew}
          />
        </div>
      }
    >
      <div className="flex flex-col md:flex-row w-full h-full gap-6 font-inter pb-0 md:pb-6">
        {/* KPI Panel (Desktop, when no selection) */}
        {!isOpen && (
          <div className="hidden md:flex flex-col w-[15%] lg:w-[12%] gap-4 h-full shrink-0">
            {renderKpiContent()}
          </div>
        )}

        {/* Table / List */}
        <div className="flex flex-col h-full flex-1 min-w-0 gap-6">
          {/* Desktop Controls */}
          <div className="hidden md:flex gap-3 w-full items-center">
            <SearchBar
              placeholder="Buscar por título o ubicación..."
              size="slim"
              className="flex-1 md:flex-none md:w-[30%] min-w-0"
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
            <PeriodDropdown
              selectedPeriod={statusFilter}
              onChange={setStatusFilter}
              options={['Todos', 'Activas', 'Pausadas', 'Borradores']}
              className="!w-[44px] !h-[44px] shrink-0"
              iconOnly={true}
            />
            <div className="hidden md:block flex-1" />
            <IconButton
              variant="secondary"
              icon={<Trash2 className="w-5 h-5 shrink-0 text-inmo-secondary dark:text-white" />}
              className="w-[44px] h-[44px] !rounded-[14px] shrink-0 !bg-white/90 dark:!bg-inmo-darkcard/90 border border-gray-100 dark:border-white/10 shadow-sm"
              title="Ver eliminadas"
              onClick={() => addToast('info', 'Próximamente', 'La vista de propiedades eliminadas estará disponible pronto.')}
            />
            <IconButton
              variant="accent"
              icon={<Plus className="w-5 h-5 shrink-0" strokeWidth={2} />}
              className="w-[44px] h-[44px] !rounded-[14px] shadow-glow shrink-0"
              title="Añadir Propiedad"
              onClick={handleCreateNew}
            />
          </div>

          {/* Container */}
          <div className="bg-white dark:bg-inmo-darkcard rounded-card border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-2">
            {/* Loading state */}
            {isListLoading && (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-2 border-inmo-accent border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Desktop Table */}
            {!isListLoading && (
              <div className="hidden md:block w-full flex-1 overflow-y-auto overflow-x-auto custom-scrollbar relative">
                <table className="w-full text-left border-collapse min-w-[900px] h-fit">
                  <thead className="sticky top-0 z-10 shadow-sm">
                    <tr className="border-b border-gray-100 dark:border-inmo-darktertiary bg-gray-50/95 dark:bg-inmo-darkbg/95 backdrop-blur-md text-inmo-secondary dark:text-gray-300 font-montserrat text-sm">
                      <th className="p-4 font-bold">Propiedad</th>
                      <th className="p-4 font-bold">Tipo / Precio</th>
                      <th className="p-4 font-bold">Estado</th>
                      <th className="p-4 font-bold">Métricas</th>
                      <th className="p-4 font-bold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="font-inter">
                    {properties.map(prop => (
                      <tr
                        key={prop.id}
                        className={`border-b border-gray-50 dark:border-inmo-darktertiary hover:bg-gray-50 dark:hover:bg-inmo-darktertiary transition-colors cursor-pointer relative ${selectedId === prop.id ? 'bg-inmo-accent/5 dark:bg-inmo-accent/10' : ''} ${openMenuId === prop.id ? 'z-50' : 'z-0'}`}
                        onClick={() => { setSelectedId(prop.id); setViewMode('detail'); }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <img src={prop.image} alt={prop.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                            <div className="flex flex-col min-w-[200px]">
                              <span className="font-bold text-inmo-secondary dark:text-white line-clamp-1">{prop.title}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {prop.location}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="capitalize text-sm font-medium text-gray-600 dark:text-gray-300">{prop.type}</span>
                            <span className="font-montserrat font-bold text-inmo-accent mt-1">{formatPrice(prop.price)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(prop.status)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <span className="flex items-center gap-1 font-montserrat"><Eye className="w-4 h-4 text-gray-400" /> {prop.views}</span>
                            <span className="flex items-center gap-1 font-montserrat"><MessageSquare className="w-4 h-4 text-gray-400" /> {prop.messages}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          {selectedId ? (
                            <div className="flex items-center justify-end">
                              {openMenuId === prop.id && (
                                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                              )}
                              <div className="relative" onMouseLeave={() => setOpenMenuId(null)}>
                                <button
                                  className="p-2 text-gray-400 hover:text-inmo-secondary dark:hover:text-white transition-colors"
                                  onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === prop.id ? null : prop.id); }}
                                >
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                                <ActionMenu
                                  isOpen={openMenuId === prop.id}
                                  onClose={() => setOpenMenuId(null)}
                                  items={[
                                    { label: 'Editar Propiedad', icon: <Edit className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); setSelectedId(prop.id); setViewMode('edit'); setOpenMenuId(null); } },
                                    { label: prop.status === 'Activa' ? 'Pausar' : 'Activar Publicación', icon: prop.status === 'Activa' ? <EyeOff className="w-4 h-4 shrink-0" /> : <Power className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); requestToggleStatus(prop); setOpenMenuId(null); } },
                                    { label: 'Eliminar', icon: <Trash2 className="w-4 h-4 shrink-0 text-red-500" />, onClick: (e) => { e.stopPropagation(); requestDelete(prop); setOpenMenuId(null); } },
                                  ]}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              <IconButton variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} title="Editar" onClick={(e) => { e.stopPropagation(); setSelectedId(prop.id); setViewMode('edit'); }} />
                              <IconButton variant="ghost" size="sm" icon={prop.status === 'Activa' ? <EyeOff className="w-4 h-4" /> : <Power className="w-4 h-4" />} title={prop.status === 'Activa' ? 'Pausar' : 'Activar'} onClick={(e) => { e.stopPropagation(); requestToggleStatus(prop); }} />
                              <IconButton variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-red-500" />} title="Eliminar" onClick={(e) => { e.stopPropagation(); requestDelete(prop); }} />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {!isListLoading && properties.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500 font-inter">No se encontraron propiedades.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile List */}
            {!isListLoading && (
              <div className="flex flex-col md:hidden font-inter flex-1 overflow-y-auto custom-scrollbar pb-24">
                {properties.map((prop, index) => (
                  <div
                    key={prop.id}
                    className={`flex items-center gap-3 p-3 relative cursor-pointer ${index !== properties.length - 1 ? 'border-b border-gray-100 dark:border-inmo-darktertiary' : ''} ${selectedId === prop.id ? 'bg-inmo-accent/5 dark:bg-inmo-accent/10' : ''} ${openMenuId === prop.id ? 'z-50' : 'z-0'}`}
                    onClick={() => { setSelectedId(prop.id); setViewMode('detail'); }}
                  >
                    <div className="relative shrink-0">
                      <img src={prop.image} alt={prop.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                      <span className="font-bold text-inmo-secondary dark:text-white line-clamp-1 text-sm leading-tight pr-6">{prop.title}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{prop.location}</span>
                      <span className="font-montserrat font-bold text-inmo-accent text-sm mt-1">{formatPrice(prop.price)}</span>
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor(prop.status)} shrink-0`} title={prop.status} />
                      {openMenuId === prop.id && (
                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                      )}
                      <div className="relative" onMouseLeave={() => setOpenMenuId(null)}>
                        <button
                          className="p-1 text-gray-400 hover:text-inmo-secondary dark:hover:text-white transition-colors"
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === prop.id ? null : prop.id); }}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        <ActionMenu
                          isOpen={openMenuId === prop.id}
                          onClose={() => setOpenMenuId(null)}
                          items={[
                            { label: 'Editar Propiedad', icon: <Edit className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); setSelectedId(prop.id); setViewMode('edit'); setOpenMenuId(null); } },
                            { label: prop.status === 'Activa' ? 'Pausar' : 'Activar Publicación', icon: prop.status === 'Activa' ? <EyeOff className="w-4 h-4 shrink-0" /> : <Power className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); requestToggleStatus(prop); setOpenMenuId(null); } },
                            { label: 'Eliminar', icon: <Trash2 className="w-4 h-4 shrink-0 text-red-500" />, onClick: (e) => { e.stopPropagation(); requestDelete(prop); setOpenMenuId(null); } },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {!isListLoading && properties.length === 0 && (
                  <div className="p-8 text-center text-gray-500 text-sm font-inter">No se encontraron propiedades.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ModuleLayout>
  );

  // ──── Side panel title ────
  const sideTitle = isCreating
    ? 'Crear Publicación'
    : isCreatingVisual
      ? 'Diseño Visual de la Publicación'
      : isEditing
        ? 'Editar Publicación'
        : 'Detalle de Propiedad';

  return (
    <>
      <SplitViewLayout
        isOpen={isOpen}
        onClose={() => {
          if (isCreating) {
            setSelectedId(null);
          }
          setViewMode('list');
        }}
        sideTitle={sideTitle}
        sideContent={renderSideContent()}
        sidePanelWidthClass={isCreating ? 'md:w-[40%] lg:w-[30%]' : 'md:w-[50%]'}
        mainPanelWidthClass={isCreating ? 'md:w-[60%] lg:w-[70%]' : 'md:w-[50%]'}
        mainContent={mainContent}
        bottomSheetNoPadding={true}
        bottomSheetHeightMode="fixed-85"
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmVariant={confirmModal.confirmVariant}
        confirmText={confirmModal.confirmText}
        withDelay={confirmModal.withDelay}
        processingConfig={confirmModal.processingConfig}
      />
    </>
  );
};
