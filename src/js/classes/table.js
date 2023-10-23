import {ACTIONS, SETTINGS} from "../constant/constant";

export default function Table() {
  this.data     = []
  this.keys     = []
  this.navbar   = []
  this.navigation = {
    all: 0,
    pages: 0,
    current: 0,
    quantity: 0
  }
}

Table.prototype.updateNavigation = function() {
  $('.js-pagination-count-start').html(this.navigation.current * this.navigation.quantity + 1)
  $('.js-pagination-count-end').html(
    this.navigation.current < this.navigation.pages
      ?
        this.navigation.current * this.navigation.quantity + this.navigation.quantity + 1
      :
        this.navigation.all
  )
  $('.js-pagination-all').html(this.navigation.all)

  if (this.navigation.current === 0) {
    $('.js-pagination-start').addClass('pagination__button--disabled')
    $('.js-pagination-prev').addClass('pagination__button--disabled')
  }
  else {
    $('.js-pagination-start').removeClass('pagination__button--disabled')
    $('.js-pagination-prev').removeClass('pagination__button--disabled')
  }

  if (this.navigation.current >= this.navigation.pages) {
    $('.js-pagination-end').addClass('pagination__button--disabled')
    $('.js-pagination-next').addClass('pagination__button--disabled')
  }
  else {
    $('.js-pagination-end').removeClass('pagination__button--disabled')
    $('.js-pagination-next').removeClass('pagination__button--disabled')
  }
}

Table.prototype.setKeys = function(el) {
  const self = this
  el.find('div[data-key]').each(function() {
    const k = $(this).data('key')
    if (k.indexOf('[') !== -1 || k.indexOf(']') !== -1) {
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

Table.prototype.drawData = function(data) {
  let html = ''
  const self = this

  data.forEach(function(item, index){
    html += `<div class="table__row" data-parent="${index}">`

    self.keys.forEach(function(idx) {
      html += `<div class="table__cell" data-cell="${idx}">`

      if (item[idx]) {
        if (typeof item[idx] !== 'object') {
          if (SETTINGS[idx])
            html += SETTINGS[idx][item[idx]] || item[idx]
          else
            html += item[idx]
        }
        else {
          html += `<div class="table__list">`
            Object.keys(item[idx]).forEach(function(key) {
              html += `<div>${key} - ${item[idx][key]}</div>`
            })
          html += `</div>`
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
  })

  return html
}

Table.prototype.getData = function(el, url) {
  const self = this
  $('.js-loader').addClass('loader--active')

  window.base.sendFormData(
    null,
    `${window.base.base}${url}`,
    'GET',
    (response) => {
      if (response) {
        self.data = response
        el.find('.table__wrapper').html(self.drawData())
        $('.js-loader').removeClass('loader--active')
      }
    }, function (xhr, status, error) {
      console.error(error);
    },
    {
      async: false
    })
}


// Table.prototype.drawData = function() {
//   let html = ''
//   const self = this
//
//   this.data.data.forEach(function(item, index){
//     html += `<div class="table__row ${item.locked === '1' ? 'table__row--disabled' : ''}" data-parent="${index}">`
//
//     self.keys.forEach(function(idx) {
//       html += `<div class="table__cell">`
//
//       if (item[idx]) {
//         if (typeof item[idx] !== 'object') {
//           if (SETTINGS[idx])
//             html += SETTINGS[idx][item[idx]] || item[idx]
//           else
//             html += item[idx]
//         }
//         else {
//           const l = Object.keys(item[idx]).length
//
//           html += `<div class="table__list ${l > 2 && 'table__list--hidden'} js-table-list">`
//           Object.keys(item[idx]).forEach(function(key) {
//             html += `<div>${key} - ${item[idx][key]}</div>`
//           })
//           html += `</div>`
//
//           if (l > 2) {
//             html += `<button class="table__link js-show-more">More</button>`
//           }
//         }
//       }
//       else if (idx === 'empty') {
//         html += ''
//       }
//       else {
//         html += ''
//       }
//
//       if (typeof idx === 'object') {
//         idx.forEach(function(value) {
//           html += self.actionsData(value)
//         })
//       }
//       html += `</div>`
//     })
//
//     html += `</div>`
//
//     if(item.shops && item.shops !== '0') {
//       html += `<div class="table__row" data-parent="${index}" data-id="${item.id}">
//                             <div class="table__cell">
//                               <button class="table__button js-table-button-shops" title="Shops">
//                                 <span class="action">
//                                     <i class="fa fa-building"></i>
//                                     <span class="action__label">${item.shops}</span>
//                                 </span>
//                                 <span class="u-ml-8">Shops</span>
//                              </button>
//                            </div>
//                            <div class="table__cell">
//                              ${self.actionsData('add')}
//                            </div>
//                          </div>`
//     }
//
//     if(item.shops && item.subclients !== '0') {
//       html += `<div class="table__row" data-parent="${index}" data-id="${item.id}">
//                           <div class="table__cell">
//                             <button class="table__button js-table-button-subclients" title="Subclients">
//                               <span class="action">
//                                 <i class="fa fa-users"></i>
//                                 <span class="action__label">${item.subclients}</span>
//                               </span>
//                               <span class="u-ml-8">Clients</span>
//                             </button>
//                           </div>
//                        </div>`
//     }
//   })
//
//   return html
// }

// Table.prototype.getData = function(el, id = 0) {
//   const self = this
//   $('.js-loader').addClass('loader--active')
//
//   base.sendFormData(
//     null,
//     `${base.base}/accounts/?id=${id}`,
//     'GET',
//     (response) => {
//       if (response) {
//         self.data = response
//         el.find('.table__wrapper').html(self.drawData())
//         $('.js-loader').removeClass('loader--active')
//       }
//     }, function (xhr, status, error) {
//       console.error(error);
//     },
//     {
//       async: false
//     })
// }
