import React, { useEffect, useState } from 'react';
import mapAPI from '../mapApi';
import mapboxgl from 'mapbox-gl';

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

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
