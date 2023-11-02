import tostify from "../plugins/tostify";
import loader from "../functions/loader";
import Table from "./table";

export default function Base() {
  this.base     = 'https://api.qool90.bet/api/'
  this.language = localStorage.getItem('lang') || 'en'
  this.agents   = []
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

Base.prototype.getPath = function(data, el) {
  const keys = data.split('.')
  let result = null

  keys.forEach(function(item) {
    if (!result)
      result = el[item]
    else
      result = result[item]
  })

  return result
}

Base.prototype.updateLanguage = function(data, block = null) {
  const elements = block ? block.querySelectorAll('[data-lang]') : document.querySelectorAll('[data-lang]')

  elements.forEach(item => {
    const value = item.getAttribute('data-lang')

    if (value.indexOf('.') !== -1) {
      // eslint-disable-next-line no-param-reassign
      item.innerHTML = this.getPath(value, data)
    }
    else {
      // eslint-disable-next-line no-param-reassign
      item.innerHTML = data[item.getAttribute('data-lang')]
    }
  })

  this.defaultSelect()
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

Base.prototype.findAgent = function(data, id) {
  const self = this

  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      return data[i];
    }
    if (data[i].clients) {
      const result = self.findAgent(data[i].clients, id);
      if (result) {
        return result;
      }
    }
  }

  return null;
}

Base.prototype.drawAgents = function(data, $parent) {
  const self = this
  const $group = $('<div class="dropdown__group js-dropdown-group">');

  data.forEach(function (item) {
    const $option = $('<a class="dropdown__link js-dropdown-link">');
    const $newGroup = $('<div class="dropdown__group js-dropdown-group">');
    $option.text(item.username)
    $option.attr('data-value', item.id)

    if (item.clients && item.clients.length > 0) {
      self.drawAgents(item.clients, $newGroup);
    }

    $group.append($option);
    $group.append($newGroup);
  });

  $parent.append($group);
}

Base.prototype.initAgents = function(success) {
  const self = this
  this.sendFormData(
    null,
    `${this.base}tree/`,
    'GET',
    (response) => {
      if (response) {
        self.agents = response
        success()
      }
    },
    null,
    {
      async: false
    },
    false
  )
}

Base.prototype.handleOutsideClick = function(element, event, callback) {
  if (!element.is(event.target) && element.has(event.target).length === 0) {
    callback();
  }
}

Base.prototype.initDynamicSelect = function(url, el, key = null) {
  this.agents.forEach(function (item) {
    const $option = $('<option>', {
      text: key ? item[key] : item,
      value: item
    })

    $option.appendTo(el)
  })
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

Base.prototype.getTimeframeFrom = function(time, type) {
  const today = new Date();
  let result

  if(time === 0) {
    today.setHours(today.getHours(), 0, 0, 0);
    result = today
  }
  else if(time === 1) {
    result = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }
  else if (time === 2) {
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    result = startOfWeek
  }
  else if(time === 3) {
    result = new Date(today.getFullYear(), today.getMonth(), 1);
  }
  else if(time === 4) {
    result = today.setHours(today.getHours() - 1, 0, 0, 0);
  }
  else if(time === 5) {
    today.setDate(today.getDate() - 1);
    today.setHours(0, 0, 0, 0);
    result = today
  }
  else if(time === 6) {
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 7 - today.getDay() + 1);
    lastWeekStart.setHours(0, 0, 0, 0);

    result = lastWeekStart
  }
  else if(time === 7) {
    result = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0);
  }

  return this.getDate(result, type)
}

Base.prototype.getTimeframeTo = function(time, type) {
  const today = new Date();
  let result

  if (time === 0 || time === 1 || time === 2 || time === 3) {
    result = today
  }
  else if(time === 4) {
    result = today.setHours(today.getHours(), 0, 0, 0);
  }
  else if(time === 5) {
    today.setDate(today.getDate() - 1);
    today.setHours(23, 59, 59, 999);
    result = today
  }
  else if(time === 6) {
    const lastWeekEnd = new Date(today);
    lastWeekEnd.setDate(today.getDate() - today.getDay());
    lastWeekEnd.setHours(23, 59, 59, 999);
    result = lastWeekEnd
  }
  else if(time === 7) {
    const last = new Date(today.getFullYear(), today.getMonth(), 0);
    last.setHours(23, 59, 59, 999);
    result = last
  }

  return this.getDate(result, type)
}

Base.prototype.defaultSelect = function() {
  $('.js-select-input').select2({
    placeholder: {
      id: '-1',
      // eslint-disable-next-line no-undef
      text: language.select_values
    }
  });
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
