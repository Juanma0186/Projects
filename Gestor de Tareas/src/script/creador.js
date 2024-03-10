export function mostrarCreador () {
  const anadir = document.getElementById('anadirTarea')
  const crearTareaContainer = document.getElementById('crearTarea-container')
  // Si se hace click en el botón de añadir se muestra el creador de tareas
  anadir.addEventListener('click', () => {
    // LLevamos le scroll arriba del todo de manera smooth y desactivamos el scroll
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.body.style.overflow = 'hidden'

    setTimeout(() => {
      crearTareaContainer.style.display = 'flex'
      crearTareaContainer.classList.add('appear')
    }, 100)

    setTimeout(() => {
      crearTareaContainer.classList.remove('appear')
    }, 350)
  })

  crearTareaContainer.addEventListener('click', (e) => {
    if (e.target === crearTareaContainer) {
      crearTareaContainer.classList.remove('appear')
      crearTareaContainer.classList.add('disappear')
      // Activamos el scroll
      document.body.style.overflow = 'auto'

      setTimeout(() => {
        crearTareaContainer.classList.remove('disappear')
        crearTareaContainer.style.display = 'none'
      }, 350)
    }
  })
}

export function cerrarCreador () {
  const crearTareaContainer = document.getElementById('crearTarea-container')

  crearTareaContainer.classList.remove('appear')
  crearTareaContainer.classList.add('disappear')
  // Activamos el scroll
  document.body.style.overflow = 'auto'

  setTimeout(() => {
    crearTareaContainer.classList.remove('disappear')
    crearTareaContainer.style.display = 'none'
    // Limpiamos los datos del formulario para que la siguiente tarea empiece desde 0 de nuevo
    document.getElementById('formularioCrear').reset()
  }, 350)
}

export function abrirCreadorTecla () {
  const crearTareaContainer = document.getElementById('crearTarea-container')

  // LLevamos le scroll arriba del todo de manera smooth y desactivamos el scroll
  window.scrollTo({ top: 0, behavior: 'smooth' })
  document.body.style.overflow = 'hidden'

  setTimeout(() => {
    crearTareaContainer.style.display = 'flex'
    crearTareaContainer.classList.add('appear')
  }, 100)

  setTimeout(() => {
    crearTareaContainer.classList.remove('appear')
  }, 350)
}
