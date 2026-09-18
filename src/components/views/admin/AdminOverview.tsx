import React, { useState } from 'react';
import { Bell, Users, Building2, TrendingUp, CreditCard, ShieldAlert, Activity } from 'lucide-react';
import { BottomSheet } from '../../organisms/BottomSheet';

export const AdminOverview: React.FC = () => {
  const [isUsersSheetOpen, setIsUsersSheetOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 md:gap-4 h-full w-full pt-[100px] pb-[100px] px-4 md:px-6 animate-in fade-in">
      
      {/* 1. Header Flotante */}
      <header className="flex justify-between items-center mb-1 shrink-0">
        <div className="ml-4 md:ml-6">
          <h1 className="font-montserrat font-bold text-2xl text-inmo-secondary dark:text-white">Hola, Admin</h1>
          <p className="font-inter text-sm text-gray-500 dark:text-gray-400">Panel de Control Global</p>
        </div>
        <button className="p-3 bg-white dark:bg-inmo-darkcard rounded-full shadow-soft text-inmo-secondary dark:text-white hover:bg-gray-100 dark:hover:bg-inmo-darktertiary transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* 2. Fila 1 - Económicas y Crecimiento */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 shrink-0">
        <div className="col-span-1 bg-white dark:bg-inmo-darkcard rounded-3xl p-4 shadow-soft flex flex-col justify-between">
          <div className="flex justify-between items-start mb-1">
            <p className="font-inter text-xs text-gray-500 dark:text-gray-400">Ingresos (MRR)</p>
            <div className="p-1 bg-green-50 dark:bg-gray-800 rounded-full text-green-500">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-center py-2">
            <span className="font-montserrat font-bold text-3xl md:text-4xl text-inmo-secondary dark:text-white">$42k</span>
          </div>
          <p className="font-inter text-[10px] md:text-xs text-inmo-success font-medium">+12% vs mes anterior</p>
        </div>

        <div className="col-span-1 bg-white dark:bg-inmo-darkcard rounded-3xl p-4 shadow-soft flex flex-col justify-between relative">
          <div className="flex justify-between items-start mb-1">
            <p className="font-inter text-xs text-gray-500 dark:text-gray-400">Suscripciones</p>
            <div className="p-1 bg-blue-50 dark:bg-gray-800 rounded-full text-blue-500">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-center py-2">
            <span className="font-montserrat font-bold text-3xl md:text-4xl text-inmo-secondary dark:text-white">184</span>
          </div>
          <p className="font-inter text-[10px] md:text-xs text-gray-400 font-medium">Asesores PRO</p>
        </div>
      </div>

      {/* 3. Panel Visual: Actividad del Sistema */}
      <div className="flex-auto min-h-[160px] flex flex-col relative shrink gap-2 md:gap-3">
        <div className="relative z-10 shrink-0 flex justify-between items-center px-2">
          <h3 className="font-montserrat font-bold text-base md:text-lg text-inmo-secondary dark:text-white">Tráfico Semanal</h3>
        </div>
        <div className="flex-1 w-full bg-white dark:bg-inmo-darkcard rounded-[32px] p-5 relative overflow-hidden shadow-soft flex flex-col justify-end gap-4 border-4 border-white dark:border-inmo-darkcard">
          <div className="flex justify-between items-end h-full pt-4">
            {/* Barras de tráfico simuladas */}
            {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
              <div key={i} className="w-[10%] flex flex-col justify-end h-full gap-2 group">
                <div 
                  className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-sm relative transition-all duration-300 group-hover:bg-inmo-accent"
                  style={{ height: `${height}%` }}
                >
                  <div 
                    className="absolute bottom-0 w-full bg-gray-300 dark:bg-gray-600 rounded-t-sm group-hover:bg-inmo-accent"
                    style={{ height: `${height * 0.4}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-inter font-medium px-1">
            <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
          </div>
        </div>
      </div>

      {/* 4. Fila Gestión: Moderación y Base de Usuarios */}
      <div className="flex flex-row gap-3 md:gap-4 shrink-0">
        
        {/* Moderación */}
        <div className="w-[40%] bg-red-50 dark:bg-gray-800 border border-red-200 dark:border-gray-700 rounded-3xl p-4 shadow-soft flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-inmo-danger dark:text-red-400" />
            <p className="font-inter text-xs text-inmo-danger dark:text-red-400 font-semibold">Reportes</p>
          </div>
          <div>
            <span className="font-montserrat font-bold text-3xl md:text-4xl text-inmo-danger dark:text-red-400">3</span>
            <p className="font-inter text-[10px] text-red-400 mt-1">Requieren atención</p>
          </div>
        </div>

        {/* Total Usuarios */}
        <div className="w-[60%] bg-white dark:bg-inmo-darkcard rounded-3xl p-4 shadow-soft flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <p className="font-inter text-xs text-gray-500 dark:text-gray-400">Total Usuarios</p>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-montserrat font-bold text-3xl md:text-4xl text-inmo-secondary dark:text-white">12.4k</span>
            <div className="flex flex-col gap-2 w-1/2">
              <button 
                onClick={() => setIsUsersSheetOpen(true)}
                className="w-full bg-gray-50 dark:bg-inmo-darkbg rounded-xl py-2 flex items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                <Activity className="w-3.5 h-3.5 text-inmo-secondary dark:text-white" />
                <span className="font-inter font-semibold text-[10px] text-inmo-secondary dark:text-white">Detalles</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SHEETS */}
      <BottomSheet isOpen={isUsersSheetOpen} onClose={() => setIsUsersSheetOpen(false)} title="Distribución de Usuarios">
        <div className="flex flex-col gap-8">
          
          <div className="w-full flex flex-col items-center justify-center mt-2">
            <div className="relative w-52 h-52 rounded-full border-[20px] border-inmo-accent border-r-gray-100 dark:border-r-inmo-darktertiary flex items-center justify-center transform -rotate-45 shadow-sm">
              <div className="transform rotate-45 flex flex-col items-center justify-center w-full h-full">
                <span className="font-montserrat font-black text-5xl text-inmo-secondary dark:text-white leading-none">85%</span>
                <span className="font-inter text-sm text-gray-500 font-medium mt-1">Públicos</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-inmo-accent shadow-sm"></div>
                <span className="font-inter text-sm text-gray-600 dark:text-gray-300 font-medium">Públicos (10.5k)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-gray-200 dark:bg-inmo-darktertiary shadow-sm"></div>
                <span className="font-inter text-sm text-gray-600 dark:text-gray-300 font-medium">Asesores (1.9k)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-inter font-semibold text-sm text-inmo-secondary dark:text-white">Asesores por Nivel</h4>
            <div className="bg-white dark:bg-inmo-darkcard rounded-3xl p-5 border border-gray-100 dark:border-inmo-darktertiary shadow-soft flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-500">
                    <Building2 className="w-5 h-5"/>
                  </div>
                  <span className="font-inter text-sm font-semibold text-inmo-secondary dark:text-white">Agencias Inmobiliarias</span>
                </div>
                <span className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">45</span>
              </div>
              <div className="w-full h-px bg-gray-50 dark:bg-inmo-darktertiary"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                    <CreditCard className="w-5 h-5"/>
                  </div>
                  <span className="font-inter text-sm font-semibold text-inmo-secondary dark:text-white">Asesores PRO</span>
                </div>
                <span className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">184</span>
              </div>
              <div className="w-full h-px bg-gray-50 dark:bg-inmo-darktertiary"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-inmo-darkbg flex items-center justify-center text-gray-500">
                    <Users className="w-5 h-5"/>
                  </div>
                  <span className="font-inter text-sm font-semibold text-inmo-secondary dark:text-white">Asesores Gratuitos</span>
                </div>
                <span className="font-montserrat font-bold text-lg text-inmo-secondary dark:text-white">1,671</span>
              </div>
            </div>
          </div>

        </div>
      </BottomSheet>

    </div>
  );
};
