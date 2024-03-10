import { colors } from './colors.js'
import { editarGuardia } from './guardias.js'
export function abrirEditor (guardia) {
  document.getElementById('editor').style.display = 'flex'
  llenarFormulario(guardia)

  document.getElementById('guardarCambios').addEventListener('click', (e) => {
    e.preventDefault()
    const profesor = document.getElementById('profesorEditar').textContent.toLowerCase()
    const dia = document.getElementById('diaEditar').value
    const hora = document.getElementById('horaEditar').value
    const lugar = document.getElementById('lugarEditar').value
    const descripcion = document.getElementById('descripcionEditar').value

    document.getElementById('editor').style.display = 'none'
    editarGuardia(guardia.id, profesor, dia, hora, lugar, descripcion)
  })
}

function llenarFormulario (guardia) {
  const { profesor, dia, hora, lugar, descripcion } = guardia
  document.getElementById('profesorEditar').style.backgroundColor = colors[profesor].bgColor
  document.getElementById('profesorEditar').style.color = colors[profesor].textColor === 'text-black' ? 'black' : 'white'
  document.getElementById('profesorEditar').textContent = profesor.charAt(0).toUpperCase() + profesor.slice(1)
  document.getElementById('diaEditar').value = dia
  document.getElementById('horaEditar').value = hora
  document.getElementById('lugarEditar').value = lugar
  document.getElementById('descripcionEditar').value = descripcion
}
