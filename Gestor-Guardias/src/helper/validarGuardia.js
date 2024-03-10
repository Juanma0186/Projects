export function validarGuardia (profesor, dia, hora) {
  // Valida el día
  const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
  if (!diasValidos.includes(dia.toLowerCase())) {
    return { error: 'Por favor, introduce un día válido (lunes, martes, miercoles, jueves, viernes).', campo: 'dia' }
  }

  // Valida la hora
  const horasValidas = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
  if (!horasValidas.includes(hora)) {
    return { error: 'Por favor, introduce una hora válida (16:00, 17:00, 18:00, 19:00, 20:00, 21:00).', campo: 'hora' }
  }

  return null
}
