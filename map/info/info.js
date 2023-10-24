function selection(map, filter) {
  map.on('mousemove', (e) => {
    const features = map.queryRenderedFeatures(e.point);
    for(f in features) {
        if(filter(features[f])) {
          console.log(features[f]);
        }
    }
  });
}