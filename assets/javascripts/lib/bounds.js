export default (polygon) => {
  var bounds = new google.maps.LatLngBounds();
  var paths = polygon.getPaths();
  var path;
  for (var i = 0; i < paths.getLength(); i++) {
    path = paths.getAt(i);
    for (var n = 0; n < path.getLength(); n++) {
      bounds.extend(path.getAt(n));
    }
  }
  return bounds;
};
