import React, { useState } from 'react';
import { Navigation, MapPin, ExternalLink, Compass, Check } from 'lucide-react';
import { getCurrentUserLocation, openGoogleMapsItinerary } from '../utils/geolocation';
import { ThemeColor } from '../types';
import { getThemeStyles } from '../utils/themeStyles';

interface LiveItineraryButtonProps {
  venueName: string;
  venueAddress: string;
  destinationLat?: number;
  destinationLng?: number;
  className?: string;
  themeColor?: ThemeColor;
  language?: 'fr' | 'en';
}

export const LiveItineraryButton: React.FC<LiveItineraryButtonProps> = ({
  venueName,
  venueAddress,
  destinationLat = 7.3824,
  destinationLng = 3.8643,
  className = '',
  themeColor,
  language = 'fr',
}) => {
  const isEn = language === 'en';
  const theme = getThemeStyles(themeColor);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleLaunchItinerary = async () => {
    setLoading(true);
    setFeedback(isEn ? 'Locating your GPS coordinates...' : 'Calcul de votre position GPS...');

    try {
      const userLoc = await getCurrentUserLocation();
      setFeedback(isEn ? 'Opening Google Maps itinerary...' : 'Ouverture de l’itinéraire Google Maps...');
      setTimeout(() => {
        openGoogleMapsItinerary(
          destinationLat,
          destinationLng,
          `${venueName}, ${venueAddress}`,
          userLoc.latitude,
          userLoc.longitude
        );
        setLoading(false);
        setFeedback(null);
      }, 600);
    } catch (err: any) {
      console.warn('GPS inaccessible ou refusé, ouverture directe par adresse:', err);
      setFeedback(isEn ? 'Opening destination on Maps...' : 'Ouverture de la destination...');
      setTimeout(() => {
        openGoogleMapsItinerary(
          destinationLat,
          destinationLng,
          `${venueName}, ${venueAddress}`
        );
        setLoading(false);
        setFeedback(null);
      }, 500);
    }
  };

  return (
    <div className={`w-full bg-neutral-900/90 border ${theme.borderColor} rounded-2xl p-3 shadow-md space-y-2 text-xs ${className}`}>
      <div className="flex items-start gap-2">
        <MapPin className={`w-4 h-4 ${theme.accentText} shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className={`font-semibold ${theme.accentLightText}`}>{venueName}</p>
          <p className="text-[11px] text-neutral-400 leading-tight">{venueAddress}</p>
        </div>
      </div>

      {/* Main One-Tap GPS Route */}
      <button
        type="button"
        onClick={handleLaunchItinerary}
        disabled={loading}
        className={`w-full py-2.5 px-3 bg-gradient-to-r ${theme.buttonGradient} text-neutral-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow transition-all cursor-pointer text-xs active:scale-95`}
      >
        {loading ? (
          <>
            <Compass className="w-3.5 h-3.5 animate-spin text-neutral-950" />
            <span>{feedback || (isEn ? 'Searching GPS...' : 'Recherche GPS...')}</span>
          </>
        ) : (
          <>
            <Navigation className="w-3.5 h-3.5 fill-neutral-950" />
            <span>{isEn ? 'Directions from my GPS position' : 'Itinéraire direct vers le culte'}</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </>
        )}
      </button>

      {/* Alternative Navigation Apps */}
      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
        <a
          href={`https://waze.com/ul?ll=${destinationLat},${destinationLng}&navigate=yes`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-1 px-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 rounded-lg text-[10px] flex items-center justify-center gap-1 border border-neutral-800 transition-colors"
        >
          <Navigation className="w-2.5 h-2.5 text-sky-400" />
          <span>Waze GPS</span>
        </a>
        <a
          href={`https://maps.apple.com/?daddr=${destinationLat},${destinationLng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-1 px-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 rounded-lg text-[10px] flex items-center justify-center gap-1 border border-neutral-800 transition-colors"
        >
          <Navigation className="w-2.5 h-2.5 text-neutral-200" />
          <span>Apple Maps</span>
        </a>
      </div>

      <p className="text-[10px] text-center text-neutral-500">
        {isEn
          ? 'Guides you with live voice navigation directly to the church gate'
          : 'Guidage GPS vocal en direct jusqu’au portail de l’église'}
      </p>
    </div>
  );
};
