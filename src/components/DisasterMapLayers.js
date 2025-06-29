import L from 'leaflet';

// Base class for disaster map layers
class DisasterMapLayer extends L.Layer {
  constructor(options = {}) {
    super();
    this.options = {
      opacity: 0.7,
      visible: false,
      ...options
    };
    this.currentLayer = null;
    this.layerElements = []; // Array to store all layer elements
  }

  onAdd(map) {
    this.map = map;
    if (this.options.visible) {
      this.show();
    }
    return this;
  }

  onRemove(map) {
    this.hide();
    return this;
  }

  show() {
    if (this.layerElements.length > 0 && this.map) {
      this.layerElements.forEach(element => {
        if (element && !this.map.hasLayer(element)) {
          element.addTo(this.map);
        }
      });
    }
  }

  hide() {
    if (this.layerElements.length > 0 && this.map) {
      this.layerElements.forEach(element => {
        if (element && this.map.hasLayer(element)) {
          this.map.removeLayer(element);
        }
      });
    }
  }

  setOpacity(opacity) {
    this.options.opacity = opacity;
    this.layerElements.forEach(element => {
      if (element) {
        // Handle different types of Leaflet layers
        if (element.setOpacity) {
          // Tile layers have setOpacity method
          element.setOpacity(opacity);
        } else if (element.setStyle) {
          // Circles and other styled elements
          element.setStyle({ fillOpacity: opacity });
        }
      }
    });
  }

  // Helper method to add elements to the layer
  addLayerElement(element) {
    if (element) {
      this.layerElements.push(element);
      if (this.map && this.options.visible) {
        element.addTo(this.map);
      }
    }
  }
}

// Wildfire Layer
export class WildfireLayer extends DisasterMapLayer {
  constructor(options = {}) {
    super(options);
    this.name = 'Wildfire';
    this.icon = '🔥';
    this.description = 'Active wildfire locations and burn areas';
  }

  onAdd(map) {
    super.onAdd(map);
    this.createLayer();
    return this;
  }

  createLayer() {
    // Using NASA FIRMS (Fire Information for Resource Management System) data
    // This is a demo implementation - in production you'd want to use real-time data
    const tileLayer = L.tileLayer(
      'https://firms.modaps.eosdis.nasa.gov/api/area/csv/{z}/{x}/{y}/MODIS_NRT/world/1',
      {
        opacity: this.options.opacity,
        attribution: 'Fire data © NASA FIRMS',
        maxZoom: 8
      }
    );

    this.addLayerElement(tileLayer);

    // Add demo wildfire markers for demonstration
    const demoWildfires = [
      { lat: 34.0522, lng: -118.2437, name: 'Los Angeles Wildfire', intensity: 'High', area: '2,500 acres' },
      { lat: 37.7749, lng: -122.4194, name: 'San Francisco Fire', intensity: 'Medium', area: '1,200 acres' },
      { lat: 29.7604, lng: -95.3698, name: 'Houston Area Fire', intensity: 'Low', area: '500 acres' },
    ];

    demoWildfires.forEach(fire => {
      const intensityColor = fire.intensity === 'High' ? '#FF4444' : 
                           fire.intensity === 'Medium' ? '#FF8800' : '#FFCC00';
      
      const icon = L.divIcon({
        className: 'wildfire-marker',
        html: `
          <div style="
            background-color: ${intensityColor};
            border: 2px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(255,0,0,0.5);
            animation: pulse 2s infinite;
          ">
            🔥
          </div>
          <style>
            @keyframes pulse {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.2); opacity: 0.8; }
              100% { transform: scale(1); opacity: 1; }
            }
          </style>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([fire.lat, fire.lng], { icon })
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1F2937; font-weight: bold;">🔥 ${fire.name}</h3>
            <p style="margin: 4px 0; color: #6B7280;">
              Intensity: <span style="color: ${intensityColor}; font-weight: bold;">${fire.intensity}</span>
            </p>
            <p style="margin: 4px 0; color: #6B7280;">Area: ${fire.area}</p>
            <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">Last updated: ${new Date().toLocaleString()}</p>
          </div>
        `);

      this.addLayerElement(marker);
    });
  }
}

// Hurricane Layer
export class HurricaneLayer extends DisasterMapLayer {
  constructor(options = {}) {
    super(options);
    this.name = 'Hurricane';
    this.icon = '🌀';
    this.description = 'Hurricane tracks and storm surge predictions';
  }

  onAdd(map) {
    super.onAdd(map);
    this.createLayer();
    return this;
  }

