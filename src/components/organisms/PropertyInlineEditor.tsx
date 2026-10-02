import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Image as ImageIcon,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { AmenitySelector } from '../atoms/AmenitySelector';
import { PropertyMiniMap } from '../molecules/PropertyMiniMap';
import { useUpdateProperty, usePropertyDetail, isConflictError } from '../../hooks/useProperties';
import { useToast } from '../../context/ToastContext';
import type { PropertyDetail, PropertyTag, PropiedadPatchDTO } from '../../types/property';

export interface PropertyInlineEditorProps {
  propertyId: number;
  onSave?: (updated: PropertyDetail) => void;
  onCancel: () => void;
  /** For backward compat: pre-loaded data used when creating (not editing existing) */
  initialData?: any;
}

export const PropertyInlineEditor: React.FC<PropertyInlineEditorProps> = ({
  propertyId,
  onSave,
  onCancel,
  initialData,
}) => {
  const { addToast } = useToast();
  const updateMutation = useUpdateProperty();

  // Fetch the latest detail with its ETag
  const { data: detail, isLoading, refetch } = usePropertyDetail(propertyId);

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [conflictError, setConflictError] = useState(false);

  // Seed form data when detail arrives
  useEffect(() => {
    if (detail) {
      setFormData({
        title: detail.title,
        location: detail.location,
        price: detail.price,
        type: detail.type,
        operationType: detail.operationType || (detail.tags?.some(t => t.variant === 'renta') ? 'renta' : 'venta'),
        beds: detail.beds,
        baths: detail.baths,
        sqft: detail.sqft,
        description: detail.description || '',
        lat: detail.lat,
        lng: detail.lng,
        image: detail.image,
        gallery: detail.gallery || [],
        tags: detail.tags || [],
        amenities: detail.amenities || [],
      });
      setConflictError(false);
    } else if (initialData) {
      setFormData({ ...initialData, gallery: initialData.gallery || [], tags: initialData.tags || [], amenities: initialData.amenities || [] });
    }
  }, [detail, initialData]);

  const update = (field: string, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleAddGalleryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (formData.gallery?.length ?? 0) < 10) {
      update('gallery', [...(formData.gallery || []), URL.createObjectURL(file)]);
    }
  };

  const handleRemoveGalleryImage = (idx: number) => {
    const g = [...formData.gallery];
    g.splice(idx, 1);
    update('gallery', g);
  };

  const handleRemoveTag = (idx: number) => {
    const t = [...formData.tags];
    t.splice(idx, 1);
    update('tags', t);
  };

  const handleAddTag = () => {
    const val = prompt('Nuevo Tag (ej. Pet Friendly, Remodelada):');
    if (val?.trim()) {
      update('tags', [...formData.tags, { text: val.trim(), variant: 'secondary' }]);
    }
  };

  const handleSave = async () => {
    if (!detail) return;

    const dto: PropiedadPatchDTO = {
      title: formData.title,
      location: formData.location,
      price: Number(formData.price),
      beds: Number(formData.beds),
      baths: Number(formData.baths),
      sqft: Number(formData.sqft),
      type: formData.type,
      operationType: formData.operationType,
      description: formData.description,
      lat: formData.lat,
      lng: formData.lng,
      image: formData.image,
      gallery: formData.gallery,
      tags: formData.tags,
      amenities: formData.amenities,
    };

    try {
      const updated = await updateMutation.mutateAsync({
        id: propertyId,
        dto,
        etag: detail.etag,
      });
      addToast('update', 'Cambios guardados', 'La información de la propiedad ha sido actualizada con éxito.');
      onSave?.(updated);
    } catch (err) {
      if (isConflictError(err)) {
        setConflictError(true);
        addToast('error', 'Conflicto de versión', 'La propiedad fue modificada por otro proceso. Recarga e intenta de nuevo.');
      } else {
        addToast('error', 'Error', 'No se pudo guardar los cambios.');
      }
    }
  };

  if (isLoading || Object.keys(formData).length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-inmo-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col relative bg-white dark:bg-inmo-darkcard h-full w-full overflow-hidden">
      {/* Conflict banner */}
      {conflictError && (
        <div className="mx-4 mt-4 flex items-center gap-3 bg-inmo-warning/10 border border-inmo-warning/30 rounded-xl p-3 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-inmo-warning shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-inmo-secondary dark:text-white">Conflicto de versión (HTTP 412)</p>
            <p className="text-xs text-gray-500">Otro proceso modificó esta propiedad. Recarga para obtener la versión actual.</p>
          </div>
          <Button variant="accent" className="!py-1.5 !px-4 !rounded-full text-xs font-bold shrink-0" onClick={() => { refetch(); setConflictError(false); }}>
            Recargar
          </Button>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-[100px]">
        {/* Hero Image */}
        <div className="w-full relative rounded-[32px] overflow-hidden bg-gray-50 dark:bg-inmo-darkbg shrink-0 border-2 border-dashed border-gray-300 dark:border-gray-700 group flex flex-col items-center justify-center min-h-[300px]">
          <input type="file" id="hero-upload" className="hidden" accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) update('image', URL.createObjectURL(file));
            }}
          />
          {formData.image ? (
            <>
              <img src={formData.image} alt="Hero" className="absolute inset-0 w-full h-[300px] object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
              <label htmlFor="hero-upload" className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer">
                <ImageIcon className="w-8 h-8 text-inmo-secondary dark:text-white mb-2 drop-shadow-md" />
                <span className="text-inmo-secondary dark:text-white font-bold text-sm bg-white/80 dark:bg-black/50 px-5 py-2.5 rounded-full backdrop-blur-sm shadow-lg border border-white/20">Cambiar Foto Principal</span>
              </label>
            </>
          ) : (
            <label htmlFor="hero-upload" className="flex flex-col items-center justify-center text-gray-400 cursor-pointer w-full h-full absolute inset-0">
              <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
              <span className="text-base font-bold">Subir Foto Principal</span>
            </label>
          )}
        </div>

        <div className="p-6 flex flex-col gap-5 flex-1">
          {/* Title & Location */}
          <div>
            <input
              className="text-[22px] font-montserrat font-bold text-inmo-secondary dark:text-white mb-2 leading-tight bg-transparent border-b-2 border-dashed border-gray-300 dark:border-gray-600 focus:border-inmo-accent outline-none py-1 hover:bg-gray-50 dark:hover:bg-inmo-darkbg transition-colors w-full"
              placeholder="Título de la publicación..."
              value={formData.title || ''}
              onChange={e => update('title', e.target.value)}
            />
            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4 w-full">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <input
                className="font-medium text-sm truncate bg-transparent border-b border-dashed border-gray-300 dark:border-gray-600 focus:border-inmo-accent outline-none w-full hover:bg-gray-50 dark:hover:bg-inmo-darkbg transition-colors pb-0.5"
                placeholder="Ubicación"
                value={formData.location || ''}
                onChange={e => update('location', e.target.value)}
              />
            </div>

            {/* Price */}
            <div className="flex items-center">
              <div className="flex items-baseline gap-1 border-b-2 border-dashed border-gray-300 dark:border-gray-600 focus-within:border-inmo-accent px-1 hover:bg-gray-50 dark:hover:bg-inmo-darkbg transition-colors rounded-t-lg">
                <span className="text-xl font-bold font-montserrat text-inmo-accent">$</span>
                <input
                  type="number"
                  className="text-[32px] w-[180px] font-black font-montserrat text-inmo-secondary dark:text-white tracking-tighter leading-none bg-transparent outline-none"
                  placeholder="0"
                  value={formData.price || ''}
                  onChange={e => update('price', e.target.value)}
                />
              </div>
              <select
                className="text-sm font-medium text-gray-500 ml-2 mt-2 bg-transparent border-none outline-none cursor-pointer appearance-none"
                value={formData.operationType || formData.type || 'venta'}
                onChange={e => update('operationType', e.target.value)}
              >
                <option value="venta">/Venta</option>
                <option value="renta">/Mes (Renta)</option>
              </select>
            </div>
          </div>

          <div className="w-full h-[2px] border-t-2 border-dashed border-gray-200 dark:border-gray-700" />

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {(formData.tags as PropertyTag[])?.map((tag, i) => {
              const tagText = typeof tag === 'string' ? tag : tag.text;
              return (
                <div key={i} className="group flex items-center gap-1 bg-gray-50 dark:bg-inmo-darkbg border border-dashed border-gray-300 dark:border-gray-600 px-3 py-2 rounded-xl text-gray-500 cursor-pointer hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  onClick={() => handleRemoveTag(i)} title="Click para eliminar">
                  <span className="text-[11px] font-bold tracking-wide uppercase group-hover:hidden">{tagText}</span>
                  <span className="text-[11px] font-bold tracking-wide uppercase hidden group-hover:inline">Eliminar</span>
                  <Trash2 className="w-3.5 h-3.5 hidden group-hover:block" />
                </div>
              );
            })}
            <button onClick={handleAddTag} className="flex items-center gap-1 bg-inmo-accent/10 text-inmo-accent px-3 py-2 rounded-xl hover:bg-inmo-accent/20 transition-colors">
              <span className="text-[11px] font-bold tracking-wide uppercase">+ Agregar Tag</span>
            </button>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 w-full">
            <div className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 focus-within:border-inmo-accent hover:bg-gray-100 dark:hover:bg-inmo-darktertiary transition-colors">
              <Bed className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input type="number" className="w-10 text-xs sm:text-sm font-bold text-inmo-secondary dark:text-gray-300 bg-transparent outline-none text-center" value={formData.beds || ''} onChange={e => update('beds', e.target.value)} />
              <span className="font-medium text-xs text-gray-500">Beds</span>
            </div>
            <div className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 focus-within:border-inmo-accent hover:bg-gray-100 dark:hover:bg-inmo-darktertiary transition-colors">
              <Bath className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input type="number" className="w-10 text-xs sm:text-sm font-bold text-inmo-secondary dark:text-gray-300 bg-transparent outline-none text-center" value={formData.baths || ''} onChange={e => update('baths', e.target.value)} />
              <span className="font-medium text-xs text-gray-500">Baths</span>
            </div>
            <div className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-inmo-darkbg px-2 py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 focus-within:border-inmo-accent hover:bg-gray-100 dark:hover:bg-inmo-darktertiary transition-colors">
              <Maximize className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input type="number" className="w-14 text-xs sm:text-sm font-bold text-inmo-secondary dark:text-gray-300 bg-transparent outline-none text-center" value={formData.sqft || ''} onChange={e => update('sqft', e.target.value)} />
              <span className="font-medium text-xs text-gray-500">m²</span>
            </div>
          </div>

          {/* Map */}
          <div className="w-full h-[180px] bg-gray-50 dark:bg-inmo-darkbg rounded-[20px] overflow-hidden relative shrink-0 border-2 border-transparent focus-within:border-inmo-accent transition-colors group">
            <PropertyMiniMap
              lat={formData.lat || 21.160}
              lng={formData.lng || -101.690}
              propertyType={formData.type || formData.propertyType}
              onLocationChange={(lat, lng) => { update('lat', lat); update('lng', lng); }}
            />
            <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-inmo-secondary dark:text-white">Ajustar Ubicación</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white mb-3">Descripción</h3>
            <textarea
              className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium min-h-[120px] bg-transparent border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 outline-none focus:border-inmo-accent resize-none w-full hover:bg-gray-50 dark:hover:bg-inmo-darkbg transition-colors"
              placeholder="Descripción detallada de la propiedad..."
              value={formData.description || ''}
              onChange={e => update('description', e.target.value)}
            />
          </div>

          {/* Gallery */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <h3 className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">Galería</h3>
              <span className="text-xs font-bold text-gray-400">{formData.gallery?.length || 0} / 10 fotos</span>
            </div>
            <div className="flex overflow-x-auto gap-3 pb-2 [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
              {(formData.gallery || []).map((img: string, i: number) => (
                <div key={i} className="relative w-[140px] h-[100px] rounded-[16px] shrink-0 snap-center border border-gray-200 dark:border-gray-700 overflow-hidden group">
                  <img src={img} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer" onClick={() => handleRemoveGalleryImage(i)}>
                    <Trash2 className="w-6 h-6 text-white" />
                    <span className="text-white text-[10px] font-bold mt-1">Eliminar</span>
                  </div>
                </div>
              ))}
              {(formData.gallery?.length ?? 0) < 10 && (
                <label className="w-[140px] h-[100px] rounded-[16px] shrink-0 snap-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-inmo-darkbg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-inmo-darktertiary transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={handleAddGalleryImage} />
                  <div className="w-6 h-6 rounded-full bg-inmo-accent/20 flex items-center justify-center mb-1">
                    <span className="text-inmo-accent font-bold leading-none text-lg">+</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Añadir Foto</span>
                </label>
              )}
              {Array.from({ length: Math.max(0, 3 - ((formData.gallery?.length ?? 0) + ((formData.gallery?.length ?? 0) < 10 ? 1 : 0))) }).map((_, i) => (
                <div key={`empty-${i}`} className="w-[140px] h-[100px] rounded-[16px] shrink-0 snap-center border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-inmo-darkbg/50 flex flex-col items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-300 dark:text-gray-600 opacity-50 mb-1" />
                  <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-wide opacity-50">Espacio</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 w-full px-4 pb-4 pt-8 z-20 flex justify-center bg-gradient-to-t from-white/0 to-transparent pointer-events-none">
        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] h-[64px] rounded-full flex items-center justify-between px-2 w-full max-w-[400px] pointer-events-auto">
          <div className="flex items-center gap-2 pl-2 w-full">
            <Button
              variant="secondary"
              className="flex-1 !rounded-full !py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-inmo-darkbg dark:hover:bg-inmo-darktertiary font-bold text-sm border-none shadow-none text-gray-600 dark:text-gray-300"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="accent"
              className="flex-1 !rounded-full !py-2.5 shadow-glow font-bold text-sm"
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
