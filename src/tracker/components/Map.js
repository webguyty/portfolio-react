import React, { useEffect, useState } from 'react';
import mapAPI from '../mapApi';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

const Map = ({ lat, long }) => {
  useEffect(() => {
    mapboxgl.accessToken = mapAPI;
    let map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [long, lat], // starting position [lng, lat]
      zoom: 10,
    });
  }, [lat, long]);

  return <div id="map" className="map"></div>;
};

export default Map;
