
function pointToBBox(point, inc=10) {
  return [[point.x - inc, point.y - inc], [point.x + inc, point.y + inc]];
}

/** map mouse over selects features */
function selection(map, filter) {
  map.on('mousemove', (e) => {
    var bbox = pointToBBox(e.point);
    //console.log(bbox);  //console.log(e.point);
    const features = map.queryRenderedFeatures(bbox);
    var n = 0;
    for(f in features) {
        if(filter(features[f])) {
          //console.log(features[f]);
          info(features[f]);
          highlight(map, features[f])
          n++;
        }
    }

    if(n == 0) {
      clear(map);
    }
  });
}

function getContent(feature) {
  function typeName(feature, sep=", ") {
    var retVal = "";
    try {
      const t = feature.properties.class;
      const s = feature.properties.subclass;
      if(t && s) {
        if (t !== s) retVal = t + sep + s;
        else retVal = t;
      }
      else if (t || s) {
        retVal = t | s;
      }
    } catch(e) {
    }
    return retVal;
  }

  const txt = feature.properties.name;
  const type = typeName(feature);
  if(type)
    retVal = txt + " (" + type + ")";
  else
    retVal = txt;

  return retVal;
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