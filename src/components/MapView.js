import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AnimatedRadarLayer from './AnimatedRadarLayer';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const friends = [
  { id: 1, name: "Mom", status: "Safe", lat: 29.7604, lng: -95.3698 },
  { id: 2, name: "Alex", status: "In Risk Zone", lat: 32.7767, lng: -96.7970 },
];

export default function MapView({ center }) {
  const mapCenter = Array.isArray(center) ? center : [29.7604, -95.3698];

  return (
    <MapContainer
      center={mapCenter}
      zoom={6}
      style={{ height: '100vh', width: '100%' }}
      key={`${mapCenter[0]}_${mapCenter[1]}`}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <AnimatedRadarLayer />

      {friends.map((friend) => (
        <Marker key={friend.id} position={[friend.lat, friend.lng]}>
          <Popup>
            <strong>{friend.name}</strong><br />
            Status: {friend.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
