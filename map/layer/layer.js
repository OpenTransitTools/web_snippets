function addLayers(map, render_above_this_layer='road_major_label') {

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
}
