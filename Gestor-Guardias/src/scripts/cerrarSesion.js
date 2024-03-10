export function cerrarSesion () {
  globalThis.localStorage.removeItem('token')
  globalThis.localStorage.removeItem('name')

  window.location.href = '../index.html'
}
