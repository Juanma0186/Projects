import { cambiarTitulo } from './titulo.js'
import { mostrarCreador, cerrarCreador, abrirCreadorTecla } from './creador.js'
import { cerrarEditor } from './editor.js'
import { actualizar, anadirTarea, eliminarTodas } from './crearTarea.js'
import { mostrarAtajos } from './atajos.js'

globalThis.onload = () => {
  cambiarTitulo()
  mostrarCreador()
  actualizar()
}

// ? Botón limpiar todas las tareas
const limpiar = document.getElementById('limpiar')

limpiar.addEventListener('click', (e) => {
  e.preventDefault()
  eliminarTodas()
})

// ? Botón atajos
const atajosBoton = document.getElementById('atajosBoton')

atajosBoton.addEventListener('click', (e) => {
  e.preventDefault()
  mostrarAtajos()
})

// ? Atajos de teclado
const crearTareaContainer = document.getElementById('crearTarea-container')
const editarTareaContainer = document.getElementById('editarTarea-container')

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && crearTareaContainer.style.display === 'flex') {
    e.preventDefault()
    cerrarCreador()
  }
  if (
    e.key === 'Enter' &&
    e.shiftKey &&
    crearTareaContainer.style.display === 'flex'
  ) {
    e.preventDefault()
    anadirTarea()
    cerrarCreador()
  }
  if (e.key === 'Escape' && editarTareaContainer.style.display === 'flex') {
    e.preventDefault()
    cerrarEditor()
  }
  if (
    e.key === 'Enter' &&
    e.shiftKey &&
    editarTareaContainer.style.display === 'flex'
  ) {
    e.preventDefault()
    actualizar()
    cerrarEditor()
  }

  if (e.shiftKey && e.key === 'N') {
    e.preventDefault()
    console.log('shift + n')
    abrirCreadorTecla()
  }

  if (e.key === 'Delete' && e.ctrlKey) {
    e.preventDefault()
    eliminarTodas()
  }
})
document.getElementById('crear').addEventListener('click', (e) => {
  e.preventDefault()
  anadirTarea()
  cerrarCreador()
})

document.getElementById('actualizar').addEventListener('click', (e) => {
  e.preventDefault()
  cerrarEditor()
})
