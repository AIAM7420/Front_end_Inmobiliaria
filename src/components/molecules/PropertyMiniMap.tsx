import React, { useCallback, useState, useEffect } from 'react';
import { Map, Marker } from '@vis.gl/react-google-maps';
import { useAppContext } from '../../context/AppContext';
import { mapStyles, createSvgIcon } from '../../utils/mapStyles';

interface PropertyMiniMapProps {
  lat: number;
  lng: number;
  propertyType?: string;
  onLocationChange?: (lat: number, lng: number) => void;
}

export const PropertyMiniMap: React.FC<PropertyMiniMapProps> = ({ lat, lng, propertyType, onLocationChange }) => {
  const isEditable = !!onLocationChange;
  const { isDarkMode } = useAppContext();
  
  // Local state for center to allow panning without snapping back immediately
  const [center, setCenter] = useState({ lat, lng });

  // Update center when props change (e.g. initial load or external update)
  useEffect(() => {
    setCenter({ lat, lng });
  }, [lat, lng]);

  const handleDragEnd = useCallback((e: any) => {
    if (!onLocationChange || !e.latLng) return;
    const newLat = typeof e.latLng.lat === 'function' ? e.latLng.lat() : e.latLng.lat;
    const newLng = typeof e.latLng.lng === 'function' ? e.latLng.lng() : e.latLng.lng;
    onLocationChange(newLat, newLng);
    setCenter({ lat: newLat, lng: newLng });
  }, [onLocationChange]);

  const handleMapClick = useCallback((e: any) => {
    if (!onLocationChange || !e.detail || !e.detail.latLng) return;
    onLocationChange(e.detail.latLng.lat, e.detail.latLng.lng);
    setCenter({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
  }, [onLocationChange]);

  const handleCameraChange = useCallback((ev: any) => {
    setCenter(ev.detail.center);
  }, []);

  return (
    <Map
      defaultZoom={15}
      center={center}
      onCameraChanged={handleCameraChange}
      onClick={isEditable ? handleMapClick : undefined}
      gestureHandling={isEditable ? 'greedy' : 'none'}
      disableDefaultUI={true}
      className="w-full h-full rounded-[20px] overflow-hidden"
      styles={isDarkMode ? mapStyles.dark : mapStyles.light}
    >
      <Marker 
        position={{ lat, lng }} 
        draggable={isEditable}
        onDragEnd={handleDragEnd}
        icon={{ url: createSvgIcon(propertyType || 'Casa', 15) }}
      />
    </Map>
  );
};
