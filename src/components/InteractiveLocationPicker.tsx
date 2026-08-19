import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Search,
  Crosshair,
  Navigation,
  ExternalLink,
  Check,
  Compass,
  Building2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { ThemeColor } from '../types';
import { getThemeStyles } from '../utils/themeStyles';

// Custom SVG Gold Pin with high visibility for Leaflet
const createGoldIcon = () => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="36" height="48">
      <defs>
        <radialGradient id="goldGrad" cx="30%" cy="20%" r="80%">
          <stop offset="0%" stop-color="#FFF3D1"/>
          <stop offset="40%" stop-color="#E5BE65"/>
          <stop offset="100%" stop-color="#996515"/>
        </radialGradient>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.8"/>
        </filter>
      </defs>
      <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 16.2 28.8 16.9 29.5.6.6 1.6.6 2.2 0C19.8 46.8 36 31.5 36 18 36 8.06 27.94 0 18 0z" fill="url(#goldGrad)" filter="url(#shadow)" stroke="#4A2E00" stroke-width="1.5"/>
      <circle cx="18" cy="18" r="10" fill="#171717" stroke="#E5BE65" stroke-width="1.5"/>
      <!-- Cross symbol -->
      <path d="M18 11v14 M13 16h10" stroke="#FFF3D1" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `;

  return L.divIcon({
    html: svgString,
    className: 'custom-gold-leaflet-pin',
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -44],
  });
};

interface InteractiveLocationPickerProps {
  latitude: number;
  longitude: number;
  venueName: string;
  venueAddress: string;
  onLocationChange: (lat: number, lng: number, suggestedAddress?: string) => void;
  onVenueNameChange?: (name: string) => void;
  themeColor?: ThemeColor;
  language?: 'fr' | 'en';
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export const InteractiveLocationPicker: React.FC<InteractiveLocationPickerProps> = ({
  latitude,
  longitude,
  venueName,
  venueAddress,
  onLocationChange,
  onVenueNameChange,
  themeColor = 'imperial-gold',
  language = 'fr',
}) => {
  const isEn = language === 'en';
  const theme = getThemeStyles(themeColor);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState<string | null>(null);

  // Initialize Leaflet map and auto-detect current GPS location
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Use current coordinates or default center
    const hasValidCoords = Number.isFinite(latitude) && Number.isFinite(longitude) && latitude !== 0 && longitude !== 0;
    const initialLat = hasValidCoords ? latitude : 6.3654;
    const initialLng = hasValidCoords ? longitude : 2.4183;

    // Initialize Map
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark-styled crisp OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    }).addTo(map);

    // Draggable Marker with Gold Cross Pin
    const goldIcon = createGoldIcon();
    const marker = L.marker([initialLat, initialLng], {
      icon: goldIcon,
      draggable: true,
      autoPan: true,
    }).addTo(map);

    // Handle marker dragend
    marker.on('dragend', async () => {
      const pos = marker.getLatLng();
      const newLat = parseFloat(pos.lat.toFixed(6));
      const newLng = parseFloat(pos.lng.toFixed(6));
      await handlePositionSelected(newLat, newLng, false);
    });

    // Handle map click to reposition marker
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const newLat = parseFloat(e.latlng.lat.toFixed(6));
      const newLng = parseFloat(e.latlng.lng.toFixed(6));
      marker.setLatLng([newLat, newLng]);
      await handlePositionSelected(newLat, newLng, false);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Proactively request and detect current user GPS position on first initialization if default
    if (!hasValidCoords && navigator.geolocation) {
      setIsLocatingUser(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const userLat = parseFloat(pos.coords.latitude.toFixed(6));
          const userLng = parseFloat(pos.coords.longitude.toFixed(6));
          setIsLocatingUser(false);
          marker.setLatLng([userLat, userLng]);
          map.setView([userLat, userLng], 16);
          await handlePositionSelected(userLat, userLng, false);
        },
        (err) => {
          console.warn('Auto-geolocate notice (using standard fallback):', err.message);
          setIsLocatingUser(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }

    // Invalidate size to handle modals gracefully
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Sync external coordinates if updated
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentPos.lat - latitude) > 0.0001 ||
        Math.abs(currentPos.lng - longitude) > 0.0001
      ) {
        markerRef.current.setLatLng([latitude, longitude]);
        mapInstanceRef.current.panTo([latitude, longitude]);
      }
    }
  }, [latitude, longitude]);

  // Reverse Geocoding via OpenStreetMap Nominatim
  const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    try {
      setIsReverseGeocoding(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: { 'Accept-Language': isEn ? 'en' : 'fr' },
        }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.display_name || null;
    } catch (err) {
      console.warn('Geocoding notice:', err);
      return null;
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handlePositionSelected = async (lat: number, lng: number, panMap: boolean = true) => {
    if (panMap && mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
    }

    const addr = await reverseGeocode(lat, lng);
    if (addr) {
      setDetectedAddress(addr);
    }
    onLocationChange(lat, lng, addr || undefined);
  };

  // Perform search without ANY form submits
  const executeSearch = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setSearchMessage(null);
      setSearchResults([]);
      const query = encodeURIComponent(searchQuery.trim());
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=6`,
        {
          headers: { 'Accept-Language': isEn ? 'en' : 'fr' },
        }
      );
      if (!res.ok) {
        setSearchMessage(isEn ? 'Search failed. Please try again.' : 'Erreur de recherche. Veuillez réessayer.');
        return;
      }
      const data: SearchResult[] = await res.json();
      if (!data || data.length === 0) {
        setSearchMessage(isEn ? 'No place found. Try another church or city name.' : 'Aucun lieu trouvé. Essayez avec le nom d’une paroisse ou d’une ville.');
      } else {
        setSearchResults(data);
      }
    } catch (err) {
      console.warn('Search error:', err);
      setSearchMessage(isEn ? 'Connection error during search.' : 'Erreur réseau lors de la recherche.');
    } finally {
      setIsSearching(false);
    }
  };

  // Select a search result
  const handleSelectResult = (result: SearchResult) => {
    const lat = parseFloat(parseFloat(result.lat).toFixed(6));
    const lng = parseFloat(parseFloat(result.lon).toFixed(6));
    setSearchResults([]);
    setSearchMessage(null);
    setSearchQuery('');
    setDetectedAddress(result.display_name);

    if (onVenueNameChange && !venueName) {
      const shortName = result.display_name.split(',')[0];
      onVenueNameChange(shortName);
    }

    handlePositionSelected(lat, lng, true);
  };

  // Locate Current Device GPS
  const handleGetCurrentGPS = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!navigator.geolocation) {
      alert(isEn ? 'Geolocation is not supported by your browser.' : 'Géolocalisation non supportée par votre navigateur.');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setIsLocatingUser(false);
        handlePositionSelected(lat, lng, true);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocatingUser(false);
        alert(
          isEn
            ? 'Unable to access your GPS position. Please ensure location permissions are granted.'
            : 'Impossible d’accéder à votre position GPS. Veuillez autoriser la localisation.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Preset frequent places
  const presetPlaces = [
    { name: 'Cathédrale Notre-Dame, Cotonou', lat: 6.3571, lng: 2.4332 },
    { name: 'Paroisse Saint-Michel, Cotonou', lat: 6.3682, lng: 2.4284 },
    { name: 'Paroisse Bon Pasteur, Cadjèhoun', lat: 6.3619, lng: 2.3995 },
    { name: 'Cathédrale Notre-Dame, Porto-Novo', lat: 6.4969, lng: 2.6288 },
    { name: 'Cathédrale Saint-Paul, Abidjan', lat: 5.3308, lng: -4.0201 },
    { name: 'Cathédrale Sacré-Cœur, Lomé', lat: 6.1264, lng: 1.2222 },
  ];

  const copyCoordinates = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${latitude}, ${longitude}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <div
      className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3 sm:p-4 space-y-3 shadow-xl select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with GPS Auto-Locate Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${theme.badgeBg} ${theme.accentText} border ${theme.borderColor}`}>
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className={`font-cinzel font-bold text-xs sm:text-sm ${theme.accentLightText}`}>
              {isEn ? 'Church & Service GPS Geolocation' : 'Position GPS & Itinéraire du Culte'}
            </h4>
            <p className="text-[10px] text-neutral-400">
              {isEn
                ? 'Drag the gold pin on the map to pinpoint the exact church gate/entrance.'
                : 'Déplacez l’épingle dorée sur la carte pour désigner le portail exact de l’église.'}
            </p>
          </div>
        </div>

        {/* Current GPS Position Button */}
        <button
          type="button"
          onClick={handleGetCurrentGPS}
          disabled={isLocatingUser}
          className={`px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isLocatingUser ? 'animate-pulse' : ''
          }`}
        >
          <Crosshair className={`w-3.5 h-3.5 ${isLocatingUser ? 'animate-spin' : theme.accentText}`} />
          <span>{isLocatingUser ? (isEn ? 'Locating GPS...' : 'Détection GPS...') : (isEn ? 'My Current Position' : 'Ma position actuelle')}</span>
        </button>
      </div>

      {/* Place Search Container (NO FORM TAG TO PREVENT PARENT MODAL SUBMISSION) */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  executeSearch(e);
                }
              }}
              placeholder={
                isEn
                  ? 'Search for church, parish, city or street (e.g. Paroisse Saint-Michel Cotonou)...'
                  : 'Rechercher une église, paroisse, ville ou rue (ex: Saint-Michel Cotonou)...'
              }
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-neutral-500 text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={executeSearch}
            disabled={isSearching}
            className={`px-3.5 py-2 bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all`}
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">{isEn ? 'Search' : 'Rechercher'}</span>
          </button>
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-neutral-950 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden divide-y divide-neutral-800 max-h-56 overflow-y-auto">
            {searchResults.map((item) => (
              <button
                key={item.place_id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectResult(item);
                }}
                className="w-full px-3 py-2.5 text-left hover:bg-neutral-900 flex items-start gap-2 text-xs text-neutral-200 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-relaxed">{item.display_name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Search Message (e.g. not found) */}
        {searchMessage && (
          <p className="text-[11px] text-amber-400/90 mt-1 px-1">{searchMessage}</p>
        )}
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px]">
        <span className="text-neutral-400 shrink-0 flex items-center gap-1 font-medium">
          <Building2 className="w-3 h-3 text-amber-400" />
          <span>{isEn ? 'Quick Choices:' : 'Lieux fréquents :'}</span>
        </span>
        {presetPlaces.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePositionSelected(p.lat, p.lng, true);
            }}
            className="px-2 py-1 bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 rounded-lg text-neutral-300 hover:text-white shrink-0 cursor-pointer transition-all active:scale-95"
          >
            {p.name.split(',')[0]}
          </button>
        ))}
      </div>

      {/* Interactive Map Container */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-neutral-800 shadow-inner group">
        <div
          ref={mapContainerRef}
          className="w-full h-64 sm:h-72 bg-neutral-950 z-10"
          style={{ minHeight: '260px' }}
        />

        {/* Live Floating Pin Indicator / Coordinates Overlay */}
        <div className="absolute top-2 left-2 z-20 bg-neutral-950/90 backdrop-blur-md border border-neutral-700/80 rounded-xl px-2.5 py-1.5 shadow-lg flex items-center gap-2 text-[10px] font-mono text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </span>
          <button
            type="button"
            onClick={copyCoordinates}
            title="Copier les coordonnées GPS"
            className="text-amber-400 hover:text-white transition-colors cursor-pointer"
          >
            {copiedCoords ? <Check className="w-3 h-3 text-emerald-400" /> : <Sparkles className="w-3 h-3" />}
          </button>
        </div>

        {/* Instruction overlay pill */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-black/80 backdrop-blur-xs border border-amber-400/40 px-3 py-1 rounded-full text-[10px] text-amber-200 font-medium shadow-md whitespace-nowrap">
          {isEn ? '👆 Click or drag the gold pin to adjust position' : '👆 Cliquez ou glissez l’épingle pour ajuster'}
        </div>
      </div>

      {/* Detected Reverse Geocoded Address */}
      {detectedAddress && (
        <div className="p-2.5 bg-neutral-950/90 border border-neutral-800 rounded-xl flex items-start gap-2 text-xs">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[10px] text-neutral-400 uppercase font-semibold">
              {isEn ? 'Detected GPS Address' : 'Adresse GPS Correspondante'}
            </p>
            <p className="text-neutral-200 text-[11px] leading-tight mt-0.5">{detectedAddress}</p>
          </div>
        </div>
      )}

      {/* Direct Itinerary Test Links (Google Maps, Waze, Apple Maps) */}
      <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
        <div className="text-[10px] text-neutral-400">
          <span>{isEn ? 'Guest Navigation Preview:' : 'Aperçu du guidage invité :'}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Google Maps Test */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 sm:flex-initial px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1 border border-neutral-700 hover:text-white"
          >
            <Navigation className="w-3 h-3 text-emerald-400" />
            <span>Google Maps</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          {/* Waze Test */}
          <a
            href={`https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 sm:flex-initial px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1 border border-neutral-700 hover:text-white"
          >
            <Navigation className="w-3 h-3 text-sky-400" />
            <span>Waze</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          {/* Apple Maps Test */}
          <a
            href={`https://maps.apple.com/?daddr=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 sm:flex-initial px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1 border border-neutral-700 hover:text-white"
          >
            <Navigation className="w-3 h-3 text-neutral-200" />
            <span>Apple Maps</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        </div>
      </div>
    </div>
  );
};
