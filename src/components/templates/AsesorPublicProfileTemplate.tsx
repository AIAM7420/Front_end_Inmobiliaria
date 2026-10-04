import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Share2, MapPin, Grid, List } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton } from '../atoms/IconButton';
import { Button } from '../atoms/Button';
import { ConnectedPropertyCard } from '../organisms/ConnectedPropertyCard';
import { AdvisorContact } from '../organisms/AdvisorContact';
import { usePublicAdvisor, usePortfolio } from '../../integrations/backend/hooks/useEngagement';
import { operationError } from '../../integrations/backend/versioning';
import { SplitViewLayout } from './SplitViewLayout';
import { PropertyDetailView } from '../organisms/PropertyDetailView';


export const AsesorPublicProfileTemplate = () => {
  const { id = '' } = useParams();
  const advisor = usePublicAdvisor(id), portfolio = usePortfolio(id);
  const [display, setDisplay] = useState<'grid' | 'list'>('grid');
  const [shareError, setShareError] = useState('');
  const properties = portfolio.data?.pages.flatMap(page => page.items) ?? [];
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  const catalogContent = (
    <div className="max-w-3xl w-full mx-auto pb-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="font-montserrat font-bold text-xl md:text-2xl text-inmo-secondary dark:text-white">Portafolio Completo</h2>
        <div className="flex gap-2">
          <IconButton aria-label="Ver cuadrícula" onClick={() => setDisplay('grid')} icon={<Grid className="w-4 h-4 text-inmo-accent" />} variant="ghost" className="!p-1.5 !bg-inmo-accent/10 !rounded-md" />
          <IconButton aria-label="Ver lista" onClick={() => setDisplay('list')} icon={<List className="w-4 h-4 text-gray-400" />} variant="ghost" className="!p-1.5 !rounded-md hover:!bg-gray-100" />
        </div>
      </div>

      {portfolio.isPending ? <p role="status">Cargando portafolio…</p> : portfolio.isError ? <div role="alert"><p>{operationError(portfolio.error)}</p><Button onClick={() => void portfolio.refetch()}>Reintentar</Button></div> : <>
      <div className={display === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6' : 'grid grid-cols-1 gap-4 md:gap-6'}>
        {properties.map(property => <ConnectedPropertyCard key={property.id} property={property} onClick={() => setSelectedPropertyId(property.id)} />)}
      </div>
      {properties.length === 0 && <p className="py-8 text-gray-500">El asesor no tiene publicaciones disponibles.</p>}
      {portfolio.hasNextPage && <Button className="mt-6" variant="secondary" isLoading={portfolio.isFetchingNextPage} onClick={() => void portfolio.fetchNextPage()}>Cargar más propiedades</Button>}
      {portfolio.isFetchNextPageError && <p role="alert">No pudimos cargar más propiedades.</p>}</>}
    </div>
  );

  const mainContent = (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row overflow-hidden bg-white dark:bg-inmo-darkbg relative">

      {/* Columna Izquierda: Perfil (Mobile: Full width, Desktop: Fija) */}
      <div onScroll={event => setIsScrolled(event.currentTarget.scrollTop > 16)} className="w-full md:w-[45%] lg:w-[40%] h-full flex flex-col relative z-20 shrink-0 overflow-y-auto overscroll-contain">

        {/* Header Fijo con Transición */}
        <div className={`absolute top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-inmo-darkcard/80 backdrop-blur-xl border-b border-gray-100 dark:border-inmo-darktertiary shadow-sm'
            : 'bg-transparent'
        }`}>
          <IconButton
            icon={<ArrowLeft className={`w-5 h-5 text-inmo-secondary dark:text-white`} />}
            onClick={() => navigate(-1)}
            variant="ghost"
            className={`!p-2 !rounded-full backdrop-blur-md ${
              isScrolled
                ? 'hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary'
                : '!bg-white/50 dark:!bg-black/20 hover:!bg-white/70 dark:hover:!bg-black/40'
            }`}
          />

          {/* Título siempre visible */}
          <div className={`transition-all duration-300 font-montserrat font-semibold text-lg flex items-center gap-1.5 ${
            isScrolled ? 'text-inmo-secondary dark:text-white' : 'text-gray-800 dark:text-gray-200 drop-shadow-md'
          }`}>
            <span>Perfil del Asesor</span>
          </div>

          <IconButton
            aria-label="Compartir perfil"
            onClick={async () => { try { if (navigator.share) await navigator.share({ title: advisor.data?.nombre_comercial, url: location.href }); else await navigator.clipboard.writeText(location.href); setShareError('Enlace compartido o copiado.'); } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) setShareError('No pudimos compartir. Copia el enlace de la barra de dirección.'); } }}
            icon={<Share2 className={`w-5 h-5 text-inmo-secondary dark:text-white`} />}
            variant="ghost"
            className={`!p-2 !rounded-full backdrop-blur-md ${
              isScrolled
                ? 'hover:!bg-gray-100 dark:hover:!bg-inmo-darktertiary'
                : '!bg-white/50 dark:!bg-black/20 hover:!bg-white/70 dark:hover:!bg-black/40'
            }`}
          />
        </div>

        {/* The profile scrolls independently when real content exceeds the viewport. */}
        <div className="flex-1 flex flex-col pt-16 px-4 pb-6 max-w-md mx-auto w-full">

          {/* Imagen Hero (Ajustada para caber sin scroll) */}
          <div className="w-full relative z-10 shrink-[2]">
            <div className="w-full h-full min-h-[300px] max-h-[45vh] rounded-card overflow-hidden shadow-sm relative group">
              <img
                src={advisor.data?.fotografia_url ?? '/avatar-placeholder.svg'}
                alt="Foto del Asesor"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {advisor.isError && <p role="alert">{operationError(advisor.error)}</p>}
          {shareError && <p role="status" className="text-xs text-gray-500 mt-3">{shareError}</p>}
          {/* Info del Asesor */}
          <div className="pt-6 space-y-4 shrink-0 flex-1 flex flex-col justify-center">
            <div className="flex flex-col items-start text-left">
              <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-inmo-secondary dark:text-white flex items-center justify-start gap-2">
                {advisor.data?.nombre_comercial ?? 'Cargando perfil…'}
                {advisor.data?.validado && <CheckCircle2 aria-label="Asesor validado" className="w-6 h-6 text-inmo-accent shrink-0" />}
              </h1>
              <div className="flex items-center justify-start gap-1.5 text-gray-500 dark:text-gray-400 mt-1">
                <MapPin className="w-4 h-4" />
                <span className="font-inter text-sm">{advisor.data ? 'Miembro desde ' + new Date(advisor.data.incorporado_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long' }) : 'Cargando…'}</span>
              </div>
            </div>

            <p className="font-inter text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed text-left line-clamp-3">
              {advisor.data?.descripcion ?? 'Este asesor todavía no ha añadido una descripción.'}
            </p>

            <div className="flex items-center justify-start gap-6 pt-1 pb-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">{advisor.data?.propiedades_publicas ?? '—'}</span>
                <span className="font-inter text-sm text-gray-500 dark:text-gray-400">Propiedades</span>
              </div>

            </div>

            <div className="pt-2 flex flex-row gap-3 w-full">
              <div className="flex-1 min-w-0"><AdvisorContact advisorId={id} /></div>
              <Button variant="secondary" className="md:hidden flex-1 !rounded-full !py-3.5 !text-body" icon={<Grid className="w-5 h-5" />} onClick={() => setIsCatalogOpen(true)}>
                Portafolio
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Portafolio (Solo Desktop) */}
      <div className="hidden md:flex w-full md:w-[55%] lg:w-[60%] h-full flex-col overflow-y-auto bg-gray-50 dark:bg-inmo-darkcard px-6 lg:px-12 py-10 pt-[100px]">
        {catalogContent}
      </div>

    </div>
  );

  return (
    <>
      <SplitViewLayout
        mainContent={mainContent}
        sideContent={
          selectedProperty ? (
            <div className="h-full relative flex flex-col">
              <Button
                variant="ghost"
                icon={<ArrowLeft className="w-4 h-4" />}
                className="mb-2 self-start"
                onClick={() => setSelectedPropertyId(null)}
              >
                Volver al portafolio
              </Button>
              <PropertyDetailView
                propertyId={selectedProperty.id} preview={selectedProperty}
                layout="vertical"
              />
            </div>
          ) : catalogContent
        }
        isOpen={isCatalogOpen || selectedPropertyId !== null}
        onClose={() => {
          setIsCatalogOpen(false);
          setSelectedPropertyId(null);
        }}
        sideTitle={selectedProperty ? "Detalle de Propiedad" : "Portafolio"}
        wrapperClassName="bg-white dark:bg-inmo-darkbg"
        sidePanelWidthClass="w-[60%] lg:w-[50%]"
        mainPanelWidthClass="w-[40%] lg:w-[50%]"
        sidePosition="right"
      />


    </>
  );
};
