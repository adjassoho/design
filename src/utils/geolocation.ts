// Utility for GPS Itinerary deep linking to Google Maps or Apple Maps

export interface GeoLocationResult {
  latitude: number;
  longitude: number;
}

export function getCurrentUserLocation(): Promise<GeoLocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La géolocalisation n’est pas supportée par votre navigateur.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

export function openGoogleMapsItinerary(
  destinationLat: number,
  destinationLng: number,
  destinationName?: string,
  userLat?: number,
  userLng?: number
) {
  let url = '';
  if (userLat && userLng) {
    url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destinationLat},${destinationLng}&travelmode=driving`;
  } else {
    // If user location is not directly available, open destination navigation
    const query = destinationName ? encodeURIComponent(destinationName) : `${destinationLat},${destinationLng}`;
    url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}

export function formatWhatsAppMessage(
  guestName: string | null,
  deceasedName: string,
  inviteUrl: string,
  isCollective: boolean = false
): string {
  if (isCollective) {
    return encodeURIComponent(
      `🕊️ *Faire-part & Programme des Obsèques*\n\n` +
      `La famille vous invite à rendre un dernier hommage à notre regretté(e) *${deceasedName}*.\n\n` +
      `Consultez la carte animée, le programme des cultes, l'itinéraire GPS et laissez votre message de condoléances ici :\n` +
      `👉 ${inviteUrl}\n\n` +
      `_« J'ai combattu le bon combat, j'ai achevé la course, j'ai gardé la foi. »_`
    );
  }

  return encodeURIComponent(
    `🕊️ *Faire-part d'Obsèques & Invitation Personnelle*\n\n` +
    `Bonjour ${guestName || 'Cher(e) Ami(e)'},\n\n` +
    `La famille vous convie personnellement aux obsèques et à la célébration de la vie de notre cher *${deceasedName}*.\n\n` +
    `Votre faire-part nominatif, le programme des offices et l'accès direct à l'itinéraire sont disponibles sur votre lien personnel :\n` +
    `👉 ${inviteUrl}\n\n` +
    `Merci de bien vouloir confirmer votre présence via ce lien.`
  );
}
