import $ from 'jquery';
import bounds from './bounds';
import initMap from './map';
import initDrawingManager from './drawing_manager';

export default (PLACE) => {
  let $map = $('.js-map');
  let $form = $('.js-form');
  let $submit = $form.find('.js-save');
  let $coordinates = $form.find('textarea[name="coordinates"]');

  let map = initMap($map);
  let drawingManager = initDrawingManager(map);

  let coordinates = [];

  let serialize = (path) => {
    let points = path.getArray();
    return points.map(point => point.toJSON());
  };

  let updateCoordinates = (path) => () => {
    coordinates = serialize(path);
    $coordinates.html(
      JSON.stringify(coordinates, undefined, 2)
    );
  };

  if (PLACE) { // Edit

    let place = new google.maps.Polygon({
      paths: PLACE.coordinates,
      editable: true
    });

    place.setMap(map);
    map.fitBounds(bounds(place));

    let path = place.getPath();
    let update = updateCoordinates(path);

    google.maps.event.addListener(path, 'insert_at', update);
    google.maps.event.addListener(path, 'remove_at', update);
    google.maps.event.addListener(path, 'set_at', update);

  } else { // New

    google.maps.event.addListener(drawingManager, 'overlaycomplete', (e) => {
      let path = e.overlay.getPath();
      let update = updateCoordinates(path);

      update();

      google.maps.event.addListener(path, 'insert_at', update);
      google.maps.event.addListener(path, 'remove_at', update);
      google.maps.event.addListener(path, 'set_at', update);
    });

  }

  $submit.on('click', (e) => {
    e.preventDefault();

    $submit.attr('data-state', 'loading');

    let data = $form.serializeArray()
      .reduce((memo, { name, value }) => {
        memo[name] = value;
        return memo;
      }, {});

    data.coordinates = $.parseJSON(data.coordinates);

    let url = PLACE ? `/places/${PLACE._id}` : '/places';

    $.post(url, data, response => {
      window.location = '/places';
    })
      .fail(err => {
        console.error(err);
        $submit.attr('data-state', 'error');
      });
  });
};
