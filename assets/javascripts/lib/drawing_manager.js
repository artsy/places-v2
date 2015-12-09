export default map => {
  let drawingManager = new google.maps.drawing.DrawingManager({
    drawingControlOptions: {
      drawingModes: [
        google.maps.drawing.OverlayType.POLYGON
      ]
    },
    polygonOptions: {
      editable: true,
      draggable: true,
      geodesic: true
    }
  });

  drawingManager.setMap(map);

  return drawingManager;
};