  createLayer() {
    // Demo hurricane data
    const hurricaneData = {
      name: 'Hurricane Demo',
      category: 3,
      center: [29.7604, -95.3698],
      radius: 200, // km
      windSpeed: 120, // mph
      direction: 'NW'
    };

    // Create hurricane circle
    const hurricaneCircle = L.circle(hurricaneData.center, {
      color: '#FF4444',
      fillColor: '#FF6666',
      fillOpacity: this.options.opacity,
      radius: hurricaneData.radius * 1000, // Convert to meters
      weight: 2
    });

    this.addLayerElement(hurricaneCircle);

    // Add hurricane center marker
    const icon = L.divIcon({
      className: 'hurricane-marker',
      html: `
        <div style="
          background-color: #FF4444;
          border: 3px solid white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(255,0,0,0.5);
          animation: rotate 4s linear infinite;
        ">
          🌀
        </div>
        <style>
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        </style>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker(hurricaneData.center, { icon })
      .bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #1F2937; font-weight: bold;">🌀 ${hurricaneData.name}</h3>
          <p style="margin: 4px 0; color: #6B7280;">
            Category: <span style="color: #FF4444; font-weight: bold;">Category ${hurricaneData.category}</span>
          </p>
          <p style="margin: 4px 0; color: #6B7280;">Wind Speed: ${hurricaneData.windSpeed} mph</p>
          <p style="margin: 4px 0; color: #6B7280;">Direction: ${hurricaneData.direction}</p>
          <p style="margin: 4px 0; color: #6B7280;">Radius: ${hurricaneData.radius} km</p>
          <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">Last updated: ${new Date().toLocaleString()}</p>
        </div>
      `);

    this.addLayerElement(marker);
  }
}

// Tornado Layer
export class TornadoLayer extends DisasterMapLayer {
  constructor(options = {}) {
    super(options);
    this.name = 'Tornado';
    this.icon = '🌪️';
    this.description = 'Tornado warnings and storm tracks';
  }

  onAdd(map) {
    super.onAdd(map);
    this.createLayer();
    return this;
  }

