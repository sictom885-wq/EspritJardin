(function () {
  const container = document.getElementById('zone-satellite');
  if (!container || typeof maplibregl === 'undefined') return;

  const CITIES = [
    { name: 'Valence', lat: 44.933, lon: 4.892 },
    { name: 'Romans-sur-Isère', lat: 45.053, lon: 5.052 },
    { name: "Tain-l'Hermitage", lat: 45.075, lon: 4.850 },
    { name: 'Saint-Péray', lat: 44.947, lon: 4.826 },
    { name: 'Guilherand-Granges', lat: 44.940, lon: 4.847 },
    { name: 'Bourg-lès-Valence', lat: 44.958, lon: 4.884 },
    { name: 'Chabeuil', lat: 44.897, lon: 5.017 },
    { name: 'Étoile-sur-Rhône', lat: 44.850, lon: 4.888 },
    { name: 'Montélier', lat: 44.916, lon: 5.010 },
    { name: 'Loriol-sur-Drôme', lat: 44.755, lon: 4.812 },
    { name: 'Crest', lat: 44.728, lon: 5.020 },
  ];
  const HQ = { name: 'Portes-lès-Valence — siège', lat: 44.895, lon: 4.888 };

  const style = {
    version: 8,
    sources: {
      'esri-satellite': {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Imagery © Esri, Maxar, Earthstar Geographics'
      },
      'esri-labels': {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256
      }
    },
    layers: [
      { id: 'esri-satellite-layer', type: 'raster', source: 'esri-satellite' },
      { id: 'esri-labels-layer', type: 'raster', source: 'esri-labels', paint: { 'raster-opacity': 0.85 } }
    ]
  };

  const map = new maplibregl.Map({
    container: 'zone-satellite',
    style: style,
    center: [HQ.lon, HQ.lat],
    zoom: 9.6,
    pitch: 58,
    bearing: -12,
    interactive: true,
    scrollZoom: false,
    dragPan: true,
    dragRotate: true,
    touchZoomRotate: false,
    attributionControl: { compact: true }
  });

  map.dragPan.disable();
  map.doubleClickZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();

  function makePinEl(color, size, label) {
    const el = document.createElement('div');
    el.className = 'sat-pin';
    el.style.setProperty('--pin-color', color);
    el.style.setProperty('--pin-size', size + 'px');
    el.innerHTML = '<span class="sat-pin-drop"></span><span class="sat-pin-shadow"></span>';
    const tip = document.createElement('div');
    tip.className = 'sat-pin-tip';
    tip.textContent = label;
    el.appendChild(tip);
    return el;
  }

  map.on('load', function () {
    CITIES.forEach(function (c) {
      const el = makePinEl('#C9A227', 26, c.name);
      new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([c.lon, c.lat])
        .addTo(map);
    });
    const hqEl = makePinEl('#A6266E', 38, HQ.name);
    hqEl.classList.add('sat-pin-hq');
    new maplibregl.Marker({ element: hqEl, anchor: 'bottom' })
      .setLngLat([HQ.lon, HQ.lat])
      .addTo(map);
  });

  // rotation panoramique lente et continue
  let userInteracting = false;
  let bearing = -12;
  map.on('dragstart', function () { userInteracting = true; });
  map.on('dragend', function () { userInteracting = false; });

  function spin() {
    if (!userInteracting) {
      bearing += 0.045;
      map.setBearing(bearing);
    }
    requestAnimationFrame(spin);
  }

  // animation d'entrée : zoom depuis plus loin quand la section devient visible
  let started = false;
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !started) {
        started = true;
        map.easeTo({ zoom: 9.6, pitch: 58, duration: 1800 });
        requestAnimationFrame(spin);
      }
    });
  }, { threshold: 0.25 });

  map.once('load', function () {
    map.setZoom(8.4);
    map.setPitch(30);
    io.observe(container);
  });

  window.addEventListener('resize', function () { map.resize(); });
})();
