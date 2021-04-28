import React, { useEffect, useState } from 'react';
import mapAPI from '../mapApi';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

const Map = () => {
  // const [map, setMap] = useState()

  useEffect(() => {
    mapboxgl.accessToken = mapAPI;
    let map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9,
    });
    // return () => {
    //   cleanup
    // }
  }, []);

  return <div id="map" className="map"></div>;
};

export default Map;
