export default ($el) => {
  return new google.maps.Map($el[0], {
    center: { lat: 0, lng: 0 },
    zoom: 2
  });
};
