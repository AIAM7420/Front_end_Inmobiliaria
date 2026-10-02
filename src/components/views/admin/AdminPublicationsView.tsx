import { useState, useMemo } from 'react';
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
  Mail,
  Power,
  Trash2, AlertCircle,
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
import { PropertyCard } from '../../molecules/PropertyCard';
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
import type { PropertySummary, PropiedadCrearDTO } from '../../../types/property';

// ──── View Modes ────
type ViewMode = 'list' | 'detail' | 'create' | 'create-visual' | 'edit' | 'trash';

export const AdminPublicationsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedTrashIds, setSelectedTrashIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [wizardDraft, setWizardDraft] = useState<Partial<PropiedadCrearDTO> | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [isWizardDirty, setIsWizardDirty] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { addToast } = useToast();

  // ──── React Query hooks ────
  const { data: listData, isLoading: isListLoading, isError, error } = usePropertiesList({
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
    setWizardStep(0);
    setIsWizardDirty(false);
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
      addToast('danger', 'Error', 'No se pudo crear la propiedad.');
    }
  };

  const handleWizardVisual = (dto: PropiedadCrearDTO) => {
    createMutation.mutate(dto, {
      onSuccess: (created) => {
        setSelectedId(created.id);
        setViewMode('create-visual');
        addToast('create', 'Borrador creado', 'Ahora puedes editar visualmente tu publicación.');
      },
      onError: () => {
        addToast('danger', 'Error', 'No se pudo crear el borrador.');
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
            addToast('danger', 'Error de Concurrencia (412)', 'La propiedad fue modificada por otro usuario. La lista se ha actualizado con la versión más reciente.');
          } else {
            addToast('danger', 'Error al actualizar', 'No se pudo cambiar el estado de la propiedad.');
          }
        }
      },
    });
  };

  const requestDelete = (prop: PropertySummary) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Propiedad',
      message: '¿Estás seguro de que deseas eliminar permanentemente esta propiedad? Esta acción no se puede deshacer.',
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
        if (selectedId === prop.id) {
          setSelectedId(null);
          setViewMode('list');
        }
        // Simulated delete
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
      default: return <Badge variant="secondary" text={status} />;
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
          onDirtyChange={setIsWizardDirty}
          onCancel={() => {
            if (isWizardDirty) {
              setShowCancelModal(true);
            } else {
              setSelectedId(null);
              setWizardStep(0);
              setViewMode('list');
            }
          }}
          onSave={handleWizardSave}
          onProceedToVisual={handleWizardVisual}
          isSubmitting={createMutation.isPending}
          onStepChange={setWizardStep}
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

    if (viewMode === 'trash') {
      const deletedProps = [
        { id: 991, title: 'Casa en Lomas de Chapultepec', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80', location: 'Lomas de Chapultepec, CDMX', price: 45000000, beds: 4, baths: 3.5, sqft: 450, status: 'Eliminada', type: 'venta', views: 120, messages: 5 },
        { id: 992, title: 'Departamento en Roma Norte', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80', location: 'Roma Nte, CDMX', price: 6800000, beds: 2, baths: 2, sqft: 95, status: 'Eliminada', type: 'venta', views: 89, messages: 2 }
      ];
      
      const toggleSelection = (id: number) => {
        setSelectedTrashIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
      };

      const hasSelection = selectedTrashIds.length > 0;
      
      return (
        <div className="flex flex-col h-full w-full bg-gray-50/50 dark:bg-inmo-darkbg/50">
          <div className="px-4 lg:px-6 pt-5 pb-1 shrink-0">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">
              {hasSelection 
                ? `${selectedTrashIds.length} propiedad${selectedTrashIds.length > 1 ? 'es' : ''} seleccionada${selectedTrashIds.length > 1 ? 's' : ''}` 
                : 'Selecciona las propiedades que deseas restaurar o eliminar definitivamente.'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {deletedProps.map(prop => {
                const isSelected = selectedTrashIds.includes(prop.id);
                
                return (
                  <div key={prop.id} className="flex flex-col relative transition-all duration-300">
                    <div 
                      className={`transition-all duration-300 h-full rounded-[24px] cursor-pointer ${!isSelected ? 'opacity-50 grayscale hover:opacity-80 hover:grayscale-[50%]' : 'scale-[1.02] shadow-lg z-10'}`}
                      onClick={() => toggleSelection(prop.id)}
                    >
                      <PropertyCard
                        image={prop.image}
                        title={prop.title}
                        location={prop.location}
                        price={prop.price}
                        beds={prop.beds}
                        baths={prop.baths}
                        sqft={prop.sqft}
                        badgeText="Eliminada"
                        badgeVariant="secondary"
                        variant="asesor"
                        hideFeaturesText={true}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {deletedProps.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center min-h-[300px]">
                <Trash2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 font-inter text-sm">No hay propiedades en la papelera</p>
              </div>
            )}
          </div>
          
          {/* Footer with 75% width container */}
          <div className="min-h-[80px] flex items-center justify-center border-t border-gray-100 dark:border-white/10 shrink-0 bg-white dark:bg-inmo-darkcard z-10 py-4 md:py-0">
            <div className="w-[75%] flex gap-4">
              {hasSelection ? (
                <>
                  <Button
                    variant="secondary"
                    className="flex-1 !rounded-full py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 border-none font-bold text-sm transition-colors"
                    onClick={() => {
                      addToast('delete', 'Eliminadas', `${selectedTrashIds.length} propiedades eliminadas definitivamente.`);
                      setSelectedTrashIds([]);
                    }}
                  >
                    Eliminar Definitivamente
                  </Button>
                  <Button
                    variant="accent"
                    className="flex-1 !rounded-full py-3 font-bold shadow-sm text-sm"
                    onClick={() => {
                      addToast('success', 'Recuperadas', `${selectedTrashIds.length} propiedades restauradas a tu inventario.`);
                      setSelectedTrashIds([]);
                    }}
                  >
                    Recuperar
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full !rounded-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-inmo-darkbg dark:hover:bg-white/10 dark:text-gray-300 border-none font-bold text-sm transition-colors"
                  onClick={() => {
                    addToast('delete', 'Papelera Vaciada', 'Todas las propiedades fueron eliminadas definitivamente.');
                  }}
                  disabled={deletedProps.length === 0}
                >
                  Vaciar Papelera
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // ──── KPI Content ────
  const renderKpiContent = () => {
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
              8,492
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Propiedades<br/>Activas</span>
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
              124
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Propiedades<br/>Reportadas</span>
          </div>
        </div>
        <div className="bg-white dark:bg-inmo-darkcard p-3 lg:p-4 rounded-[20px] border border-gray-100 dark:border-inmo-darktertiary shadow-sm flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.03]">
            <svg viewBox="0 0 100 40" className="w-full h-full text-inmo-danger" preserveAspectRatio="none">
              <path d="M 0 40 L 0 5 Q 30 20 60 10 T 100 25 L 100 40 Z" fill="currentColor" />
              <path d="M 0 5 Q 30 20 60 10 T 100 25" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-montserrat font-black text-2xl lg:text-3xl text-inmo-danger mb-1">
              32
            </span>
            <span className="text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Propiedades<br/>Suspendidas</span>
          </div>
        </div>
      </>
    );
  };

  // ──── Main Content ────
  const mainContent = (
    <ModuleLayout
      title="Publicaciones"
      subtitle="Gestiona y modera el inventario global de la plataforma."
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
            onClick={() => { setSelectedId(null); setViewMode('trash'); }}
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
              onClick={() => { setSelectedId(null); setViewMode('trash'); }}
            />
            <Button
                variant="accent"
                className="h-[44px] !rounded-[14px] shadow-glow shrink-0 font-bold px-4 flex flex-row items-center justify-center gap-2 whitespace-nowrap"
                title="Añadir Propiedad"
                onClick={handleCreateNew}
                icon={<Plus className="w-5 h-5 shrink-0" strokeWidth={2} />}
              >
                Nueva Propiedad
              </Button>
          </div>

          {/* Container */}
          <div className="bg-white dark:bg-inmo-darkcard rounded-card border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-2">
            
            {/* Error state */}
            {isError && (
              <div className="m-4 bg-inmo-danger/10 border border-inmo-danger/20 rounded-xl p-4 text-inmo-danger text-sm">
                Ocurrió un error al cargar las propiedades: {(error as Error)?.message || 'Error desconocido'}
              </div>
            )}

            {/* Loading state */}
            {isListLoading && !isError && (
              <div className="flex items-center justify-center h-32 flex-col">
                <div className="w-8 h-8 border-2 border-inmo-accent border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-sm text-gray-500">Cargando inventario...</p>
              </div>
            )}

            {/* Desktop Table */}
            {!isListLoading && !isError && (
              <div className="hidden md:block w-full flex-1 overflow-y-auto overflow-x-auto custom-scrollbar relative">
                  <table className={`w-full text-left border-collapse h-fit ${isOpen ? 'min-w-full' : 'min-w-[900px]'}`}>
                  <thead className="sticky top-0 z-10 shadow-sm">
                    <tr className="border-b border-gray-100 dark:border-inmo-darktertiary bg-gray-50/95 dark:bg-inmo-darkbg/95 backdrop-blur-md text-inmo-secondary dark:text-gray-300 font-montserrat text-sm">
                      <th className="p-4 font-bold">Propiedad</th>
                        <th className={`p-4 font-bold ${isOpen ? 'hidden' : ''}`}>Tipo</th>
                        <th className="p-4 font-bold">Precio</th>
                        <th className="p-4 font-bold text-center">Estado</th>
                        <th className={`p-4 font-bold text-center ${isOpen ? 'hidden' : ''}`}>Recámaras</th>
                        <th className={`p-4 font-bold text-center ${isOpen ? 'hidden' : ''}`}>Baños</th>
                        <th className={`p-4 font-bold text-center ${isOpen ? 'hidden' : ''}`}>Área</th>
                        <th className={`p-4 font-bold text-center ${isOpen ? 'hidden' : ''}`}>Contacto</th>
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
                        <td className={`p-4 align-middle ${isOpen ? 'hidden' : ''}`}>
                            <span className="capitalize text-sm font-medium text-gray-600 dark:text-gray-300">{prop.type}</span>
                          </td>
                          <td className="p-4 align-middle">
                            <span className="font-montserrat font-bold text-inmo-accent">{formatPrice(prop.price)}</span>
                          </td>
                          <td className="p-4 align-middle text-center">
                            <div className="flex justify-center">{getStatusBadge(prop.status)}</div>
                          </td>
                          <td className={`p-4 align-middle text-center ${isOpen ? 'hidden' : ''}`}>
                            <span className="font-montserrat text-sm font-bold text-gray-600 dark:text-gray-300">{prop.beds}</span>
                          </td>
                          <td className={`p-4 align-middle text-center ${isOpen ? 'hidden' : ''}`}>
                            <span className="font-montserrat text-sm font-bold text-gray-600 dark:text-gray-300">{prop.baths}</span>
                          </td>
                          <td className={`p-4 align-middle text-center ${isOpen ? 'hidden' : ''}`}>
                            <span className="font-montserrat text-sm font-bold text-gray-600 dark:text-gray-300">{prop.sqft}m²</span>
                          </td>
                          <td className={`p-4 align-middle text-center ${isOpen ? 'hidden' : ''}`}>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <IconButton variant="ghost" size="sm" icon={<Mail className="w-4 h-4 text-inmo-secondary dark:text-gray-400" />} title="Enviar Correo" onClick={(e) => { e.stopPropagation(); }} />
                              <IconButton variant="ghost" size="sm" icon={<MessageSquare className="w-4 h-4 text-inmo-secondary dark:text-gray-400" />} title="Enviar Mensaje" onClick={(e) => { e.stopPropagation(); }} />
                            </div>
                          </td>
                        <td className="p-4 text-right">
                          {isOpen ? (
                            <div className="flex items-center justify-end">
                              {openMenuId === prop.id && (
                                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                              )}
                              <div className="relative">
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
                                    { label: 'Ocultar', icon: <EyeOff className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); setOpenMenuId(null); } },
                                  { label: 'Reportar', icon: <AlertCircle className="w-4 h-4 shrink-0 text-yellow-500" />, onClick: (e) => { e.stopPropagation(); setOpenMenuId(null); } },
                                    
                                    { label: 'Eliminar', icon: <Trash2 className="w-4 h-4 shrink-0 text-red-500" />, onClick: (e) => { e.stopPropagation(); requestDelete(prop); setOpenMenuId(null); } },
                                  ]}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              <IconButton variant="ghost" size="sm" icon={<EyeOff className="w-4 h-4" />} title="Ocultar" onClick={(e) => { e.stopPropagation(); }} />
                              <IconButton variant="ghost" size="sm" icon={<AlertCircle className="w-4 h-4 text-yellow-500" />} title="Reportar" onClick={(e) => { e.stopPropagation(); }} />
                              
                              <IconButton variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-red-500" />} title="Eliminar" onClick={(e) => { e.stopPropagation(); requestDelete(prop); }} />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {!isListLoading && properties.length === 0 && (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-gray-500 font-inter">No se encontraron propiedades.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile List */}
              {!isListLoading && !isError && (
                <div className="flex flex-col md:hidden font-inter flex-1 overflow-y-auto custom-scrollbar pb-24">
                  {properties.map((prop, index) => (
                    <div
                      key={prop.id}
                      className={`flex flex-col p-4 relative cursor-pointer ${index !== properties.length - 1 ? 'border-b border-gray-100 dark:border-inmo-darktertiary' : ''} ${selectedId === prop.id ? 'bg-inmo-accent/5 dark:bg-inmo-accent/10' : ''} ${openMenuId === prop.id ? 'z-50' : 'z-0'}`}
                      onClick={() => { setSelectedId(prop.id); setViewMode('detail'); }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0 mt-1">
                          <img src={prop.image} alt={prop.title} className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm" />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-[3px] border-white dark:border-inmo-darkbg rounded-full ${getStatusDotColor(prop.status)} shrink-0 shadow-sm`} title={prop.status} />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-bold text-inmo-secondary dark:text-white line-clamp-2 text-sm leading-tight flex-1 pr-1">{prop.title}</span>
                            <div className="relative shrink-0">
                              {openMenuId === prop.id && (
                                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                              )}
                              <button
                                className="p-1 -mt-1 -mr-2 text-gray-400 hover:text-inmo-secondary dark:hover:text-white transition-colors relative z-50"
                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === prop.id ? null : prop.id); }}
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>
                              <div className="relative z-50">
                                <ActionMenu
                                  isOpen={openMenuId === prop.id}
                                  onClose={() => setOpenMenuId(null)}
                                  items={[
                                  { label: 'Ocultar', icon: <EyeOff className="w-4 h-4 shrink-0" />, onClick: (e) => { e.stopPropagation(); setOpenMenuId(null); } },
                                  { label: 'Reportar', icon: <AlertCircle className="w-4 h-4 shrink-0 text-yellow-500" />, onClick: (e) => { e.stopPropagation(); setOpenMenuId(null); } },
                                  
                                  { label: 'Eliminar', icon: <Trash2 className="w-4 h-4 shrink-0 text-red-500" />, onClick: (e) => { e.stopPropagation(); requestDelete(prop); setOpenMenuId(null); } },
                                ]}
                              />
                              </div>
                            </div>
                          </div>
                          
                          <span className="font-montserrat font-bold text-inmo-accent mt-1">{formatPrice(prop.price)}</span>
                        </div>
                      </div>
                      
                      {/* Métricas y Amenidades (Mobile Compact) */}
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 font-montserrat">
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-gray-400" /> {prop.views}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-gray-400" /> {prop.messages}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 font-montserrat tracking-wide ml-auto">
                          <span>{prop.beds} REC</span>
                          <span>•</span>
                          <span>{prop.baths} BA</span>
                          <span>•</span>
                          <span>{prop.sqft} m²</span>
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
    const WIZARD_TITLES = ['¿Qué tipo de operación es?', 'Tipo de Inmueble', 'Ubicación y Precio', 'Características', 'Multimedia'];
  const sideTitle = isCreating
    ? WIZARD_TITLES[wizardStep]
    : isCreatingVisual
      ? 'Diseño Visual de la Publicación'
      : isEditing
        ? 'Editar Publicación'
        : viewMode === 'trash'
          ? 'Papelera'
          : 'Detalle de Propiedad';

  return (
    <>
      <SplitViewLayout
        isOpen={isOpen}
        onClose={() => {
          if (isCreating && isWizardDirty) {
            setShowCancelModal(true);
          } else {
            if (isCreating) {
              setSelectedId(null);
              setWizardStep(0);
            }
            setSelectedTrashIds([]);
            setViewMode('list');
          }
        }}
        sideTitle={sideTitle}
        sideContent={renderSideContent()}
        sidePanelWidthClass={isCreating ? (wizardStep >= 2 ? 'md:w-[50%]' : 'md:w-[40%] lg:w-[30%]') : 'md:w-[50%]'}
        mainPanelWidthClass={isCreating ? (wizardStep >= 2 ? 'md:w-[50%]' : 'md:w-[60%] lg:w-[70%]') : 'md:w-[50%]'}
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

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          setShowCancelModal(false);
          setIsWizardDirty(false);
          setSelectedId(null);
          setWizardStep(0);
          setViewMode('list');
        }}
        title="¿Descartar publicación?"
        message="Tienes información sin guardar en este formulario. Si sales ahora, perderás tu progreso."
        confirmText="Sí, salir"
        cancelText="Continuar editando"
        confirmVariant="danger"
      />
    </>
  );
};
