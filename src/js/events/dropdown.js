export const dropdown = () => {

$('body').on('click', '.js-dropdown-selected', function() {
  const $parent = $(this).closest('.js-dropdown')

  $parent.toggleClass('dropdown--active')
  // $parent.find('.js-dropdown-list').slideToggle(200, "linear", function() {
  //   $parent.toggleClass('dropdown--active')
  // })
})

$('body').on('click', '.js-dropdown-link', function() {
  const $parent = $(this).closest('.js-dropdown')
  const $selected = $parent.find('.js-dropdown-selected')
  $parent.find('.dropdown__link--active').removeClass('dropdown__link--active')
  $(this).addClass('dropdown__link--active')

  $parent.attr('data-value', $(this).attr('data-value'))
  $selected.find('span').html($(this).html())
  $parent.toggleClass('dropdown--active')

  // $parent.find('.js-dropdown-list').slideUp(200, "linear", function() {
  //   $parent.removeClass('dropdown--active')
  // })

  if ($parent.hasClass('js-select-language')) {
    localStorage.setItem('lang', $(this).attr('data-value'))
    base.language = $(this).attr('data-value')
    base.updateLanguage()
  }
})

$('body').on('click', function(e) {
  const $targetElement = $('.js-dropdown')
  if (!$targetElement.is(e.target) && $targetElement.has(e.target).length === 0) {
    $targetElement.removeClass('dropdown--active')
  }
})
}

export default dropdown
