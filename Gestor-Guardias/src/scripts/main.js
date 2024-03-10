import { login } from './clienteAuth.js'
import { getGuardias, addGuardia, deleteAllGuardias } from './guardias.js'
import { cerrarSesion } from './cerrarSesion.js'

document.addEventListener('DOMContentLoaded', (event) => {
  if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', login)
  }
  if (document.getElementById('get-guardias')) {
    document.getElementById('get-guardias').addEventListener('click', getGuardias)
  }

  if (document.getElementById('add-guardia-form')) {
    const form = document.getElementById('add-guardia-form')
    form.addEventListener('submit', e => {
      e.preventDefault()
      addGuardia()
      form.reset()
    })
  }

  window.onload = function () {
    document.getElementById('username').textContent = globalThis.localStorage.getItem('name').toUpperCase()
    if (globalThis.localStorage.getItem('name') === 'admin') {
      getGuardias()
    }
  }

  if (globalThis.localStorage.getItem('name') === 'admin') {
    document.getElementById('borrar-todas').addEventListener('click', deleteAllGuardias)
    document.getElementById('editor').addEventListener('click', function (e) {
    // si se hace click fuera del editor, se cierra
      if (e.target.id === 'editor') {
        document.getElementById('editor').style.display = 'none'
      }
    })
  }

  document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion)
})
