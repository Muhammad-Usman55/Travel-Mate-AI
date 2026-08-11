'use client';

import { useEffect, useState } from 'react';

interface MapViewProps {
  latitude: number;
  longitude: number;
  name?: string;
}

export function MapView({ latitude, longitude, name }: MapViewProps) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const L = (window as any).L;
      if (!L) return;
      const map = L.map('map').setView([latitude, longitude], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);
      L.marker([latitude, longitude]).addTo(map)
        .bindPopup(name || 'Location')
        .openPopup();
      setMapReady(true);
    };
    document.head.appendChild(script);
  }, [latitude, longitude, name]);

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden">
      <div id="map" className="w-full h-full" />
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
