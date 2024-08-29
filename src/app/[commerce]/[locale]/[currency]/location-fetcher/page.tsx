import LocationFetcher from '@theme/components/geolocation';
import React from 'react';

const Home = () => (
  <div className='mt-[200px]'>
    <h1>Geolocation Example</h1>
    <LocationFetcher />
  </div>
);

export default Home;
