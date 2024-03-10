import jwt from 'jsonwebtoken'
import { createRequire } from 'node:module'
import dotenv from 'dotenv'

const require = createRequire(import.meta.url)
const users = require('../data/usuarios.json')
dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

//! Verifica las credenciales del usuario y emite un jsonwebtoken si existe el usuario y la contraseña son correctos
export async function auth (req, res) {
  try {
    const user = users.find(user => user.name === req.body.name && user.password === req.body.password)

    if (user) {
      // ? Emite un token con una fecha de caducidad
      const token = jwt.sign({ name: user.name, role: user.role }, SECRET_KEY, { expiresIn: '1h' })
      res.json({ token, name: user.name, role: user.role })
    } else {
      res.status(401).send('No estás autorizado para acceder a este recurso.')
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Ocurrió un error al verificar las credenciales del usuario.')
  }
}

//! Verifica si el usuario es un administrador
export function isAdmin (req, res, next) {
  if (req.authData.role === 'admin') {
    res.json({ isAdmin: true })
  } else {
    res.json({ isAdmin: false })
  }
}
