import { colors } from './colors.js'
function cargarGuardias () {
  // Crea una nueva solicitud
  const xhr = new globalThis.XMLHttpRequest()

  // Configura la solicitud
  xhr.open('GET', '/guardias/profesor', true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  const token = globalThis.localStorage.getItem('token')
  xhr.setRequestHeader('Authorization', 'Bearer ' + token)
  // Maneja la respuesta
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (xhr.status === 200) {
        const guardias = JSON.parse(xhr.responseText)
        guardias.forEach(guardia => {
          const fila = document.querySelector(`tr[data-hora="${guardia.hora}"]`)

          const celda = fila.querySelector(`td[data-dia="${guardia.dia}"]`)

          celda.innerHTML = `
            <div class="flex items-center justify-center gap-2" data-id="${guardia.id}" data-guardia-prof="${guardia.profesor}">
        <div class="flex-1 flex items-center justify-center w-fit flex-nowrap px-4 py-2 ${colors[guardia.profesor].textColor} bg-[${colors[guardia.profesor].bgColor}] rounded-2xl cursor-pointer group">
        ${guardia.profesor.charAt(0).toUpperCase() + guardia.profesor.slice(1)}
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
        })
      } else {
        console.error('Error al obtener los datos de las guardias: ' + xhr.status)
      }
    }
  }

  // Envía la solicitud
  xhr.send()
}

cargarGuardias()
