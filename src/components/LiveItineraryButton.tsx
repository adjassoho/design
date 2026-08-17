import React, { useState } from 'react';
import { Navigation, MapPin, ExternalLink, Compass, Check } from 'lucide-react';
import { getCurrentUserLocation, openGoogleMapsItinerary } from '../utils/geolocation';

interface LiveItineraryButtonProps {
  venueName: string;
  venueAddress: string;
  destinationLat?: number;
  destinationLng?: number;
  className?: string;
}

export const LiveItineraryButton: React.FC<LiveItineraryButtonProps> = ({
  venueName,
  venueAddress,
  destinationLat = 7.3824,
  destinationLng = 3.8643,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleLaunchItinerary = async () => {
    setLoading(true);
    setFeedback('Calcul de votre position GPS...');

    try {
      const userLoc = await getCurrentUserLocation();
      setFeedback('Ouverture de l’itinéraire Google Maps...');
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
      setFeedback('Ouverture de la destination...');
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
    <div className={`w-full bg-neutral-900/90 border border-amber-500/40 rounded-2xl p-3 shadow-md space-y-2 text-xs ${className}`}>
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-amber-200">{venueName}</p>
          <p className="text-[11px] text-neutral-400 leading-tight">{venueAddress}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLaunchItinerary}
        disabled={loading}
        className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow transition-all cursor-pointer text-xs"
      >
        {loading ? (
          <>
            <Compass className="w-3.5 h-3.5 animate-spin text-neutral-950" />
            <span>{feedback || 'Recherche GPS...'}</span>
          </>
        ) : (
          <>
            <Navigation className="w-3.5 h-3.5 fill-neutral-950" />
            <span>Itinéraire depuis ma position GPS</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-neutral-500">
        Ouvre directement Google Maps pour vous guider jusqu'au lieu du culte
      </p>
    </div>
  );
};
