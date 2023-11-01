import tostify from "../plugins/tostify";
import loader from "../functions/loader";

export default function Base() {
  this.base     = 'https://api.qool90.bet/api/'
  this.language = localStorage.getItem('lang') || 'en'
}

Base.prototype.updateDateTime = function() {
  $('.js-preview-time').text(new Date().toLocaleString());
}

Base.prototype.sendFormData = function(
    formData,
    url,
    type,
    successCallback,
    errorCallback,
    options = null,
    preload = true
)
{
  if (preload) loader()

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

      if (preload) loader()
    },
    error (xhr, status, error) {
      if (errorCallback && typeof errorCallback === 'function') {
        errorCallback(xhr, status, error);
      }

      tostify(error || 'Bad request', 'error').showToast()

      if (preload) loader()
    },
  });
}

Base.prototype.updateLanguage = function(data, block = null) {
  const elements = block ? block.querySelectorAll('[data-lang]') : document.querySelectorAll('[data-lang]')

  elements.forEach(item => {
    // eslint-disable-next-line no-param-reassign
    item.innerHTML = data[item.getAttribute('data-lang')]
  })
}

Base.prototype.setLanguage = function() {
  const self = this
  const $parent = $('.js-select-language')
  $parent.find(`.js-dropdown-link[data-value="${this.language}"]`).addClass('dropdown__link--active')
  $parent.find('.js-dropdown-selected span').text(this.language.toUpperCase())
  $parent.find('.js-dropdown-selected').attr('data-value', this.language)

  this.sendFormData(
    null,
    `../json/${localStorage.getItem('lang') || 'en'}.json`,
    'GET',
    (response) => {
      if (response) {
        window.language = response
        self.updateLanguage(response)
      }
    },
    null,
    {
      async: false
    },
    false
  );
}

Base.prototype.handleOutsideClick = function(element, event, callback) {
  if (!element.is(event.target) && element.has(event.target).length === 0) {
    callback();
  }
}

Base.prototype.initDynamicSelect = function(url, el, key = null) {
  this.sendFormData(
    null,
    `${this.base}${url}`,
    'GET',
    (response) => {
      if (response) {
        response.data.forEach(function (item) {
          const $option = $('<option>', {
            text: key ? item[key] : item,
            value: item
          })

          $option.appendTo(el)
        })
      }
    },
    null,
    {
      async: false
    },
    false
  )
}

Base.prototype.getDate = function(date, type) {
  const data = new Date(date)

  const year = data.getFullYear().toString().padStart(4, '0')
  const month = (data.getMonth() + 1).toString().padStart(2, '0')
  const day = data.getDate().toString().padStart(2, '0')
  const hours = data.getHours().toString().padStart(2, '0')
  const minutes = data.getMinutes().toString().padStart(2, '0')
  const seconds = data.getSeconds().toString().padStart(2, '0')

  if (type === 'datetime-local') {
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }
  if (type === 'time-local') {
    return `${hours}:${minutes}:${seconds}`
  }
  return `${day}-${month}-${year}`
}

Base.prototype.initTextArea = function(label, value) {
  let html = ''

  html +=`<div class="textarea textarea--sm js-textarea">`

    if(label) {
      html += `<label class="textarea__label js-textarea-label">${label}</label>`
    }

  html +=     `<textarea class="textarea__input js-textarea-input">${value}</textarea>
          </div>`

  return html
}

Base.prototype.initSelect = function(label, value, selected) {
  let html = `<div class="select select--sm js-select">`

             if(label) {
                html += `<label class="select__label js-select-label">${label}</label>`
             }

      html +=           `<select class="select__input js-select-input">`

                            Object.keys(value).forEach((key) => {
                              if (key === selected)
                                html += `<option value="${key}" selected="${key === selected}">${value[key]}</option>`
                              else
                                html += `<option value="${key}">${value[key]}</option>`
                            })

      html +=           `</select>
                    </div>`

    return html
}
