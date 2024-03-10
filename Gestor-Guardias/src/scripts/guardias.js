import { colors } from './colors.js'
import { validarGuardia } from '../helper/validarGuardia.js'
import { abrirEditor } from './editorGuardias.js'
//! Obtenemos las guardias de los profesores (si el usuario es un administrador)

export function getGuardias () {
  // Hacer una solicitud GET a /guardias
  const xhr2 = new globalThis.XMLHttpRequest()
  xhr2.open('GET', '/guardias/all', true)
  // Agrega el token al encabezado Authorization
  const token = globalThis.localStorage.getItem('token')
  xhr2.setRequestHeader('Authorization', 'Bearer ' + token)
  xhr2.onload = function () {
    if (xhr2.status === 200) {
      // Maneja la respuesta
      const guardias = JSON.parse(xhr2.responseText)
      renderGuardias(guardias)// Agregar esta línea
    } else {
      globalThis.alert('No se pudieron obtener las guardias.')
    }
  }
  xhr2.send()
}

//! Renderiza las guardias
function renderGuardias (guardias) {
  const celdas = document.querySelectorAll('td[data-dia]')
  celdas.forEach(celda => {
    celda.innerHTML = ''
  })
  guardias.forEach(guardia => {
    const fila = document.querySelector(`tr[data-hora="${guardia.hora}"]`)
    const celda = fila.querySelector(`td[data-dia="${guardia.dia}"]`)
    const guardiaElement = document.createElement('div')
    guardiaElement.innerHTML = `
      <div class="flex items-center justify-center gap-2" data-id="${guardia.id}" data-guardia-prof="${guardia.profesor}">
        <div class="flex-1 flex items-center justify-center w-fit flex-nowrap px-4 py-2 ${colors[guardia.profesor].textColor} bg-[${colors[guardia.profesor].bgColor}] rounded-2xl cursor-pointer group">
        ${guardia.profesor.charAt(0).toUpperCase() + guardia.profesor.slice(1)}
        <button class="eliminar material-icons hidden group-hover:block">close</button>
        </div>

        <tool-tip role="tooltip" class="flex flex-col w-fit rounded-lg overflow-hidden bg-white shadow-lg items-center">
        <p class="p-1 w-full text-center ${colors[guardia.profesor].textColor} bg-[${colors[guardia.profesor].bgColor}]">${guardia.profesor.charAt(0).toUpperCase() + guardia.profesor.slice(1)}</p>
        <div class="p-2.5 flex-col flex gap-[14px] text-nowrap">
          <div class="flex gap-x-4">
            <p class="flex gap-x-2">
              <span class="material-icons">
              place
              </span>
              <span>${guardia.lugar}</span>
            </p>
            <p class="flex gap-x-2">
              <span class="material-icons">
              schedule
              </span>
              <span>${guardia.hora}</span>
            </p>
          </div>
          <p class="flex gap-x-2 text-left">
          <span class="material-icons">
            description
            </span>
            <span class="text-wrap">${guardia.descripcion}</span>
          </p>
        </div>
        </tool-tip>
      </div>
    `
    guardiaElement.addEventListener('click', (e) => {
      if (e.target.classList.contains('eliminar')) {
        deleteGuardia(guardia.id)
      } else {
        abrirEditor(guardia)
      }
    })
    celda.appendChild(guardiaElement)
  })
}

//! Añade una guardia (si el usuario es un administrador)
export function addGuardia () {
  const profesor = document.getElementById('profesor').value
  const dia = document.getElementById('dia').value
  const hora = document.getElementById('hora').value
  const lugar = document.getElementById('lugar').value
  const descripcion = document.getElementById('descripcion').value

  const validacion = validarGuardia(profesor, dia, hora)
  if (validacion) {
    const errorElement = document.getElementById(`error-${validacion.campo}`)
    errorElement.textContent = validacion.error
    return
  }

  const xhr = new globalThis.XMLHttpRequest()
  xhr.open('POST', '/guardias/add', true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  const token = globalThis.localStorage.getItem('token')
  xhr.setRequestHeader('Authorization', 'Bearer ' + token)
  xhr.onload = function () {
    if (xhr.status === 201) {
      try {
        getGuardias()
        document.getElementById('dia').value = ''
        document.getElementById('hora').value = ''
        document.getElementById('lugar').value = ''
      } catch (err) {
        // console.error('Error al analizar la respuesta:', err)
      }
    } else if (xhr.status === 400) {
      // const errorElement = document.getElementById('guardia-pillada')
      // errorElement.textContent = xhr.responseText
    } else {
      globalThis.alert('No se pudo añadir la guardia.')
    }
  }
  xhr.send(JSON.stringify({
    profesor,
    dia,
    hora,
    lugar,
    descripcion
  }))
}

export function deleteGuardia (id) {
  const xhr = new globalThis.XMLHttpRequest()
  xhr.open('DELETE', `/guardias/${id}`, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  const token = globalThis.localStorage.getItem('token')
  xhr.setRequestHeader('Authorization', 'Bearer ' + token)
  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        getGuardias()
      } catch (err) {
        // console.error('Error al analizar la respuesta:', err);
      }
    } else if (xhr.status === 404) {
      globalThis.alert('No se encontró la guardia con el ID proporcionado.')
    } else {
      globalThis.alert('No se pudo eliminar la guardia.')
    }
  }
  xhr.send()
}

export function deleteAllGuardias () {
  const xhr = new globalThis.XMLHttpRequest()
  xhr.open('DELETE', '/guardias/deleteAll', true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  const token = globalThis.localStorage.getItem('token')
  xhr.setRequestHeader('Authorization', 'Bearer ' + token)
  xhr.onload = function () {
    if (xhr.status === 200) {
      getGuardias()
    } else {
      globalThis.alert('No se pudieron eliminar todas las guardias.')
    }
  }
  xhr.send()
}

export function editarGuardia (id, profesor, dia, hora, lugar, descripcion) {
  // Crea un objeto guardia con los datos recogidos
  const guardia = {
    id,
    profesor,
    dia,
    hora,
    lugar,
    descripcion
  }

  // Crea una nueva instancia de XMLHttpRequest
  const xhr = new globalThis.XMLHttpRequest()

  // Configura la solicitud
  xhr.open('PUT', '/guardias/' + id, true)

  // Establece la cabecera 'Content-Type' apropiada
  xhr.setRequestHeader('Content-Type', 'application/json')

  // Establece la cabecera 'Authorization' apropiada
  const token = globalThis.localStorage.getItem('token')
  xhr.setRequestHeader('Authorization', 'Bearer ' + token)

  // Maneja la respuesta
  xhr.onload = function () {
    if (xhr.status === 200) {
      globalThis.alert('Guardia actualizada.')
      getGuardias()
    } else if (xhr.status === 404) {
      globalThis.alert(this.responseText)
    } else {
      globalThis.alert('No se pudieron actualizar las guardias.')
    }
  }

  // Envía la solicitud con los datos de la guardia en formato JSON
  xhr.send(JSON.stringify(guardia))
}
