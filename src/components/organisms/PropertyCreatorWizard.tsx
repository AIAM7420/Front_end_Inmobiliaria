import React, { useState } from 'react';
import {
  Home,
  Building2,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Maximize,
  Key,
  Map,
  Store,
  Image as ImageIcon,
  Trash2,
  X
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { NumberField } from '../atoms/NumberField';
import { Select } from '../atoms/Select';
import { Textarea } from '../atoms/Textarea';
import { AmenitySelector } from '../atoms/AmenitySelector';
import { AccountTypeCard } from '../molecules/AccountTypeCard';
import { StepIndicator } from '../molecules/StepIndicator';
import { PropertyMiniMap } from '../molecules/PropertyMiniMap';
import type { PropiedadCrearDTO, PropertyTag } from '../../types/property';

export interface PropertyCreatorWizardProps {
  onCancel: () => void;
  onSave: (dto: PropiedadCrearDTO) => void;
  onProceedToVisual?: (dto: PropiedadCrearDTO) => void;
  initialData?: Partial<PropiedadCrearDTO>;
  isSubmitting?: boolean;
  onStepChange?: (step: number) => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

const STEP_LABELS = ['Operación', 'Inmueble', 'Ubicación', 'Características', 'Multimedia'];

const AMENITY_OPTIONS = [
  { icon: Home, label: 'Estacionamiento' },
  { icon: Key, label: 'Alberca' },
  { icon: Building2, label: 'Gimnasio' },
  { icon: MapPin, label: 'Jardín' },
  { icon: Store, label: 'Seguridad 24h' },
  { icon: Map, label: 'Elevador' },
];

export const PropertyCreatorWizard: React.FC<PropertyCreatorWizardProps> = ({
  onCancel,
  onSave,
  onProceedToVisual,
  initialData,
  isSubmitting = false,
  onStepChange,
  onDirtyChange,
}) => {
  const [step, setStep] = useState(0);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagText, setNewTagText] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({
    id: Date.now(),
    type: '',
    operationType: '',
    propertyType: '',
    title: '',
    location: '',
    price: '',
    description: '',
    beds: '',
    baths: '',
    sqft: '',
    lat: 21.16,
    lng: -101.69,
    tags: [] as PropertyTag[],
    image: '',
    gallery: [] as string[],
    amenities: [] as string[],
    status: 'Borrador',
    ...initialData,
  });

  const update = (field: string, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  React.useEffect(() => {
    if (onDirtyChange) {
      const isDirty = formData.operationType !== '' || formData.propertyType !== '' || formData.title !== '' || formData.location !== '';
      onDirtyChange(isDirty);
    }
  }, [formData.operationType, formData.propertyType, formData.title, formData.location, onDirtyChange]);

  const nextStep = () => {
    const s = Math.min(step + 1, 4);
    setStep(s);
    onStepChange?.(s);
  };
  const prevStep = () => {
    const s = Math.max(step - 1, 0);
    setStep(s);
    onStepChange?.(s);
  };

  const buildDTO = (): PropiedadCrearDTO => ({
    title: formData.title,
    location: formData.location,
    price: Number(formData.price),
    beds: Number(formData.beds),
    baths: Number(formData.baths),
    sqft: Number(formData.sqft),
    type: formData.propertyType?.toLowerCase() || formData.type || 'casa',
    operationType: formData.operationType || formData.type,
    propertyType: formData.propertyType,
    description: formData.description,
    lat: formData.lat,
    lng: formData.lng,
    image: formData.image,
    gallery: formData.gallery,
    tags: formData.tags,
    amenities: formData.amenities,
  });

  const handleFinish = () => {
    const dto = buildDTO();
    if (onProceedToVisual) {
      onProceedToVisual(dto);
    } else {
      onSave(dto);
    }
  };

  const handleAddGalleryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && formData.gallery.length < 10) {
      update('gallery', [...formData.gallery, URL.createObjectURL(file)]);
    }
  };

  const handleRemoveGalleryImage = (idx: number) => {
    const newGallery = [...formData.gallery];
    newGallery.splice(idx, 1);
    update('gallery', newGallery);
  };

  const toggleAmenity = (label: string) => {
    const current: string[] = formData.amenities || [];
    if (current.includes(label)) {
      update('amenities', current.filter((a: string) => a !== label));
    } else {
      update('amenities', [...current, label]);
    }
  };

  const isStepValid = (stepIndex: number) => {
    switch(stepIndex) {
      case 0: return !!formData.operationType;
      case 1: return !!formData.propertyType;
      case 2: return !!formData.title && !!formData.location && !!formData.price;
      case 3: return !!formData.beds && !!formData.baths && !!formData.sqft;
      case 4: return true;
      default: return false;
    }
  }

  // ──── Step 0: Operación ────
  const renderStepOperacion = () => (
    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 justify-center">
      <div className="mb-2 shrink-0 text-center">
        <p className="text-sm text-gray-500 mt-2">Selecciona si deseas vender o rentar tu propiedad.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 shrink-0">
        <AccountTypeCard
          icon={<Key className="w-8 h-8" strokeWidth={1.5} />}
          title="Venta"
          description=""
          isSelected={formData.operationType === 'venta'}
          onClick={() => update('operationType', 'venta')}
        />
        <AccountTypeCard
          icon={<Home className="w-8 h-8" strokeWidth={1.5} />}
          title="Renta"
          description=""
          isSelected={formData.operationType === 'renta'}
          onClick={() => update('operationType', 'renta')}
        />
      </div>
    </div>
  );

  // ──── Step 1: Inmueble ────
  const renderStepInmueble = () => (
    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 justify-center">
      <div className="mb-2 shrink-0 text-center">
        <p className="text-sm text-gray-500 mt-2">Selecciona la categoría que mejor describa tu propiedad.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 shrink-0">
        {[
          { icon: <Home className="w-8 h-8" strokeWidth={1.5} />, label: 'Casa' },
          { icon: <Building2 className="w-8 h-8" strokeWidth={1.5} />, label: 'Departamento' },
          { icon: <Map className="w-8 h-8" strokeWidth={1.5} />, label: 'Terreno' },
          { icon: <Store className="w-8 h-8" strokeWidth={1.5} />, label: 'Comercial' },
        ].map(opt => (
          <AccountTypeCard
            key={opt.label}
            icon={opt.icon}
            title={opt.label}
            description=""
            isSelected={formData.propertyType === opt.label}
            onClick={() => update('propertyType', opt.label)}
          />
        ))}
      </div>
    </div>
  );

  // ──── Step 2: Ubicación ────
    const renderStepUbicacion = () => (
    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 py-4">
      <div className="mb-2 shrink-0 text-center">
        <p className="text-sm text-gray-500 mt-2">Configura los datos principales de la propiedad.</p>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 h-full">
          {/* Left Column */}
          <div className="flex flex-col gap-2 h-full">
            <Input className="text-sm placeholder:text-gray-400 font-inter"
              placeholder="Título (ej. Residencia en El Campestre)"
              value={formData.title}
              onChange={(e) => update('title', e.target.value)}
            />
            <Input className="text-sm placeholder:text-gray-400 font-inter"
              placeholder="Dirección completa"
              leftIcon={<MapPin className="w-5 h-5 text-gray-400" />}
              value={formData.location}
              onChange={(e) => update('location', e.target.value)}
            />
            <Input className="text-sm placeholder:text-gray-400 font-inter"
              type="number"
              placeholder="Precio (MXN)"
              leftIcon={<DollarSign className="w-5 h-5 text-gray-400" />}
              value={formData.price}
              onChange={(e) => update('price', e.target.value)}
            />
            <Textarea
              placeholder="Escribe una descripción detallada..."
              value={formData.description}
              onChange={(e) => update('description', e.target.value)}
              className="flex-1 min-h-[100px] resize-none text-sm placeholder:text-gray-400 font-inter"
              wrapperClassName="flex-1"
              containerClassName="flex-1"
            />
          </div>
          {/* Right Column */}
          <div className="w-full h-full min-h-[200px] bg-gray-50 dark:bg-inmo-darkbg rounded-[20px] overflow-hidden relative border-2 border-transparent focus-within:border-inmo-accent transition-colors group">
            <PropertyMiniMap
              lat={formData.lat || 21.160}
              lng={formData.lng || -101.690}
              propertyType={formData.propertyType || formData.operationType}
              onLocationChange={(lat, lng) => { update('lat', lat); update('lng', lng); }}
            />
            <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-inmo-secondary dark:text-white">Ajustar Ubicación</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepCaracteristicas = () => (
    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 py-4">
      <div className="mb-2 shrink-0 text-center">
        <p className="text-sm text-gray-500 mt-2">Dimensiones y amenidades del inmueble.</p>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="grid grid-cols-3 gap-2">
          <Input className="text-sm placeholder:text-gray-400 font-inter"
            type="number"
            placeholder="Recámaras"
            leftIcon={<Bed className="w-5 h-5 text-gray-400" />}
            value={formData.beds}
            onChange={(e) => update('beds', e.target.value)}
          />
          <Input className="text-sm placeholder:text-gray-400 font-inter"
            type="number"
            placeholder="Baños"
            leftIcon={<Bath className="w-5 h-5 text-gray-400" />}
            value={formData.baths}
            onChange={(e) => update('baths', e.target.value)}
          />
          <Input className="text-sm placeholder:text-gray-400 font-inter"
            type="number"
            placeholder="Área (m²)"
            leftIcon={<Maximize className="w-5 h-5 text-gray-400" />}
            value={formData.sqft}
            onChange={(e) => update('sqft', e.target.value)}
          />
        </div>

        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-2">Amenidades</span>
        <div className="grid grid-cols-3 gap-2">
          {AMENITY_OPTIONS.map(am => (
            <AmenitySelector
              key={am.label}
              icon={am.icon}
              label={am.label}
              selected={(formData.amenities || []).includes(am.label)}
              onClick={() => toggleAmenity(am.label)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Etiquetas (Opcional)</span>
          <div className="flex flex-wrap gap-2 overflow-y-auto flex-1 min-h-[80px] custom-scrollbar pr-1 content-start">
            {(formData.tags as PropertyTag[]).map((tag, i) => (
              <span key={i} className="text-sm bg-inmo-accent/10 text-inmo-accent px-3 py-1.5 rounded-lg font-bold uppercase">{tag.text}</span>
            ))}
            {isAddingTag ? (
                <input
                  autoFocus
                  type="text"
                  value={newTagText}
                  onChange={(e) => setNewTagText(e.target.value)}
                  onBlur={() => {
                    if (newTagText.trim()) {
                      update('tags', [...formData.tags, { text: newTagText.trim(), variant: 'secondary' as const }]);
                    }
                    setNewTagText('');
                    setIsAddingTag(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (newTagText.trim()) {
                        update('tags', [...formData.tags, { text: newTagText.trim(), variant: 'secondary' as const }]);
                      }
                      setNewTagText('');
                      setIsAddingTag(false);
                    } else if (e.key === 'Escape') {
                      setNewTagText('');
                      setIsAddingTag(false);
                    }
                  }}
                  className="text-sm bg-inmo-accent/10 text-inmo-accent px-3 py-1.5 rounded-lg font-bold uppercase outline-none border border-inmo-accent min-w-[120px] placeholder:text-inmo-accent/50 placeholder:normal-case focus:ring-2 focus:ring-inmo-accent/50 transition-all"
                  placeholder="Nuevo tag..."
                />
              ) : (
                <button
                  onClick={() => setIsAddingTag(true)}
                  className="text-sm bg-gray-50 dark:bg-inmo-darktertiary border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:text-inmo-accent hover:border-inmo-accent transition-colors px-3 py-1.5 rounded-lg font-bold uppercase"
                >
                  + Agregar Tag
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );

  // ──── Step 4: Multimedia ────
  const renderStepMultimedia = () => (
    <div className="w-full flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 py-4">
      <div className="mb-2 shrink-0 text-center">
        <p className="text-sm text-gray-500 mt-2">Sube las fotos de tu propiedad.</p>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        <div className="w-full relative rounded-[24px] overflow-hidden bg-gray-50 dark:bg-inmo-darkbg flex-1 border-2 border-dashed border-gray-300 dark:border-gray-700 group flex flex-col items-center justify-center min-h-[160px]">
          <input type="file" id="wizard-hero-upload" className="hidden" accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) update('image', URL.createObjectURL(file));
            }}
          />
          {formData.image ? (
            <>
              <img src={formData.image} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
              <label htmlFor="wizard-hero-upload" className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer">
                <ImageIcon className="w-10 h-10 text-inmo-secondary dark:text-white mb-2 drop-shadow-md" />
                <span className="text-inmo-secondary dark:text-white font-bold text-sm bg-white/80 dark:bg-black/50 px-5 py-2.5 rounded-full backdrop-blur-sm shadow-lg border border-white/20">Cambiar Foto</span>
              </label>
            </>
          ) : (
            <label htmlFor="wizard-hero-upload" className="flex flex-col items-center justify-center text-gray-400 cursor-pointer w-full h-full absolute inset-0">
              <ImageIcon className="w-14 h-14 mb-3 opacity-50" />
              <span className="text-lg font-bold">Subir Foto Principal</span>
            </label>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <h3 className="font-montserrat font-bold text-sm text-inmo-secondary dark:text-white">Galería</h3>
            <span className="text-sm font-bold text-gray-400">{formData.gallery.length} / 10 fotos</span>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2 [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
            {formData.gallery.map((img: string, i: number) => (
              <div key={i} className="relative w-[120px] h-[80px] rounded-[16px] shrink-0 snap-center border border-gray-200 dark:border-gray-700 overflow-hidden group">
                <img src={img} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer" onClick={() => handleRemoveGalleryImage(i)}>
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
            {formData.gallery.length < 10 && (
              <label className="w-[120px] h-[80px] rounded-[16px] shrink-0 snap-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-inmo-darkbg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-inmo-darktertiary transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handleAddGalleryImage} />
                <div className="w-8 h-8 rounded-full bg-inmo-accent/20 flex items-center justify-center mb-1">
                  <span className="text-inmo-accent font-bold leading-none text-xl">+</span>
                </div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Añadir</span>
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const STEPS = [renderStepOperacion, renderStepInmueble, renderStepUbicacion, renderStepCaracteristicas, renderStepMultimedia];

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-inmo-darkcard overflow-hidden relative">
      {/* TIMELINE */}
      <div className="pt-4 pb-4 shrink-0 flex justify-center border-b border-gray-100 dark:border-white/10">
         <StepIndicator steps={STEP_LABELS} currentStep={step} className="max-w-[300px] w-full" />
      </div>

      {/* CONTENT (80%) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 relative">
        {STEPS[step]()}
      </div>

      {/* FOOTER (10%) */}
      <div className="h-[10%] min-h-[80px] flex items-center justify-between gap-4 px-6 border-t border-gray-100 dark:border-white/10 shrink-0 bg-white dark:bg-inmo-darkcard z-10">
        <Button variant="secondary" onClick={step === 0 ? onCancel : prevStep} className="flex-1 !rounded-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-inmo-darkbg dark:hover:bg-white/10 dark:text-gray-300 border-none font-bold text-sm">
          {step === 0 ? 'Cancelar' : 'Atrás'}
        </Button>
        <Button 
          variant="accent" 
          onClick={step === STEPS.length - 1 ? handleFinish : nextStep} 
          disabled={!isStepValid(step) || (step === STEPS.length - 1 && isSubmitting)} 
          className="flex-1 !rounded-full py-3 font-bold shadow-sm text-sm"
        >
          {step === STEPS.length - 1 ? (isSubmitting ? 'Guardando...' : (onProceedToVisual ? 'Diseño Visual' : 'Publicar')) : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
};
