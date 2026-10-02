import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Image as ImageIcon,
  EyeOff,
  Eye,
  Handshake,
  MoreVertical,
  MapPin,
  MessageSquare,
  Power
} from 'lucide-react';
import { Button } from '../../atoms/Button';
import { IconButton } from '../../atoms/IconButton';
import { Badge } from '../../atoms/Badge';
import { SearchBar } from '../../molecules/SearchBar';
import { Select } from '../../atoms/Select';
import { MOCK_PROPERTIES } from '../../../data/mockProperties';

export const AsesorInventoryView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Enriquecer datos con estados simulados y métricas
  const properties = MOCK_PROPERTIES.map((p, index) => {
    let status: 'Activa' | 'Pausada' | 'Borrador' = 'Activa';
    if (index % 3 === 1) status = 'Pausada';
    if (index % 3 === 2) status = 'Borrador';

    return {
      ...p,
      status,
      views: Math.floor(Math.random() * 500) + 50,
      messages: Math.floor(Math.random() * 20),
    };
  });

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Activa':
        return <Badge variant="success" text="Activa" />;
      case 'Pausada':
        return <Badge variant="warning" text="Pausada" />;
      case 'Borrador':
        return <Badge variant="secondary" text="Borrador" />;
      default:
        return null;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 h-full w-full pt-[100px] pb-[100px] px-4 md:px-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-montserrat font-bold text-2xl text-inmo-secondary dark:text-white">
          Inventario de Propiedades
        </h1>
        <Button variant="accent" icon={<Plus className="w-5 h-5" />}>
          Añadir Propiedad
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        <div className="w-full md:flex-1">
          <SearchBar 
            size="slim" 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Buscar por título o ubicación..."
            glass={false}
          />
        </div>
        <div className="w-full md:w-64">
          <Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            wrapperClassName="!h-[44px]"
            className="!text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="activa">Activa</option>
            <option value="pausada">Pausada</option>
            <option value="borrador">Borrador</option>
          </Select>
        </div>
      </div>

      {/* Container List/Table */}
      <div className="bg-white dark:bg-inmo-darkcard rounded-card border border-gray-100 dark:border-inmo-darktertiary shadow-soft overflow-hidden">
        
        {/* Desktop Table */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-inmo-darktertiary bg-gray-50 dark:bg-inmo-darkbg text-inmo-secondary dark:text-gray-300 font-montserrat text-sm">
                <th className="p-4 font-bold">Propiedad</th>
                <th className="p-4 font-bold">Tipo / Precio</th>
                <th className="p-4 font-bold">Estado</th>
                <th className="p-4 font-bold">Métricas</th>
                <th className="p-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="font-inter">
              {filteredProperties.map(prop => (
                <tr key={prop.id} className="border-b border-gray-50 dark:border-inmo-darktertiary hover:bg-gray-50 dark:hover:bg-inmo-darktertiary transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img src={prop.image} alt={prop.title} className="w-16 h-16 rounded-atom object-cover shrink-0" />
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
                    <div className="flex items-center justify-end gap-1">
                      <IconButton variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} title="Editar" />
                      <IconButton variant="ghost" size="sm" icon={<ImageIcon className="w-4 h-4" />} title="Fotos" />
                      <IconButton variant="ghost" size="sm" icon={prop.status === 'Activa' ? <EyeOff className="w-4 h-4" /> : <Power className="w-4 h-4" />} title={prop.status === 'Activa' ? 'Pausar' : 'Activar'} />
                      <IconButton variant="ghost" size="sm" icon={<Handshake className="w-4 h-4" />} title="Colaboración" />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProperties.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-inter">No se encontraron propiedades.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="flex flex-col md:hidden font-inter">
          {filteredProperties.map((prop, index) => (
            <div key={prop.id} className={`flex flex-col p-4 ${index !== filteredProperties.length - 1 ? 'border-b border-gray-100 dark:border-inmo-darktertiary' : ''}`}>
              <div className="flex gap-4">
                <img src={prop.image} alt={prop.title} className="w-20 h-20 rounded-atom object-cover shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-inmo-secondary dark:text-white line-clamp-2 text-sm leading-tight">
                      {prop.title}
                    </span>
                    <button className="p-1 -mt-1 -mr-2 text-gray-400 hover:text-inmo-secondary shrink-0">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </span>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="font-montserrat font-bold text-inmo-accent text-sm">
                      {formatPrice(prop.price)}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{prop.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between mt-4 gap-2 border-t border-gray-50 dark:border-inmo-darktertiary pt-3">
                {getStatusBadge(prop.status)}
                <div className="flex items-center gap-1">
                  <IconButton variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} title="Editar" />
                  <IconButton variant="ghost" size="sm" icon={<ImageIcon className="w-4 h-4" />} title="Fotos" />
                  <IconButton variant="ghost" size="sm" icon={prop.status === 'Activa' ? <EyeOff className="w-4 h-4" /> : <Power className="w-4 h-4" />} title={prop.status === 'Activa' ? 'Pausar' : 'Activar'} />
                  <IconButton variant="ghost" size="sm" icon={<Handshake className="w-4 h-4" />} title="Colaboración" />
                </div>
              </div>
            </div>
          ))}
          {filteredProperties.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm font-inter">No se encontraron propiedades.</div>
          )}
        </div>

      </div>
    </div>
  );
};