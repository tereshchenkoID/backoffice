import Toastify from "toastify-js";

const tostify = (msg, type) => {
  return Toastify({
    text: msg,
    duration: 2000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    className: type,
    onClick() {
    }
  })
}

export default tostify
