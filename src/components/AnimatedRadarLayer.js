// src/components/AnimatedRadarLayer.js
import { TileLayer } from 'react-leaflet';
import { useEffect, useState } from 'react';

export default function AnimatedRadarLayer() {
  const [frames, setFrames] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Fetch animation frames on mount
  useEffect(() => {
    fetch('https://tilecache.rainviewer.com/api/maps.json')
      .then((res) => res.json())
      .then((data) => setFrames(data));
  }, []);

  // Loop through radar frames
  useEffect(() => {
    if (!frames.length) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((i) => (i + 1) % frames.length);
    }, 3000); // speed: 500ms/frame

    return () => clearInterval(interval);
  }, [frames]);

  if (!frames.length) return null;

  const currentFrame = frames[currentFrameIndex];

  return (
    <TileLayer
      url={`https://tilecache.rainviewer.com/v2/radar/${currentFrame}/256/{z}/{x}/{y}/2/1_1.png`}
      opacity={0.6}
      attribution="Radar data © RainViewer"
    />
  );
}
