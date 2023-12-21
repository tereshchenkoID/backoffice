export default function Forms() {
  this.active = false
}

Forms.prototype.html = function(key, data) {
  if (data.type === 'text' || data.type === 'password' || data.type === 'email' || data.type === 'number') {
    let html = ''
    let options = ''

    if (data.options) {
      data.options.forEach(item => {
        options+= item
      })
    }

    html+= `<div class="field js-field">
                <input class="field__input js-field-input"
                  type="${data.type}"
                  name="${key}"
                  autocomplete="${key}"
                  value="${data.value || ''}"
                  ${options}
                />
                <label class="field__label js-field-label">${data.placeholder}</label>`

                if(data.type === 'password') {
                  html += `<button class="field__eye js-field-eye" type="button"><i class="fa fa-eye"></i></button>`
                }
    html += `</div>`

    return html
  }

  if (data.type === 'select') {
    let html = ''
    html +=  `<div class="select js-select">
                <label class="select__label js-select-label">${data.placeholder}</label>
                <select class="select__input js-select-input" name="${key}">
                  <option value="-1"></option>`

                  data.options.forEach(item => {
                    if (data.value === item.text) {
                      html += `<option value="${item.value}" selected>${item.text}</option>`
                    }
                    else {
                      html += `<option value="${item.value}">${item.text}</option>`
                    }
                  })
    html +=  `  </select>
             </div>`

    return html
  }

  if(data.type === 'dropdown') {
    return window.base.drawAgents(data.data)
  }

  if (data.type === 'textarea') {
    return `<div class="textarea js-textarea">
                <textarea class="textarea__input js-textarea-input" name="${key}" autocomplete="${key}" required="">${data.value || ''}</textarea>
                <label class="textarea__label js-textarea-label">${data.placeholder}</label>
            </div>`
  }

  if (data.type === 'button') {
    let html = '<div class="paper__block u-text-right">'

    data.options.forEach(item => {
      html += `<button class="button button--${item.class} u-ml-16" type="${item.type}">
                  <span class="button__text">${item.placeholder}</span>
              </button>`
    })

    html += `</div>`

    return html
  }

  return ''
}

Forms.prototype.setHTML = function(data) {
  let html = ''

  const self = this
  $.each(data.fields, function(key, value) {
    html += self.html(key, value)
  })

  $('.js-paper-title').html(data.title)
  $('.js-paper-form').html(html)
}
