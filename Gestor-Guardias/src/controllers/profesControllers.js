import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const ARCHIVO_JSON = 'usuarios.json'
let users

try {
  users = require(`../data/${ARCHIVO_JSON}`)
} catch (err) {
  users = []
}

//! Obtener los usuarios con role profesor para mostrarlos en el select
export async function getProfesores (req, res) {
  try {
    const profesores = users.filter(usuario => usuario.role === 'profesor')
    res.json(profesores)
  } catch (err) {
    console.error(err)
    res.status(500).send('Ocurrió un error al obtener los profesores.')
  }
}
