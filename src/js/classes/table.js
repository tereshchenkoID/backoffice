import SETTINGS from "../constant/constant";

export default function Table() {
  this.data     = []
  this.keys     = []
  this.navbar   = []
  this.navigation = {
    all: 0,
    pages: 0,
    current: 0,
    quantity: 20
  }
}

Table.prototype.updateNavigation = function(type) {
  $('.js-pagination-count-start').html(type === 0 ? 0 : this.navigation.current * this.navigation.quantity + 1)
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

Table.prototype.actionHTML = function(type) {
  switch (type) {
    case SETTINGS.TICKET_ACTIONS.CALCULATE:
      return `<button class="action action--calculate action--disabled js-action" title="Calculate" data-type="${SETTINGS.TICKET_ACTIONS.CALCULATE}"><i class="fa fa-calculator"></i></button>`
    case SETTINGS.TICKET_ACTIONS.CANCEL:
      return `<button class="action js-action" title="Cancel" data-type="${SETTINGS.TICKET_ACTIONS.CANCEL}"><i class="fa fa-times"></i></button>`
    case SETTINGS.TICKET_ACTIONS.PRINT:
      return `<button class="action js-action" title="Print" data-type="${SETTINGS.TICKET_ACTIONS.PRINT}"><i class="fa fa-print"></i></button>`
    case SETTINGS.TICKET_ACTIONS.DROPDOWN:
      return `<button class="action action--dropdown js-action" title="Dropdown" data-type="${SETTINGS.TICKET_ACTIONS.DROPDOWN}"><i class="fa fa-plus"></i></button>`
    case SETTINGS.TICKET_ACTIONS.ADD:
      return `<button class="action js-action" title="Add" data-type="${SETTINGS.TICKET_ACTIONS.ADD}"><i class="fa fa-plus"></i></button>`
    case SETTINGS.TICKET_ACTIONS.EDIT:
      return `<button class="action js-action" title="Edit" data-type="${SETTINGS.TICKET_ACTIONS.EDIT}"><i class="fa fa-pencil-alt"></i></button>`
    default:
      return `<button class="action action--dropdown js-action" title="Dropdown" data-type="${SETTINGS.TICKET_ACTIONS.DROPDOWN}"><i class="fa fa-plus"></i></button>`
  }
}

Table.prototype.emptyHTML = function() {
  return `<div class="table__row table__row--wide js-table-row">
            <div class="table__cell js-table-cell">
                <div class="u-full-width u-text-center u-pt-16">
                    <p data-lang="rows_empty"></p>
                </div>
            </div>
          </div>`
}

Table.prototype.getPath = function(data, el) {
  const keys = data.split('.')
  let result = null

  keys.forEach(function(item) {
    if (!result)
      result = el[item]
    else
      result = result[item]
  })

  if (typeof result === 'object') {
    if (typeof result[0] === 'number') {
      return result.join(' - ')
    }
    return result.join(' , ')
  }

  return result
}

Table.prototype.drawHTML = function(el, config, data) {
  let html = ''
  const self = this

  html += `<div class="table__row js-table-row">`
  config.forEach(function(item) {
    if (item.text)
      html += `<div class="table__cell js-table-cell" data-lang="${item.text}"></div>`
    else
      html += `<div class="table__cell js-table-cell"></div>`
  })
  html += '</div>'

  if (data.length) {
    data.forEach(function(item){
      html += `<div class="table__row js-table-row">`

      config.forEach(function(idx) {
        html += `<div class="table__cell js-table-cell" data-cell="${idx.key || null}">`

        if (idx.actions) {

          idx.actions.split(',').forEach(function(action){
            html += self.actionHTML(action)
          })
        }

        if (idx.key) {
          let value = item[idx.key]

          if (idx.key.indexOf('.') !== -1) {
            value = self.getPath(idx.key, item)
          }

          if (idx.fixed) {
            value = parseFloat(value).toFixed(2)
          }

          // if (idx.replace) {
          //   value = `${item[idx.replace]} ${value}`
          // }

          html += value
        }

        html += `</div>`
      })

      html += `</div>`
    })
  }
  else {
    html += self.emptyHTML()
  }

  el.html(html)
}
