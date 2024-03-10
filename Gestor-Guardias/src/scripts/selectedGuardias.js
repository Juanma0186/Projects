// Importamos los colores de los profesores
import { colors } from './colors.js'
// Cogemos todos los profes que tengan el data-select-prof y los guardamos en una constante
const selectedProfes = Array.from(document.querySelectorAll('[data-select-prof]'))
// Añadimos un evento a cada uno de ellos
selectedProfes.forEach(prof => {
  prof.addEventListener('click', () => {
    const profesor = prof.textContent.trim().toLowerCase()
    // Cogemos las guardias de este profesor concreto
    let guardias
    if (profesor === 'todos') {
      guardias = Array.from(document.querySelectorAll('[data-guardia-prof]'))

      prof.style.backgroundColor = colors[profesor].bgColor
      guardias.forEach(guardia => {
        guardia.style.display = 'flex'
        selectedProfes.forEach(prof => {
          prof.removeAttribute('style')
        })
      })
    } else {
      guardias = Array.from(document.querySelectorAll(`[data-guardia-prof="${profesor}"]`))
      // Si el boton de  profesor está seleccionado, mostramos las guardias de ese profesor
      if (prof.style.backgroundColor === '') {
        guardias.forEach(guardia => {
          guardia.style.display = 'flex'
          // Añadimos un fondo de color al profesor seleccionado
          prof.style.backgroundColor = colors[profesor].bgColor
        })
      }
      // Si no, las ocultamos
      selectedProfes.forEach(prof => {
        if (prof.textContent.trim().toLowerCase() !== profesor) {
          const guardias = Array.from(document.querySelectorAll(`[data-guardia-prof="${prof.textContent.trim().toLowerCase()}"]`))
          guardias.forEach(guardia => {
            guardia.style.display = 'none'
            // Quitamos el fondo de color al profesor no seleccionado
            prof.removeAttribute('style')
          })
        }
      })
    }
  })
})
