'use client';

import React, { useState, useEffect } from 'react';

const LocationFetcher = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            setLocation({
              latitude,
              longitude,
              country: data.address.country,
              city:
                data.address.city || data.address.town || data.address.village,
              country_code: data.address.country_code
            });
          } catch (err) {
            setError('Failed to fetch location data');
          }
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Current Location</h1>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
      <p>Country: {location.country}</p>
      <p>City: {location.city}</p>
      <p>code: {location.country_code}</p>
    </div>
  );
};

export default LocationFetcher;
