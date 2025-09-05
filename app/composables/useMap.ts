export const useMap = () => {
  const buildString = (street: string, zip: string, city: string, country: string) => `${street}, ${zip} ${city}, ${country}`;
  const buildUrl = (street: string, zip: string, city: string, country: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(buildString(street, zip, city, country))}`;

  return {
    buildString,
    buildUrl,
  };
};
