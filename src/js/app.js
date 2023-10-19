import {ACTIONS, SETTINGS} from "./constant";

import Forms from './forms';

function Base() {
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

const forms = new Forms()
// forms.init()


function Table() {
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
    case ACTIONS.ADD:
      return `<button class="action js-action" title="Add" data-type="${ACTIONS.ADD}"><i class="fa fa-plus"></i></button>`
    case ACTIONS.EDIT:
      return `<button class="action js-action" title="Edit" data-type="${ACTIONS.EDIT}"><i class="fa fa-pencil-alt"></i></button>`
    case ACTIONS.TRANSFER:
      return `<button class="action js-action" title="Transfer" data-type="${ACTIONS.TRANSFER}"><i class="fa fa-money-check"></i></button>`
    case ACTIONS.PASSWORD:
      return `<button class="action js-action" title="Change Password" data-type="${ACTIONS.PASSWORD}"><i class="fa fa-lock"></i></button>`
    default:
      return `<button class="action js-action" title="Add" data-type="${ACTIONS.ADD}"><i class="fa fa-plus"></i></button>`
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
    html += `<div class="table__row ${item.locked === '1' ? 'table__row--disabled' : ''}" data-parent="${index}">`

    self.keys.forEach(function(idx) {
        html += `<div class="table__cell">`

                if (item[idx]) {
                  if (typeof item[idx] !== 'object') {
                    if (SETTINGS[idx])
                      html += SETTINGS[idx][item[idx]] || item[idx]
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
                       </div>`
            }
  })

  return html
}

Table.prototype.getData = function(el, id = 0) {
  const self = this
  base.sendFormData(
    null,
    `${base.base}/accounts/?id=${id}`,
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

$('body').on('click', '.js-action', function() {
  forms.active = true
  $('#aside').addClass('aside--active')
  const type = $(this).attr('data-type')
  const idx = $(this).closest('.table__row').attr('data-parent')
  let config

  if (type === ACTIONS.ADD) {
    config = {
      id: '',
      title: "Add",
      fields: {
        login: {
          value: "",
          type: 'text',
          placeholder: "Login *"
        },
        password: {
          value: "",
          type: 'password',
          placeholder: "Password *"
        },
        confirm_password: {
          value: "",
          type: 'password',
          placeholder: "Confirm Password *"
        },
        full_name: {
          value: "",
          type: 'text',
          placeholder: "Full name"
        },
        email: {
          value: "",
          type: 'email',
          placeholder: "Email"
        },
        description: {
          value: "",
          type: 'textarea',
          placeholder: "Description"
        },
        country: {
          value: "",
          type: 'select',
          options: SETTINGS.country,
          placeholder: "Country"
        },
        active_currency: {
          value: "",
          type: 'select',
          options: SETTINGS.currency,
          placeholder: "Active Currency"
        },
        children_creation_allowed: {
          value: "",
          type: 'select',
          options: SETTINGS.choice,
          placeholder: "Children Creation Allowed"
        },
        web_players_allowed: {
          value: "",
          type: 'select',
          options: SETTINGS.choice,
          placeholder: "Web Players Allowed"
        },
        pending_commission: {
          value: "",
          type: 'select',
          options: SETTINGS.choice,
          placeholder: "Record pending commission onto wallet"
        },
        max_child_agents: {
          value: "",
          type: 'number',
          placeholder: "Max child agents"
        },
        max_child_shops: {
          value: "",
          type: 'number',
          placeholder: "Max web shops"
        },
        max_child_players: {
          value: "",
          type: 'number',
          placeholder: "Max web players"
        },
        web_player_url: {
          value: "",
          type: 'number',
          placeholder: "Web player URL"
        },
        actions: {
          type: 'button',
          class: 'primary',
          options: [
            {
              type: 'button',
              class: 'primary',
              placeholder: "Create",
            },
            {
              type: 'reset',
              class: 'default',
              placeholder: "Cancel",
            }
          ]
        },

      }
    }
  }
  else if(type === ACTIONS.EDIT) {
    const data = table.data.data[idx]
    config = {
      id: data.id,
      title: "Edit",
      fields: {
        login: {
          value: data.login,
          type: 'text',
          placeholder: "Login *"
        },
        password: {
          value: "",
          type: 'password',
          placeholder: "Password *"
        },
        confirm_password: {
          value: "",
          type: 'password',
          placeholder: "Confirm Password *"
        },
        full_name: {
          value: data.full_name,
          type: 'text',
          placeholder: "Full name"
        },
        email: {
          value: "",
          type: 'email',
          placeholder: "Email"
        },
        description: {
          value: "",
          type: 'textarea',
          placeholder: "Description"
        },
        country: {
          value: "",
          type: 'select',
          options: SETTINGS.country,
          placeholder: "Country"
        },
        active_currency: {
          value: data.currency,
          type: 'select',
          options: SETTINGS.currency,
          placeholder: "Active Currency"
        },
        children_creation_allowed: {
          value: "",
          type: 'select',
          options: SETTINGS.choice,
          placeholder: "Children Creation Allowed"
        },
        web_players_allowed: {
          value: "",
          type: 'select',
          options: SETTINGS.choice,
          placeholder: "Web Players Allowed"
        },
        pending_commission: {
          value: "",
          type: 'select',
          options: SETTINGS.choice,
          placeholder: "Record pending commission onto wallet"
        },
        max_child_agents: {
          value: "",
          type: 'number',
          placeholder: "Max child agents"
        },
        max_child_shops: {
          value: "",
          type: 'number',
          placeholder: "Max web shops"
        },
        max_child_players: {
          value: "",
          type: 'number',
          placeholder: "Max web players"
        },
        web_player_url: {
          value: "",
          type: 'number',
          placeholder: "Web player URL"
        },
        actions: {
          type: 'button',
          class: 'primary',
          options: [
            {
              type: 'button',
              class: 'primary',
              placeholder: "Create",
            },
            {
              type: 'reset',
              class: 'default',
              placeholder: "Cancel",
            }
          ]
        },

      }
    }
  }
  else if(type === ACTIONS.PASSWORD) {
    const data = table.data.data[idx]
    config = {
      id: data.id,
      title: "Change the password",
      fields: {
        login: {
          value: data.login || '',
          type: 'text',
          placeholder: "Login *"
        },
        password: {
          value: "",
          type: 'password',
          placeholder: "Password *"
        },
        confirm_password: {
          value: "",
          type: 'password',
          placeholder: "Confirm Password *"
        },
        actions: {
          type: 'button',
          class: 'primary',
          options: [
            {
              type: 'button',
              class: 'primary',
              placeholder: "Change",
            },
            {
              type: 'reset',
              class: 'default',
              placeholder: "Cancel",
            }
          ]
        }
      }
    }
  }
  else if(type === ACTIONS.TRANSFER) {
    const data = table.data.data[idx]
    config = {
      id: data.id,
      title: "Transfer agent",
      fields: {
        agent: {
          value: data.login || '',
          type: 'text',
          placeholder: "Login *",
        },
        new_parent: {
          value: "",
          type: 'text',
          placeholder: "New parent *"
        },
        actions: {
          type: 'button',
          class: 'primary',
          options: [
            {
              type: 'button',
              class: 'primary',
              placeholder: "Change",
            },
            {
              type: 'reset',
              class: 'default',
              placeholder: "Cancel",
            }
          ]
        }
      }
    }
  }

  forms.setHTML(config)
})


$('body').on('click', function(e) {
  if (!$('.js-action').is(e.target) && $('.js-action').has(e.target).length === 0) {
    const $targetElement = $('#aside')
    if (!$targetElement.is(e.target) && $targetElement.has(e.target).length === 0) {
      $('#aside').removeClass('aside--active')
    }
  }
})

$('body').on('click', '.js-field-eye', function() {
  const $field = $(this).closest('.js-field')
  $field.toggleClass('field--show')

  if ($field.hasClass('field--show')) {
    $field.find('.js-field-input').attr('type', 'text')
  }
  else {
    $field.find('.js-field-input').attr('type', 'password')
  }
})

$('body').on('click', '.js-dropdown-selected', function() {
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

