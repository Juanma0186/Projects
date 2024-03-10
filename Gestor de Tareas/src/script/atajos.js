export function mostrarAtajos () {
  const atajosContainer = document.getElementById('atajos-container')

  window.scrollTo({ top: 0, behavior: 'smooth' })
  document.body.style.overflow = 'hidden'

  setTimeout(() => {
    atajosContainer.style.display = 'flex'
    atajosContainer.classList.add('appear')
  }, 100)

  setTimeout(() => {
    atajosContainer.classList.remove('appear')
  }, 350)

  atajosContainer.addEventListener('click', (e) => {
    if (e.target === atajosContainer) {
      atajosContainer.classList.remove('appear')
      atajosContainer.classList.add('disappear')

      document.body.style.overflow = 'auto'

      setTimeout(() => {
        atajosContainer.classList.remove('disappear')
        atajosContainer.style.display = 'none'
      }, 350)
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && atajosContainer.style.display === 'flex') {
      e.preventDefault()
      atajosContainer.classList.remove('appear')
      atajosContainer.classList.add('disappear')

      document.body.style.overflow = 'auto'

      setTimeout(() => {
        atajosContainer.classList.remove('disappear')
        atajosContainer.style.display = 'none'
      }, 350)
    }
  })
}
