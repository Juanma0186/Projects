/* eslint-disable no-undef */
//! Obtiene los profesores para mostrarlos en el select
function getProfesores () {
  const select = document.getElementById('profesor')
  const xhr = new XMLHttpRequest()
  xhr.open('GET', '/guardias/profesores', true)
  const token = localStorage.getItem('token')
  xhr.setRequestHeader('Authorization', 'Bearer ' + token)
  xhr.onload = function () {
    if (xhr.status === 200) {
      const profes = JSON.parse(xhr.responseText)
      if (profes) {
        for (const profe of profes) {
          const option = document.createElement('option')
          option.value = profe.name
          option.text = profe.name
          select.appendChild(option)
        }
      }
    } else {
      console.error('Error: ' + xhr.status)
      return null
    }
  }
  xhr.send()
}

getProfesores()
