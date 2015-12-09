import $ from 'jquery';

export default {
  bind: () => {
    $('[data-confirm], [data-method]').click(function(e) {
      var $el, answer, data, message, method, ref, url;
      e.preventDefault();
      $el = $(this);
      url = $el.attr('href');
      ref = $el.data(), method = ref.method, data = ref.data;
      if (message = $el.data('confirm')) {
        answer = confirm(message);
        if (!answer) {
          return false;
        }
      }
      return $.ajax({
        url: url,
        method: method,
        data: data,
        success: function(redirect) {
          console.log(redirect)
          return location.href = redirect;
        },
        error: function(response) {
          console.error(error);
        }
      });
    });
  }
};
