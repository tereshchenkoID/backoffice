import SETTINGS from "./constant/constant"

import loader from "./functions/loader"

import tostify from "./plugins/tostify";

import Base from "./classes/base";
import Forms from './classes/forms'
import Table from './classes/table'
import Ticket from './classes/ticket'
import Dialog from './classes/dialog'

const base = new Base()
const forms = new Forms()
const table = new Table()
const ticket = new Ticket()
const dialog = new Dialog()

window.SETTINGS = SETTINGS

window.tostify = tostify
window.loader = loader

window.base = base
window.forms = forms
window.table = table
window.ticket = ticket
window.dialog = dialog

base.setLanguage()
setInterval(base.updateDateTime, 1000);

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

// $('body').on('click', '.js-navbar-link', function() {
//   const id = $(this).attr('data-id')
//   const idx = $(this).attr('data-idx')
//
//   table.getData($('.js-table-accounts'), id)
//   table.navbar.splice(Number(idx) + 1)
//
//   if(table.navbar.length === 1) {
//     table.navbar = []
//   }
//
//   table.updateNavbar()
// })

$('body').on('click', function(e) {
  if (!$('.js-action').is(e.target) && $('.js-action').has(e.target).length === 0) {
    const $targetElement = $('#aside')
    base.handleOutsideClick($targetElement, e, () => {
      $targetElement.removeClass('aside--active')
    })
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

$('.js-nav-link').on('click', function() {
  const $el = $(this)
  $(this).next('.js-submenu').slideToggle(300, "linear", function () {
    $el.toggleClass('nav__link--active')
  })
})

$('.js-account-icon').on('click', function() {
  $(this).next('.js-account-dropdown').slideToggle(200, "linear")
})


/* Events for dropdown */
$('body').on('click', '.js-dropdown-selected', function() {
  $('.js-dropdown').removeClass('dropdown--active')
  $(this).closest('.js-dropdown').toggleClass('dropdown--active')
})

$('body').on('click', '.js-dropdown-link', function() {
  const $parent = $(this).closest('.js-dropdown')
  const $selected = $parent.find('.js-dropdown-selected')
  $parent.find('.dropdown__link--active').removeClass('dropdown__link--active')
  $(this).addClass('dropdown__link--active')

  $selected.attr('data-value', $(this).attr('data-value'))
  $selected.find('span').html($(this).html())
  $parent.toggleClass('dropdown--active')

  if ($parent.hasClass('js-select-language')) {
    localStorage.setItem('lang', $(this).attr('data-value'))
    base.language = $(this).attr('data-value')
    base.setLanguage()
  }
})

$('body').on('click', function(e) {
  const $targetElement = $('.js-dropdown')
  base.handleOutsideClick($targetElement, e, () => {
    $targetElement.removeClass('dropdown--active')
  })
})
/* End Events for dropdown */

$(document).ready(function() {
  base.defaultSelect()
});
