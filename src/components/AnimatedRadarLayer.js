// src/components/AnimatedRadarLayer.js
import L from 'leaflet';

class AnimatedRadarLayer extends L.Layer {
  constructor(options = {}) {
    super();
    this.frames = [];
    this.currentFrameIndex = 0;
    this.interval = null;
    this.options = {
      opacity: 0.6,
      ...options
    };
  }

  onAdd(map) {
    this.map = map;
    this.fetchFrames();
    return this;
  }

  onRemove(map) {
    this.stopAnimation();
    if (this.currentLayer) {
      map.removeLayer(this.currentLayer);
    }
    return this;
  }

  async fetchFrames() {
    try {
      const response = await fetch('https://tilecache.rainviewer.com/api/maps.json');
      const data = await response.json();
      this.frames = data;
      if (this.frames.length > 0) {
        this.startAnimation();
      }
    } catch (error) {
      console.error('Failed to fetch radar frames:', error);
    }
  }

  startAnimation() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
      this.updateRadarLayer();
    }, 3000); // 3 seconds per frame

    // Show first frame immediately
    this.updateRadarLayer();
  }

  stopAnimation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  updateRadarLayer() {
    if (!this.frames.length || !this.map) return;

    const currentFrame = this.frames[this.currentFrameIndex];
    
    // Remove previous layer
    if (this.currentLayer) {
      this.map.removeLayer(this.currentLayer);
    }

    // Add new layer
    this.currentLayer = L.tileLayer(
      `https://tilecache.rainviewer.com/v2/radar/${currentFrame}/256/{z}/{x}/{y}/2/1_1.png`,
      {
        opacity: this.options.opacity,
        attribution: 'Radar data © RainViewer'
      }
    );

    this.currentLayer.addTo(this.map);
  }
}

export default AnimatedRadarLayer;
