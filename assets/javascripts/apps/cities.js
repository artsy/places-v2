import $ from 'jquery';
import { data } from 'sharify';
import initMap from '../lib/map';

let initEditor = () => {
  let $map = $('.js-map');
  let $form = $('.js-form');
  let $submit = $form.find('.js-save');
  let $coordinates = $form.find('textarea[name="coordinates"]');

  const { CITY } = data;

  if (CITY) { // Edit

    let map = new google.maps.Map($map[0], {
      center: CITY.coordinates,
      zoom: 8
    });

    let marker = new google.maps.Marker({
      map: map,
      position: CITY.coordinates,
      title: CITY.name,
      draggable: true,
      animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(marker, 'dragend', (e) => {
      $coordinates.html(
        JSON.stringify(e.latLng.toJSON(), undefined, 2)
      );
    });

  } else {

    let map = initMap($map);

    let drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER
        ]
      },
      markerOptions: {
        draggable: true
      }
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', (e) => {
      let marker = e.overlay;

      $coordinates.html(
        JSON.stringify(marker.position.toJSON(), undefined, 2)
      );

      google.maps.event.addListener(marker, 'dragend', (e) => {
        $coordinates.html(
          JSON.stringify(e.latLng.toJSON(), undefined, 2)
        );
      });
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

    let url = CITY ? `/cities/${CITY._id}` : '/cities';

    $.post(url, data, response => {
      window.location = '/cities';
    })
      .fail(err => {
        console.error(err);
        $submit.attr('data-state', 'error');
      });
  });
};

export default {
  new: () => initEditor(),
  show: () => initEditor()
};
