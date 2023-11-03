function screenPointToBBox(point, inc = 10) {
  return [
    [point.x - inc, point.y - inc],
    [point.x + inc, point.y + inc],
  ];
}

/** mouse over selects map features */
// https://maplibre.org/maplibre-gl-js/docs/API/classes/maplibregl.Map/#queryrenderedfeatures
function selection(map, layers = ["poi_label_1", "poi_label_2", "poi_label_3"]) {
  map.on("mousemove", (e) => {
    const bbox = screenPointToBBox(e.point);
    const features = map.queryRenderedFeatures(bbox, { layers: layers });
    if (features.length > 0) {
      for (f in features) {
        showInfo(getContent(features[f]));
      }
    } else clearInfo();
  });
}

function typeName(name, sub, sep = ", ", pre = "(", post = ")") {
  var retVal = "";
  try {
    if (name && sub) {
      if (name !== sub) retVal = name + sep + sub;
      else retVal = name;
    } else if (name || sub) {
      retVal = name | sub;
    }
  } finally {
    if (retVal) retVal = pre + retVal + post;
  }
  return retVal;
}

function getContent(feature) {
  propz = feature.properties; // global
  var template = "\
    {{propz.name}} \
    {{typeName(propz.class, propz.subclass)}} \
  ";
  return Sqrl.render(template);
}
