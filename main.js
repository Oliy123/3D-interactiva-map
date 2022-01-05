mapboxgl.accessToken = 'pk.eyJ1Ijoib2xpeWFkIiwiYSI6ImNrdjdsbnYybjhhbzcydnQ5dGRjdWM3ODIifQ.x-icjc5_gVuDi8MWOqzw3g';
const map = new mapboxgl.Map({

      container: 'map',
      style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
      center: [-103.2502, 29.2498],
      zoom: 9, // starting zoom
      pitch: 85,
      bearing: 80,
      });


map.on('load', () => {

    map.addSource('bounds', {
        type: 'geojson',
        data: 'data/Terlingua_Ranch_Map_WFL1.geojson'// note again, you may need to change this.
    });

    map.addLayer({
      'id': 'boundary-layer',
      'type': 'line',
      'source': 'bounds',
      'paint': {
          'line-width': 4,
          'line-color': 'black',
          'line-opacity': .6
      }
    });




    map.addSource('trails', {
          type: 'geojson',
          data: 'data/Big_Bend_National_Park_-_Trails.geojson' // note, you'll have to change this if your data file is saved under a different name or not in an enclosing folder named 'data'
      });

      map.addLayer({
        'id': 'trails-layer',
        'type': 'line',
        'source': 'trails',
        'paint': {
            'line-width': 3,
            'line-color': ['match', ['get', 'TRLCLASS'],
                'Class 1: Minimally Developed', 'red',
                'Class 2: Moderately Developed', 'orange',
                'Class 3: Developed', 'yellow',
                /*else,*/ 'blue'
            ]
        }


      });
      map.on("click", "trails-layer", (e) => {
          const coordinates = e.lngLat;
          let feature = e.features[0].properties
          const description = "<b>Trial name:</b> " + feature.TRLNAME + "<br><b>Trial class:</b> " + feature.TRLCLASS + "<br> <b>Trial length: </b> " + feature.Miles.toFixed(2) + "miles" ;
          new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map);

        });
        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'trails-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'trails-layer', () => {
        map.getCanvas().style.cursor = '';
      });




});
map.on('load',function ()

{
map.addSource('mapbox-dem', {
  'type': 'raster-dem',
  'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
  'tileSize': 512,
  'maxzoom': 14
  });
  map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

  map.addLayer({
  'id': 'sky',
  'type': 'sky',
  'paint': {
  'sky-opacity': [
  'interpolate',
  ['linear'],
  ['zoom'],
  0,
  0,
  5,
  0.3,
  8,
  1
  ],
  // set up the sky layer for atmospheric scattering
  'sky-type': 'atmosphere',
  // explicitly set the position of the sun rather than allowing the sun to be attached to the main light source
  'sky-atmosphere-sun': getSunPosition(),
  // set the intensity of the sun as a light source (0-100 with higher values corresponding to brighter skies)
  'sky-atmosphere-sun-intensity': 5
  }
  });
  });
  // update the `sky-atmosphere-sun` paint property with the position of the sun based on the selected time
// the position of the sun is calculated using the SunCalc library
function updateSunPosition(sunPos) {
map.setPaintProperty('sky', 'sky-atmosphere-sun', sunPos);
}

// Get list of SunCalc's default sun positions
// for the current time and location
const sunPositions = SunCalc.getTimes(
Date.now(),
map.getCenter().lat,
map.getCenter().lng
);
// set up event listeners for the buttons to update
// the position of the sun for times of the day
const sunTimeLabels = document.querySelectorAll(
'#inputs input',
'#getlocal'
);
for (const label of sunTimeLabels) {
label.addEventListener('click', () => {
const sunPos =
label.id === 'getlocal'
? getSunPosition(new Date())
: getSunPosition(sunPositions[label.id]);
updateSunPosition(sunPos);
});
}

function getSunPosition(date) {
const center = map.getCenter();
const sunPos = SunCalc.getPosition(
date || Date.now(),
center.lat,
center.lng
);
const sunAzimuth = 180 + (sunPos.azimuth * 180) / Math.PI;
const sunAltitude = 90 - (sunPos.altitude * 180) / Math.PI;
return [sunAzimuth, sunAltitude];
}


const navControl = new mapboxgl.NavigationControl({
visualizePitch: true
  });
  map.addControl(navControl, 'top-right');
  const scale = new mapboxgl.ScaleControl({
  maxWidth: 80,
  unit: 'imperial'
  });
  map.addControl(scale);

  scale.setUnit('imperial');
