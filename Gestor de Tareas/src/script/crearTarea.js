import { dragNDrop } from './dragAndDrop.js'
import { mostrarEditor } from './editor.js'

export function actualizar () {
  fetch('/api/tareas')
    .then(res => res.json())
    .then(tareas => {
      const todo = document.getElementById('todo')
      const doing = document.getElementById('doing')
      const done = document.getElementById('done')

      Array.from(todo.children).forEach(tarea => {
        if (tarea.classList.contains('tarea') && !tarea.classList.contains('anadir')) tarea.remove()
      })
      doing.innerHTML = ''
      done.innerHTML = ''

      tareas.forEach(tarea => {
        switch (tarea.estado) {
          case 'todo':
            todo.appendChild(dibujarTarea(tarea.id, tarea.descripcion, tarea.estado))
            break
          case 'doing':
            doing.appendChild(dibujarTarea(tarea.id, tarea.descripcion, tarea.estado))
            break
          case 'done':
            done.appendChild(dibujarTarea(tarea.id, tarea.descripcion, tarea.estado))
            break
        }
      })
    })
    .then(() => {
      dragNDrop()
    })
    .catch(err => {
      console.error(err)
    })
}

export function anadirTarea () {
  const descripcion = document.getElementById('nota').value
  const estado = document.querySelector('input[name="estado"]:checked').value

  fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ descripcion, estado })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Error al crear la tarea')
      }
      return res.json()
    })
    .then(tarea => {
      switch (tarea.estado) {
        case 'todo':
          document.getElementById('todo').appendChild(dibujarTarea(tarea.id, tarea.descripcion))
          break
        case 'doing':
          document.getElementById('doing').appendChild(dibujarTarea(tarea.id, tarea.descripcion))
          break
        case 'done':
          document.getElementById('done').appendChild(dibujarTarea(tarea.id, tarea.descripcion))
          break
      }
    })
    .then((dragNDrop))
    .then(() => {
    })
}

export function eliminarTarea (id) {
  fetch('/' + id, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al eliminar la tarea')
      document.getElementById(id).remove()
    })
    .then(() => {
    })
}

// ? Eliminar todas las tareas

export function eliminarTodas () {
  fetch('/', {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al eliminar las tareas')
      document.querySelectorAll('tarea').forEach(tarea => {
        if (!tarea.classList.contains('anadir')) tarea.remove()
      })
      actualizar()
    })
}

// ? Mover una tarea

export function moverTarea (id, estado) {
  fetch('/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ estado })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Error al mover la tarea')
      }
    })
}

// ? Actualizar una tarea

export function actualizarTarea (id, estado, descripcion) {
  fetch('/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ estado, descripcion })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Error al actualizar la tarea')
      }
    })
    .then(() => {
      actualizar()
    })
}

// ? Función para dibujar una tarea
function dibujarTarea (id, descripcion, estado = 'todo') {
  const tarea = document.createElement('div')
  tarea.setAttribute('id', id)
  tarea.classList.add('tarea')
  tarea.setAttribute('draggable', 'true')

  const contenido = document.createElement('div')
  contenido.classList.add('contenido')

  const p = document.createElement('p')
  p.innerText = descripcion

  const opciones = document.createElement('div')
  opciones.classList.add('opciones')

  const idSpan = document.createElement('span')
  idSpan.classList.add('id')
  idSpan.innerText = `ID: ${id}`

  const botones = document.createElement('div')
  botones.classList.add('botones')

  const pincel = document.createElement('span')
  pincel.classList.add('material-icons-outlined')
  pincel.textContent = 'brush'
  pincel.addEventListener('click', () => {
    console.log(id)
    mostrarEditor(id, descripcion)
  })

  const basura = document.createElement('span')
  basura.classList.add('material-icons-outlined')
  basura.textContent = 'delete'
  basura.addEventListener('click', () => {
    eliminarTarea(id)
  })

  botones.appendChild(pincel)
  botones.appendChild(basura)

  opciones.appendChild(idSpan)
  opciones.appendChild(botones)

  contenido.appendChild(p)
  contenido.appendChild(opciones)

  tarea.appendChild(contenido)

  return tarea
}
