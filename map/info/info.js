
function screenPointToBBox(point, inc=10) {
  return [[point.x - inc, point.y - inc], [point.x + inc, point.y + inc]];
}

/** map mouse over selects features */
function selection(map, layers=['poi_label_1', 'poi_label_2', 'poi_label_3']) {
  map.on('mousemove', (e) => {
    const bbox = screenPointToBBox(e.point);
    // https://maplibre.org/maplibre-gl-js/docs/API/classes/maplibregl.Map/#queryrenderedfeatures
    const features = map.queryRenderedFeatures(bbox, {layers: layers});
    //console.log(features);
    if (features.length > 0) {
      for(f in features) {
        info(features[f]);
        highlight(map, features[f])
      }
    }
    else
      clear(map);
  });
}

function typeName(name, sub, sep=", ", pre="(", post=")") {
  var retVal = "";
  try {
    if(name && sub) {
      if (name !== sub) retVal = name + sep + sub;
      else retVal = name;
    }
    else if (name || sub) {
      retVal = name| sub;
    }
  } finally {
    if(retVal) 
      retVal = pre + retVal + post;
  }
  return retVal;
}

function getContent(feature) {
  propz = feature.properties;
  var template = "\
    {{propz.name}} \
    {{typeName(propz.class, propz.subclass)}} \
  ";
  return Sqrl.render(template);
}

function info(feature) {
  const c = getContent(feature);
  document.getElementById('info').innerHTML = c;
}

function highlight(map, feature) {
  
}

function clear(map, feature) {
  document.getElementById('info').innerHTML = "";
}