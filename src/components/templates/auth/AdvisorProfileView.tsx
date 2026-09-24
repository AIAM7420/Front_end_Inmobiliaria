import React, { useState } from 'react';
import { FileText, Fingerprint, Award, Clock, MapPin, AlignLeft, Send } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Textarea } from '../../atoms/Textarea';
import { FileDropZone } from '../../atoms/FileDropZone';
import { StepIndicator } from '../../molecules/StepIndicator';
import { AuthHeader } from '../../molecules/AuthHeader';
import type { AuthView } from './LoginView';

interface AdvisorProfileViewProps {
  onNavigate: (view: AuthView) => void;
}

export const AdvisorProfileView: React.FC<AdvisorProfileViewProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState<0 | 1>(0);

  return (
    <div className={`bg-white dark:bg-inmo-darkbg min-h-screen w-full flex flex-col items-center px-6 transition-colors overflow-y-auto pb-12 ${
      currentStep === 0 ? 'justify-start pt-10' : 'justify-center py-10'
    }`}>
      {/* Step Indicator */}
      <StepIndicator
        steps={['Datos', 'Identificación', 'Listo']}
        currentStep={currentStep}
        className="max-w-sm mb-8"
      />

      {/* Header */}
      <AuthHeader 
        title="Completa tu perfil profesional" 
        subtitle="Necesitamos verificar tu información para habilitar tu cuenta de asesor." 
      />

      {/* Step 0 — Datos */}
      {currentStep === 0 && (
        <form
          onSubmit={(e) => { e.preventDefault(); setCurrentStep(1); }}
          className="w-full max-w-sm flex flex-col gap-5 animate-in fade-in -mt-2"
        >
          <Input
            placeholder="RFC"
            leftIcon={<FileText className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
          />
          <Input
            placeholder="CURP"
            leftIcon={<Fingerprint className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
          />
          <Input
            placeholder="Licencia Inmobiliaria"
            leftIcon={<Award className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
          />
          <Input
            placeholder="Años de experiencia"
            type="number"
            leftIcon={<Clock className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
          />
          <Input
            placeholder="Zona de operación"
            leftIcon={<MapPin className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
          />
          <Textarea
            placeholder="Biografía profesional"
            leftIcon={<AlignLeft className="w-5 h-5 text-gray-400" strokeWidth={1.5} />}
            className="min-h-[140px]"
            wrapperClassName="mb-6"
          />
          <Button type="submit" variant="accent" className="w-full h-14 mt-8">
            Siguiente
          </Button>
        </form>
      )}

      {/* Step 1 — Identificación */}
      {currentStep === 1 && (
        <div className="w-full max-w-sm flex flex-col gap-5 animate-in fade-in -mt-2">
          <p className="text-body text-center font-bold">
            Sube tu identificación oficial (INE/IFE)
          </p>

          <FileDropZone
            onFileSelect={() => {}}
            label="Frente de tu identificación"
            hint="Imagen JPG o PNG, máx. 10MB"
            accept="image/jpeg,image/png"
            maxSizeMB={10}
          />

          <FileDropZone
            onFileSelect={() => {}}
            label="Reverso de tu identificación"
            hint="Imagen JPG o PNG, máx. 10MB"
            accept="image/jpeg,image/png"
            maxSizeMB={10}
          />

          <Button
            type="button"
            variant="accent"
            className="w-full h-14 mt-2"
            icon={<Send className="w-5 h-5" strokeWidth={2} />}
            onClick={() => onNavigate('advisor-pending')}
          >
            Enviar para Revisión
          </Button>

          <Button
            type="button"
            variant="tertiary"
            className="w-full h-14"
            onClick={() => setCurrentStep(0)}
          >
            Anterior
          </Button>
        </div>
      )}
    </div>
  );
};
