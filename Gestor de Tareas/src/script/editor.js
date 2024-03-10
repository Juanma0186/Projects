import { actualizarTarea } from './crearTarea.js'

export function mostrarEditor (id, descripcion) {
  const editarTareaContainer = document.getElementById('editarTarea-container')

  // LLevamos le scroll arriba del todo de manera smooth y desactivamos el scroll
  window.scrollTo({ top: 0, behavior: 'smooth' })
  document.body.style.overflow = 'hidden'

  setTimeout(() => {
    editarTareaContainer.style.display = 'flex'
    editarTareaContainer.classList.add('appear')
  }, 100)

  setTimeout(() => {
    editarTareaContainer.classList.remove('appear')
  }, 350)

  // Rellenamos los campos con los datos de la tarea
  document.getElementById('idTareaSeleccionada').textContent = 'ID: ' + id
  // Ponemos en checked el valor del estado en el formulario de los radio buttons usando el el name del input y el valor del estado
  document.querySelector(`input[name="estadoEditar"][value="${descripcion}"]`)
  // Sacamos el ID del padre para saber en que columna está la tarea
  console.log(document.getElementById(id).parentNode.id)
  document.querySelector(`input[name="estadoEditar"][value="${document.getElementById(id).parentNode.id}"]`).checked = true
  document.getElementById('notaEditar').value = descripcion

  editarTareaContainer.addEventListener('click', (e) => {
    if (e.target === editarTareaContainer) {
      editarTareaContainer.classList.remove('appear')
      editarTareaContainer.classList.add('disappear')
      // Activamos el scroll
      document.body.style.overflow = 'auto'

      setTimeout(() => {
        editarTareaContainer.classList.remove('disappear')
        editarTareaContainer.style.display = 'none'
      }, 350)
    }
  })
}
export function cerrarEditor () {
  const editarTareaContainer = document.getElementById('editarTarea-container')
  const idTarea = parseInt(document.getElementById('idTareaSeleccionada').textContent.split(' ')[1]) // Quitamos "ID: " del texto
  const descripcion = document.getElementById('notaEditar').value
  const estado = document.querySelector('input[name="estadoEditar"]:checked').value

  editarTareaContainer.classList.remove('appear')
  editarTareaContainer.classList.add('disappear')
  // Activamos el scroll
  document.body.style.overflow = 'auto'

  actualizarTarea(idTarea, estado, descripcion)

  setTimeout(() => {
    editarTareaContainer.classList.remove('disappear')
    editarTareaContainer.style.display = 'none'
  }, 350)
}
