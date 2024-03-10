import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

//! Verifica si el token es válido y lo decodifica para obtener la información del usuario autenticado (nombre y rol)
export function verifyToken (req, res, next) {
  const bearerHeader = req.headers.authorization
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    jwt.verify(bearerToken, SECRET_KEY, (err, authData) => {
      if (err) {
        res.sendStatus(403)
      } else {
        req.authData = authData
        next()
      }
    })
  } else {
    res.sendStatus(403)
  }
}

//! Verifica si el usuario es un administrador para permitirle realizar ciertas acciones
export function verifyAdmin (req, res, next) {
  if (req.authData.role === 'admin') {
    next()
  } else {
    res
      .status(403)
      .send('No tienes permisos suficientes para realizar esta acción.')
  }
}
