import Vue from 'vue'
import VueNotifications from 'vue-notifications'

// Include mini-toaster (or any other UI-notification library)
import miniToastr from 'mini-toastr'
import swal from 'sweetalert'
// We shall setup types of the messages. ('error' type - red and 'success' - green in mini-toastr)
const toastTypes = {
  success: 'success',
  error: 'error',
  info: 'info',
  warn: 'warn'
}

// miniToastr.init({types: toastTypes})

// function toast ({title, message, type, timeout, cb}) {
//   return miniToastr[type](message, title, timeout, cb)
// }
function toast ({title, message, type, timeout, cb}) {
  if (type === VueNotifications.types.warn) type = 'warning'
  return swal(title, message, type)
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}

Vue.use(VueNotifications, options)
