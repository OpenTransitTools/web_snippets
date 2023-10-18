function getUrlParam(name, defVal) {
  var retVal;
  try {
    const params = new URLSearchParams(window.location.search);
    retVal = params.get(name);
    if(retVal === null)
      retVal = defVal;
  } catch (e) {
    retVal = defVal;
  }
  return retVal;
}

function makeMap() {
  var segmentsGeojson = getUrlParam('segments', 'trimet.geojson');

  var url = 'https://tiles.trimet.org/styles/trimet/style.json';
  var customAttrib = '&copy;OpenTransitTools &copy;OpenStreetMap';
  var render_above_this_layer = 'road_major_label'
  // NOTE: 'road_major_label' is in the base layer style .. put here renders that above this layer

  if(segmentsGeojson !== 'trimet.geojson' && segmentsGeojson !== 'ctran.geojson') {
    url = "https://api.maptiler.com/maps/bright/style.json?key=wUvV014mmfzELsh6ucYT";
    url = "https://api.maptiler.com/maps/voyager/style.json?key=wUvV014mmfzELsh6ucYT";
    customAttrib = '&copy;MapTiler &copy;OpenStreetMap';
    render_above_this_layer = 'place_hamlet';
  }

  var map = new maplibregl.Map({
    container: 'map',
    style: url,
    pitch: 90,
    antialias: true,
    hash: true,
    attributionControl: false
  });

  var scale = new maplibregl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
  });

  var attrib = new maplibregl.AttributionControl({
    compact: true,
    customAttribution: '© <a target="_" href="https://tiles.trimet.org">TriMet</a> '
  });

  var full = new maplibregl.FullscreenControl();

  var nav = new maplibregl.NavigationControl({
    visualizePitch: true
  });

  var geo = new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  });

  var iconMarkerEl = document.createElement("div");
  iconMarkerEl.innerHTML = "<div class='marker-arrow'></div>" + "<div class='marker-pulse'></div>";
  var pelias = new PeliasGeocoder({
    url: 'https://ws.trimet.org/peliaswrap/v1',
    flyTo: 'hybrid',
    useFocusPoint: true,
    marker: {
      icon: iconMarkerEl,
      multiple: false
    },
    customAttribution: customAttrib
  });

  map.addControl(nav);
  map.addControl(scale);
  map.addControl(pelias);
  map.addControl(attrib);
  map.addControl(full, 'bottom-right');
  map.addControl(geo,  'bottom-right');

  var hi = null;
  map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point);
      for(f in features) {
          if(features[f] && features[f]['source'] && features[f]['source'] === "transit") {
	      console.log(features[f]);
          }
      }
  });
    
  map.on('load', function () {
    document.title = document.title + " - " + segmentsGeojson;

    // http://localhost:8600/geoserver/gwc/rest/layers/routes_n_stops.xml
    const svr = "http://localhost:8600";
    const layer = "routes_n_stops";
    //const layer = "ott:trimet_routes";
    const epsg = "900913";
    //const epsg = "3857";
    //const vectorURL = svr + '/geoserver/gwc/rest/wtms/' + layer + '@EPSG%3A'+ epsg +'@pbf/{z}/{x}/{y}.pbf';
    const vectorURL = svr + '/geoserver/gwc/service/tms/1.0.0/' + layer + '@EPSG%3A'+ epsg +'@pbf/{z}/{x}/{y}.pbf';
														    
    map.addSource("transit", {
      type: "vector",
      scheme: 'tms',
      tiles: [
        vectorURL
      ]
    });
    console.log(vectorURL);

    function getColor(rec) {
      console.log(rec);
      return '#555';
    }
    
    map.addLayer({
      'id': 'croutes',
      'type': 'line',
      'source': 'transit',
      'source-layer': 'c-tran_routes',
      'layout': {
        'visibility': 'visible',
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-opacity': 0.9,
        'line-color': ['get', 'route_color'],
        'line-width': 4
      }
    }, render_above_this_layer);

    map.addLayer({
      'id': 'tmroutes',
      'type': 'line',
      'source': 'transit',
      'source-layer': 'trimet_routes',
      'layout': {
        'visibility': 'visible',
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-opacity': 0.9,
        'line-color': '#2b8dff',
        'line-width': 4
      }

    }, render_above_this_layer);
    
    var tooltip = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.on('mouseenter', 'stops', function (e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';

      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = "Stop ID: " + e.features[0].properties.code;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      tooltip.setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on('mouseleave', 'stops', function () {
       map.getCanvas().style.cursor = '';
      tooltip.remove();
    });

    map.on('dblclick', 'stops', function (e) {
      var stopPage = "https://trimet.org/ride/stop.html?stop_id=";
      var url = stopPage + e.features[0].properties.id;
      window.open(url, "_blank");
    });

    var popup = new maplibregl.Popup({closeOnClick: false});
    map.on('contextmenu', function(e) {
      tooltip.remove();

      var coord = e.lngLat;
      var sv = '<iframe width="420" height="280" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" ' +
      'src="https://maps.google.com/maps?output=svembed&amp;&amp;layer=c&amp;cbp=13,,,,&amp;' +
      'cbll=' + coord.lat + ',' + coord.lng + '&amp;ll=' + coord.lat + ',' + coord.lng + '&amp;z=17"></iframe>' +
      "location: " + coord.lat + ',' + coord.lng;

      popup.setLngLat(coord).setMaxWidth("450px").setHTML(sv).addTo(map);
    });
  });
}
