var hoveredFeatures = null;

function setHoverState(map, value = false, layer = "transit") {
  hoveredFeatures.forEach((hf) => {
    try {
      if (hf.layer.id && hf.id)
        map.setFeatureState(
          { source: layer, sourceLayer: hf.layer.id, id: hf.id },
          { hover: value }
        );
      else {
        console.log("missing either feature and/or layer id");
        //console.log(hf);
      }
    } catch (e) {
      console.log("layer problem: " + e);
      console.log(hf);
    }
  });
}

function mouseMoveEvent(map, features) {
  if (features.length > 0) {
    //console.log(features[0]);
    if (hoveredFeatures) {
      setHoverState(map);
    }
    hoveredFeatures = features;
    setHoverState(map, true);
  }
}

function mouseLeaveEvent(map) {
  if (hoveredFeatures) setHoverState(map);
  hoveredFeatures = null;
}

function screenPointToBBox(point, inc = 5) {
  return [
    [point.x - inc, point.y - inc],
    [point.x + inc, point.y + inc],
  ];
}

/** mouse over selects map features */
function selection(map, layers = routeLayerList) {
  map.on("mousemove", (e) => {
    const bbox = screenPointToBBox(e.point);
    // https://maplibre.org/maplibre-gl-js/docs/API/classes/maplibregl.Map/#queryrenderedfeatures
    const features = map.queryRenderedFeatures(bbox, { layers: layers });
    if (features.length > 0) {
      mouseMoveEvent(map, features);
    } else {
      mouseLeaveEvent(map);
    } 
  });
}