  createLayer() {
    // Demo tornado data
    const tornadoes = [
      { lat: 35.4676, lng: -97.5164, name: 'Oklahoma Tornado', ef: 3, path: '2.5 miles' },
      { lat: 39.8283, lng: -98.5795, name: 'Kansas Storm', ef: 2, path: '1.8 miles' },
      { lat: 32.7767, lng: -96.7970, name: 'Texas Tornado', ef: 1, path: '0.8 miles' },
    ];

    tornadoes.forEach(tornado => {
      const efColor = tornado.ef >= 3 ? '#FF4444' : tornado.ef === 2 ? '#FF8800' : '#FFCC00';
      
      const icon = L.divIcon({
        className: 'tornado-marker',
        html: `
          <div style="
            background-color: ${efColor};
            border: 2px solid white;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(255,0,0,0.5);
            animation: spin 1s linear infinite;
          ">
            🌪️
          </div>
          <style>
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          </style>
        `,
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5]
      });

      const marker = L.marker([tornado.lat, tornado.lng], { icon })
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1F2937; font-weight: bold;">🌪️ ${tornado.name}</h3>
            <p style="margin: 4px 0; color: #6B7280;">
              EF Scale: <span style="color: ${efColor}; font-weight: bold;">EF-${tornado.ef}</span>
            </p>
            <p style="margin: 4px 0; color: #6B7280;">Path Length: ${tornado.path}</p>
            <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">Last updated: ${new Date().toLocaleString()}</p>
          </div>
        `);

      this.addLayerElement(marker);
    });
  }
}

// Flood Layer
export class FloodLayer extends DisasterMapLayer {
  constructor(options = {}) {
    super(options);
    this.name = 'Flood';
    this.icon = '🌊';
    this.description = 'Flood warnings and water levels';
  }

  onAdd(map) {
    super.onAdd(map);
    this.createLayer();
    return this;
  }

  createLayer() {
    // Demo flood areas
    const floodAreas = [
      { center: [29.7604, -95.3698], radius: 50, severity: 'High', name: 'Houston Flood Zone' },
      { center: [30.2672, -97.7431], radius: 30, severity: 'Medium', name: 'Austin Flood Area' },
      { center: [32.7767, -96.7970], radius: 25, severity: 'Low', name: 'Dallas Flood Zone' },
    ];

    floodAreas.forEach(area => {
      const severityColor = area.severity === 'High' ? '#0066CC' : 
                          area.severity === 'Medium' ? '#0099FF' : '#66CCFF';
      
      const floodCircle = L.circle(area.center, {
        color: severityColor,
        fillColor: severityColor,
        fillOpacity: this.options.opacity,
        radius: area.radius * 1000, // Convert to meters
        weight: 2
      });

      this.addLayerElement(floodCircle);

      const icon = L.divIcon({
        className: 'flood-marker',
        html: `
          <div style="
            background-color: ${severityColor};
            border: 2px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,102,204,0.5);
          ">
            🌊
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker(area.center, { icon })
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1F2937; font-weight: bold;">🌊 ${area.name}</h3>
            <p style="margin: 4px 0; color: #6B7280;">
              Severity: <span style="color: ${severityColor}; font-weight: bold;">${area.severity}</span>
            </p>
            <p style="margin: 4px 0; color: #6B7280;">Radius: ${area.radius} km</p>
            <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">Last updated: ${new Date().toLocaleString()}</p>
          </div>
        `);

      this.addLayerElement(marker);
    });
  }
}

// Earthquake Layer
export class EarthquakeLayer extends DisasterMapLayer {
  constructor(options = {}) {
    super(options);
    this.name = 'Earthquake';
    this.icon = '🌋';
    this.description = 'Recent earthquakes and seismic activity';
  }

  onAdd(map) {
    super.onAdd(map);
    this.createLayer();
    return this;
  }

  createLayer() {
    // Demo earthquake data
    const earthquakes = [
      { lat: 34.0522, lng: -118.2437, magnitude: 4.2, depth: 12, name: 'Los Angeles Quake' },
      { lat: 37.7749, lng: -122.4194, magnitude: 3.8, depth: 8, name: 'San Francisco Quake' },
      { lat: 40.7128, lng: -74.0060, magnitude: 2.5, depth: 5, name: 'New York Quake' },
    ];

    earthquakes.forEach(quake => {
      const magnitudeColor = quake.magnitude >= 5.0 ? '#FF4444' : 
                           quake.magnitude >= 4.0 ? '#FF8800' : 
                           quake.magnitude >= 3.0 ? '#FFCC00' : '#00CC00';
      
      const radius = Math.max(5, quake.magnitude * 3); // Scale circle size with magnitude
      
      const quakeCircle = L.circle([quake.lat, quake.lng], {
        color: magnitudeColor,
        fillColor: magnitudeColor,
        fillOpacity: this.options.opacity,
        radius: radius * 1000, // Convert to meters
        weight: 2
      });

      this.addLayerElement(quakeCircle);

      const icon = L.divIcon({
        className: 'earthquake-marker',
        html: `
          <div style="
            background-color: ${magnitudeColor};
            border: 2px solid white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            box-shadow: 0 2px 8px rgba(255,0,0,0.5);
          ">
            🌋
          </div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      const marker = L.marker([quake.lat, quake.lng], { icon })
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1F2937; font-weight: bold;">🌋 ${quake.name}</h3>
            <p style="margin: 4px 0; color: #6B7280;">
              Magnitude: <span style="color: ${magnitudeColor}; font-weight: bold;">${quake.magnitude}</span>
            </p>
            <p style="margin: 4px 0; color: #6B7280;">Depth: ${quake.depth} km</p>
            <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">Last updated: ${new Date().toLocaleString()}</p>
          </div>
        `);

      this.addLayerElement(marker);
    });
  }
}

// Layer Control Component
export class DisasterLayerControl {
  constructor(map, layers = []) {
    this.map = map;
    this.layers = layers;
    this.control = null;
    this.createControl();
  }

  createControl() {
    this.control = L.control({ position: 'topright' });
    
    this.control.onAdd = () => {
      const container = L.DomUtil.create('div', 'disaster-layer-control');
      container.style.cssText = `
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 8px;
        min-width: 200px;
        font-family: Arial, sans-serif;
        font-size: 12px;
      `;

      const title = L.DomUtil.create('h3', '', container);
      title.textContent = '🌪️ Disaster Layers';
      title.style.cssText = 'margin: 0 0 10px 0; font-size: 14px; font-weight: bold;';

      this.layers.forEach(layer => {
        const layerControl = this.createLayerToggle(layer);
        container.appendChild(layerControl);
      });

      return container;
    };

    this.control.addTo(this.map);
  }

  createLayerToggle(layer) {
    const div = L.DomUtil.create('div', 'layer-toggle', this.control.getContainer());
    div.style.cssText = 'margin: 5px 0; display: flex; align-items: center;';

    const checkbox = L.DomUtil.create('input', '', div);
    checkbox.type = 'checkbox';
    checkbox.style.cssText = 'margin-right: 8px;';

    const label = L.DomUtil.create('label', '', div);
    label.innerHTML = `${layer.icon} ${layer.name}`;
    label.style.cssText = 'cursor: pointer; flex: 1;';

    const opacityControl = L.DomUtil.create('input', '', div);
    opacityControl.type = 'range';
    opacityControl.min = '0';
    opacityControl.max = '1';
    opacityControl.step = '0.1';
    opacityControl.value = layer.options.opacity;
    opacityControl.style.cssText = 'width: 60px; margin-left: 8px;';

    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        layer.show();
      } else {
        layer.hide();
      }
    });

    opacityControl.addEventListener('input', (e) => {
      layer.setOpacity(parseFloat(e.target.value));
    });

    return div;
  }

  remove() {
    if (this.control) {
      this.control.remove();
    }
  }
}

export default {
  WildfireLayer,
  HurricaneLayer,
  TornadoLayer,
  FloodLayer,
  EarthquakeLayer,
  DisasterLayerControl
}; 