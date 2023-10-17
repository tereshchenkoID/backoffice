function Base() {
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
  $(`.js-dropdown-link[data-value="${this.language}"]`).addClass('dropdown__link--active')
  $('.js-dropdown-selected span').text(this.language.toUpperCase())
  $('.js-dropdown-selected').attr('data-value', this.language)

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

const base = new Base()
base.updateLanguage()



const SETTINGS = {
  "locked": {
    "0": "No",
    "1": "Yes"
  }
}



function Table() {
  this.base     = 'https://api.qool90.bet/api/'
  this.data     = []
  this.keys     = []
  this.navbar   = []
}

Table.prototype.setKeys = function(el) {
  const self = this
  el.find('div[data-key]').each(function() {
    const k = $(this).data('key')
    if (k.indexOf(',') !== -1) {
      self.keys.push(k.split(','))
    }
    else {
      self.keys.push(k);
    }
  });
}

Table.prototype.actionsData = function(type) {
  switch (type) {
    case 'add':
      return '<button class="action js-action" title="Add new agent"><i class="fa fa-plus"></i></button>'
    case 'edit':
      return '<button class="action js-action" title="Edit"><i class="fa fa-pencil-alt"></i></button>'
    case 'transfer':
      return '<button class="action" title="Transfer"><i class="fa fa-money-check"></i></button>'
    case 'password':
      return '<button class="action js-action" title="Change Password"><i class="fa fa-lock"></i></button>'
    default:
      return '<button class="action js-action" title="Add"><i class="fa fa-plus"></i></button>'
  }
}

Table.prototype.updateNavbar = function() {
  let html = ''

  this.navbar.forEach(function(item, index) {
    html += `<button class="navbar__link js-navbar-link" data-id="${item.id}" data-idx="${index}">${item.login}</button>`
  })

  $('.js-navbar').html(html)
}

Table.prototype.drawData = function() {
  let html = ''
  const self = this

  this.data.data.forEach(function(item, index){
    html += `<div class="table__row ${item.locked === '1' && 'table__row--disabled'}" data-parent="${index}">`

    self.keys.forEach(function(idx) {
        html += `<div class="table__cell">`
                if (item[idx]) {
                  if (typeof item[idx] !== 'object') {
                    if (SETTINGS[idx])
                      html += SETTINGS[idx][item[idx]]
                    else
                      html += item[idx]
                  }
                  else {
                    const l = Object.keys(item[idx]).length

                    html += `<div class="table__list ${l > 2 && 'table__list--hidden'} js-table-list">`
                      Object.keys(item[idx]).forEach(function(key) {
                        html += `<div>${key} - ${item[idx][key]}</div>`
                      })
                    html += `</div>`

                    if (l > 2) {
                      html += `<button class="table__link js-show-more">More</button>`
                    }
                  }
                }
                else if (idx === 'empty') {
                    html += ''
                }
                else {
                  html += ''
                }

                if (typeof idx === 'object') {
                  idx.forEach(function(value) {
                    html += self.actionsData(value)
                  })
                }
        html += `</div>`
    })

    html += `</div>`

            if(item.shops && item.shops !== '0') {
                html += `<div class="table__row" data-parent="${index}" data-id="${item.id}" style="pointer-events: none; opacity: 0.3">
                            <div class="table__cell">
                              <button class="table__button js-table-button-shops" title="Shops">
                                <span class="action">
                                    <i class="fa fa-building"></i>
                                    <span class="action__label">${item.shops}</span>
                                </span>
                                <span class="u-ml-8">Shops</span>
                             </button>
                           </div>
                           <div class="table__cell">
                             ${self.actionsData('add')}
                           </div>
                         </div>`
            }

            if(item.shops && item.subclients !== '0') {
              html += `<div class="table__row" data-parent="${index}" data-id="${item.id}">
                          <div class="table__cell">
                            <button class="table__button js-table-button-subclients" title="Subclients">
                              <span class="action">
                                <i class="fa fa-users"></i>
                                <span class="action__label">${item.subclients}</span>
                              </span>
                              <span class="u-ml-8">Clients</span>
                            </button>
                          </div>
                          <div class="table__cell">
                             ${self.actionsData('add')}
                             ${self.actionsData('edit')}
                             ${self.actionsData('password')}
                             ${self.actionsData('transfer')}
                          </div>
                       </div>`
            }
  })

  return html
}

Table.prototype.getData = function(el, id = 0) {
  const self = this
  base.sendFormData(
    null,
    `${this.base}/accounts/?id=${id}`,
    'GET',
    (response) => {
      if (response) {
        self.data = response

        $('.js-table-accounts').find('.table__wrapper').html(self.drawData())

        // if (inner){
        //   $(self.drawData()).insertAfter(el)
        // }
        // else{
        //   el.append(self.drawData())
        // }
      }
    }, function (xhr, status, error) {
      console.error(error);
    },
    {
      async: false
    })
}

const table = new Table()
table.setKeys($('.js-table-accounts'))
table.getData($('.js-table-accounts'))


setInterval(base.updateDateTime, 1000);

$('body').on('click', '.js-table-button-subclients', function() {
  const $row = $(this).closest('.table__row')
  table.getData($('.js-table-accounts'), $row.attr('data-id'))

  if (table.navbar.length === 0) {
    table.navbar.push({
      id: 0,
      login: "Main"
    })
  }


  table.navbar.push(table.data.data[$row.attr('data-parent')])
  table.updateNavbar()
})

$('body').on('click', '.js-show-more', function() {
  const $list = $(this).prev('.js-table-list')
  $list.toggleClass('table__list--hidden')

  if ($list.hasClass('table__list--hidden')) {
    $(this).html('More')
  }
  else {
    $(this).html('Hide')
  }
})

$('body').on('click', '.js-navbar-link', function() {
  const id = $(this).attr('data-id')
  const idx = $(this).attr('data-idx')

  table.getData($('.js-table-accounts'), id)
  table.navbar.splice(Number(idx) + 1)

  if(table.navbar.length === 1) {
    table.navbar = []
  }

  table.updateNavbar()
})


// $('body').on('click', '.js-action', function() {
//   $('#aside').addClass('aside--active')
// })
//
// $('#aside .button').on('click', function() {
//   $('#aside').toggleClass('aside--active')
// })

$('.js-field-eye').on('click', function() {
  const $field = $(this).closest('.js-field')
  $field.toggleClass('field--show')

  if ($field.hasClass('field--show')) {
    $field.find('.js-field-input').attr('type', 'text')
  }
  else {
    $field.find('.js-field-input').attr('type', 'password')
  }
})

$('.js-dropdown-selected').on('click', function() {
  const $parent = $(this).closest('.js-dropdown')
  $parent.find('.js-dropdown-list').slideToggle(200, "linear", function() {
    $parent.toggleClass('dropdown--active')
  })
})

$('.js-dropdown-link').on('click', function() {
  const $parent = $(this).closest('.js-dropdown')
  const $selected = $parent.find('.js-dropdown-selected')
  $parent.find('.dropdown__link--active').removeClass('dropdown__link--active')
  $(this).addClass('dropdown__link--active')

  $parent.attr('data-value', $(this).attr('data-value'))
  $selected.find('span').html($(this).html())

  $parent.find('.js-dropdown-list').slideUp(200, "linear", function() {
    $parent.removeClass('dropdown--active')
  })

  localStorage.setItem('lang', $(this).attr('data-value'))
  base.language = $(this).attr('data-value')
  base.updateLanguage()
})

$('.js-nav-link').on('click', function() {
  const $el = $(this)
  $(this).next('.js-submenu').slideToggle(300, "linear", function () {
    $el.toggleClass('nav__link--active')
  })
})

$('.js-account-icon').on('click', function() {
  $(this).next('.js-account-dropdown').slideToggle(200, "linear")
})

