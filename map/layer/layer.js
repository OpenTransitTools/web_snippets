const agencyList = ['trimet', 'cat', 'ccrider', 'canby', 'canbyferry', 'clackamas', 'ctran', 'rideconnection', 'sam', 'sctd', 'skamania', 'smart', 'swan', 'wapark', 'woodburn', 'yamhill', 'cherriots', 'tillamook', 'point'];                      
const routeLayerList = [];
const stopLayerList = [];
agencyList.forEach((a) => {
  routeLayerList.push(a + "_routes");
  stopLayerList.push(a + "_stops");
});

function addLayers(map, render_above_this_layer="road_major_label") {
  // http://localhost:8600/geoserver/gwc/rest/layers/routes_n_stops.xml
  const svr = "http://localhost:8600";
  const layer = "routes_n_stops";

  //const epsg = "3857";
  //const vectorURL = svr + '/geoserver/gwc/rest/wtms/' + layer + '@EPSG%3A'+ epsg +'@pbf/{z}/{x}/{y}.pbf';
  const epsg = "900913";
  const vectorURL =   svr + '/geoserver/gwc/service/tms/1.0.0/' + layer + "@EPSG%3A" + epsg + "@pbf/{z}/{x}/{y}.pbf";

  map.addSource("transit", {
    type: "vector",
    scheme: "tms",
    tiles: [vectorURL],
  });

  routeLayerList.forEach((route) => {
    map.addLayer(
      {
        id: route,
        type: "line",
        source: "transit",
        "source-layer": route,
        layout: {
          visibility: "visible",
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-opacity": 1.0,
          "line-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "yellow",
            ["get", "route_color"],
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            5,
            2,
          ],
        },
      },
      render_above_this_layer
    );
  });
}
