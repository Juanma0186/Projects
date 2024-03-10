//! Este  se encarga de manejar la autenticación del cliente y de redirigirlo a la página correspondiente según su rol
export function login (e) {
  e.preventDefault()

  const name = document.getElementById('name').value
  const password = document.getElementById('password').value
  const xhr = new globalThis.XMLHttpRequest()
  xhr.open('POST', '/auth/login', true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Almacena el token en el almacenamiento local
      const response = JSON.parse(xhr.responseText)
      globalThis.localStorage.setItem('token', response.token)
      globalThis.localStorage.setItem('name', response.name)

      // Redirige a admin.html si es un usuario autorizado (admin) o a user.html si no lo es
      if (response.role === 'admin') {
        window.location.href = 'html/admin.html'
      } else {
        window.location.href = 'html/user.html'
      }
    } else {
      globalThis.alert('No estás autorizado para acceder a este recurso.')
    }
  }
  xhr.send(JSON.stringify({ name, password }))
}
