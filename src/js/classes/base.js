export default function Base() {
  this.base     = 'https://api.qool90.bet/api/'
  this.language = localStorage.getItem('lang') || 'en'
}

Base.prototype.updateDateTime = function() {
  $('.js-preview-time').text(new Date().toLocaleString());
}

Base.prototype.sendFormData = function(formData, url, type, successCallback, errorCallback, options = null) {
  $.ajax({
    url,
    type,
    data: formData,
    processData: false,
    contentType: false,
    options,
    success (response) {
      if (successCallback && typeof successCallback === 'function') {
        successCallback(response);
      }
    },
    error (xhr, status, error) {
      if (errorCallback && typeof errorCallback === 'function') {
        errorCallback(xhr, status, error);
      }
    },
  });
}

Base.prototype.updateLanguage = function() {
  const $parent = $('.js-select-language')
  $parent.find(`.js-dropdown-link[data-value="${this.language}"]`).addClass('dropdown__link--active')
  $parent.find('.js-dropdown-selected span').text(this.language.toUpperCase())
  $parent.find('.js-dropdown-selected').attr('data-value', this.language)

  this.sendFormData(
    null,
    `http://localhost:8080/json/${localStorage.getItem('lang') || 'en'}.json`,
    'GET',
    (response) => {
      if (response) {
        const elements = document.querySelectorAll('[data-lang]')

        elements.forEach(item => {
          // eslint-disable-next-line no-param-reassign
          item.innerHTML = response[item.getAttribute('data-lang')]
        })

      }
    }, function (xhr, status, error) {
      console.error(error);
    },
    {
      async: false
    });
}

Base.prototype.handleOutsideClick = function(element, event, callback) {
  if (!element.is(event.target) && element.has(event.target).length === 0) {
    callback();
  }
}
