import { moverTarea } from './crearTarea.js'

export function dragNDrop () {
  const tareas = document.getElementsByClassName('tarea')
  const listas = document.getElementsByClassName('tarea-container')

  // Recorrer todas las tareas y agregarles los eventos
  for (const tarea of tareas) {
  // Cuando se empieza a arrastrar una tarea
    tarea.addEventListener('dragstart', function (e) {
    // Guardar la tarea seleccionada y evitamos que coja más de un div al mismo tiempo
      let selected = this
      this.addEventListener('dragend', function (e) {
        selected = null
      })

      // Recorrer todas las listas y agregarles los eventos
      for (const lista of listas) {
        lista.addEventListener('dragover', function (e) {
          e.preventDefault()
        })

        lista.addEventListener('dragenter', function (e) {
          lista.parentNode.classList.add('hover')
        })

        lista.addEventListener('dragleave', function (e) {
          lista.parentNode.classList.remove('hover')
        })

        // Cuando se suelta la tarea en una lista
        lista.addEventListener('drop', function (e) {
          lista.parentNode.classList.remove('hover')

          if (selected === null) return
          this.appendChild(selected)
          moverTarea(selected.id, this.id)
          selected = null
        })
      }
    })
  }
}
