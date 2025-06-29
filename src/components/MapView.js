import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AnimatedRadarLayer from './AnimatedRadarLayer';
import { 
  WildfireLayer, 
  HurricaneLayer, 
  TornadoLayer, 
  FloodLayer, 
  EarthquakeLayer,
  DisasterLayerControl 
} from './DisasterMapLayers';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function MapView({ friends = [], locations = [], center = [29.7604, -95.3698] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const radarLayerRef = useRef(null);
  const disasterLayersRef = useRef([]);
  const layerControlRef = useRef(null);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView(center, 10);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add radar layer
      radarLayerRef.current = new AnimatedRadarLayer();
      mapInstanceRef.current.addLayer(radarLayerRef.current);

      // Initialize disaster layers
      disasterLayersRef.current = [
        new WildfireLayer({ opacity: 0.7 }),
        new HurricaneLayer({ opacity: 0.7 }),
        new TornadoLayer({ opacity: 0.7 }),
        new FloodLayer({ opacity: 0.7 }),
        new EarthquakeLayer({ opacity: 0.7 })
      ];

      // Add disaster layers to map
      disasterLayersRef.current.forEach(layer => {
        mapInstanceRef.current.addLayer(layer);
      });

      // Add layer control
      layerControlRef.current = new DisasterLayerControl(
        mapInstanceRef.current, 
        disasterLayersRef.current
      );
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add friend markers
    friends.forEach(friend => {
      const getStatusColor = (status) => {
        switch (status) {
          case 'Safe': return '#10B981'; // green
          case 'In Risk Zone': return '#F59E0B'; // yellow
          case 'Emergency': return '#EF4444'; // red
          default: return '#6B7280'; // gray
        }
      };

      const getStatusIcon = (status) => {
        switch (status) {
          case 'Safe': return '✅';
          case 'In Risk Zone': return '⚠️';
          case 'Emergency': return '🚨';
          default: return '❓';
        }
      };

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${getStatusColor(friend.status)};
            border: 2px solid white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            👤
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([friend.lat, friend.lng], { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1F2937; font-weight: bold;">${friend.name}</h3>
            <p style="margin: 4px 0; color: #6B7280;">📧 ${friend.email}</p>
            <p style="margin: 4px 0; color: #6B7280;">📍 ${friend.lat.toFixed(4)}, ${friend.lng.toFixed(4)}</p>
            <p style="margin: 4px 0; color: #6B7280;">
              Status: <span style="color: ${getStatusColor(friend.status)}; font-weight: bold;">
                ${getStatusIcon(friend.status)} ${friend.status}
              </span>
            </p>
            <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
              Last updated: ${new Date(friend.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        `);

      markersRef.current.push(marker);
    });

    // Add location markers
    locations.forEach(location => {
      const getLocationIcon = (type) => {
        switch (type) {
          case 'Home': return '🏠';
          case 'Work': return '💼';
          case 'School': return '🎓';
          case 'Hospital': return '🏥';
          case 'Police Station': return '👮';
          case 'Fire Station': return '🚒';
          case 'Shelter': return '🏘️';
          case 'Gas Station': return '⛽';
          case 'Grocery Store': return '🛒';
          case 'Pharmacy': return '💊';
          case 'Bank': return '🏦';
          default: return '📍';
        }
      };

      const getLocationColor = (type) => {
        switch (type) {
          case 'Home': return '#3B82F6'; // blue
          case 'Work': return '#10B981'; // green
          case 'School': return '#8B5CF6'; // purple
          case 'Hospital': return '#EF4444'; // red
          case 'Police Station': return '#1E40AF'; // dark blue
          case 'Fire Station': return '#DC2626'; // dark red
          case 'Shelter': return '#F59E0B'; // yellow
          case 'Gas Station': return '#F97316'; // orange
          case 'Grocery Store': return '#22C55E'; // light green
          case 'Pharmacy': return '#EC4899'; // pink
          case 'Bank': return '#6B7280'; // gray
          default: return '#9CA3AF'; // light gray
        }
      };

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${getLocationColor(location.type)};
            border: 2px solid white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            ${getLocationIcon(location.type)}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([location.lat, location.lng], { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1F2937; font-weight: bold;">${location.name}</h3>
            <p style="margin: 4px 0; color: #6B7280;">
              Type: <span style="color: ${getLocationColor(location.type)}; font-weight: bold;">
                ${getLocationIcon(location.type)} ${location.type}
              </span>
            </p>
            <p style="margin: 4px 0; color: #6B7280;">📍 ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</p>
            ${location.description ? `<p style="margin: 4px 0; color: #6B7280; font-style: italic;">${location.description}</p>` : ''}
            <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
              Added: ${new Date(location.createdAt).toLocaleDateString()}
            </p>
          </div>
        `);

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are any, otherwise use center
    if (markersRef.current.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    } else {
      mapInstanceRef.current.setView(center, 10);
    }

    return () => {
      // Cleanup function
      if (mapInstanceRef.current) {
        markersRef.current.forEach(marker => {
          mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = [];
      }
    };
  }, [friends, locations, center]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height: '600px', 
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  );
}
