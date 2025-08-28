export const useMap = () => {
  const buildUrl = (street: string, zip: string, city: string, country: string) => {
    const address = `${street}, ${zip} ${city}, ${country}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return {
    buildUrl,
  };
};
