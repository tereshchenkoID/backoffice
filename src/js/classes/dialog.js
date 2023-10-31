export default function Dialog() {
  this.question = null
  this.params = {}
}

Dialog.prototype.clear = function () {
  this.question = ''
  this.params = {}
}

Dialog.prototype.hide = function() {
  $('.js-dialog').removeClass('dialog--active')
  $('.js-dialog-question').text('')
}

Dialog.prototype.show = function(question, params) {
  this.question = question
  this.params = params

  $('.js-dialog-question').text(this.question)
  $('.js-dialog').addClass('dialog--active')
}

Dialog.prototype.accept = function(successCallback) {
  successCallback()
}
