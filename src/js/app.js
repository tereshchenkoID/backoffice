$('.js-nav-link').on('click', function() {
  const $el = $(this)
  $(this).next('.js-submenu').slideToggle(300, "linear", function () {
    $el.toggleClass('nav__link--active')
  })
})

$('.js-account-icon').on('click', function() {
  $(this).next('.js-account-dropdown').slideToggle(200, "linear")
})


const updateDateTime = () => {
  const $dateTime = $('.js-preview-time');
  const now = new Date();
  const formattedDateTime = now.toLocaleString();

  $dateTime.text(formattedDateTime);
}

setInterval(updateDateTime, 1000);

updateDateTime();
