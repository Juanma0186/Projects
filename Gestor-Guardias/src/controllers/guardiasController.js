import fs from 'node:fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { validarGuardia } from '../helper/validarGuardia.js'
import { v4 as uuidv4 } from 'uuid'
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY
const __dirname = path.dirname(fileURLToPath(import.meta.url))

//! Función para leer todas las guardias de todos los profesores
async function leerTodasLasGuardias () {
  const directorioProfesores = path.join(__dirname, '../data/profes')
  const archivosProfesores = await fs.readdir(directorioProfesores)
  let todasLasGuardias = []
  for (const archivo of archivosProfesores) {
    const guardiasProfesor = JSON.parse(await fs.readFile(path.join(directorioProfesores, archivo), 'utf8'))
    todasLasGuardias = todasLasGuardias.concat(guardiasProfesor)
  }
  return todasLasGuardias
}

//! Obtener todas las guardias de todos los profesores
export async function getAllGuardias (req, res) {
  try {
    const todasLasGuardias = await leerTodasLasGuardias()
    res.json(todasLasGuardias)
  } catch (err) {
    console.error(err)
    res.status(500).send('Ocurrió un error al obtener las guardias.')
  }
}

//! Añadir una nueva guardia a un profesor específico
export async function addGuardia (req, res) {
  try {
    // Crea un objeto guardia con los datos recibidos
    const guardia = {
      id: uuidv4(),
      profesor: req.body.profesor,
      dia: req.body.dia,
      hora: req.body.hora,
      lugar: req.body.lugar,
      descripcion: req.body.descripcion

    }

    const error = validarGuardia(guardia.profesor, guardia.dia, guardia.hora)
    if (error) {
      res.status(422).send(error)
      return
    }

    // Lee todas las guardias de todos los profesores
    const todasLasGuardias = await leerTodasLasGuardias()

    // Comprueba si ya existe una guardia en el mismo día y hora
    const existeGuardia = todasLasGuardias.some(g => g.dia === guardia.dia && g.hora === guardia.hora)
    if (existeGuardia) {
      res.status(400).send(`Ya existe una guardia en este día y hora: ${guardia.dia} a las ${guardia.hora}.`)
      return
    }

    // Comprueba si ya existe una guardia para el mismo profesor en el mismo día
    const existeGuardiaProfesor = todasLasGuardias.some(g => g.profesor === guardia.profesor && g.dia === guardia.dia)
    if (existeGuardiaProfesor) {
      res.status(400).send(`El profesor ${guardia.profesor} ya tiene una guardia asignada el ${guardia.dia}.`)
      return
    }

    // Añade la nueva guardia al archivo JSON del profesor
    const archivo = path.join(__dirname, '../data/profes', `${guardia.profesor}.json`)
    let guardiasProfesor
    try {
      guardiasProfesor = JSON.parse(await fs.readFile(archivo, 'utf8'))
    } catch (err) {
      guardiasProfesor = []
    }
    guardiasProfesor.push(guardia)
    await fs.writeFile(archivo, JSON.stringify(guardiasProfesor, null, 4), 'utf8')

    res.status(201).send(guardiasProfesor)
  } catch (err) {
    console.log(`Error: ${err}`)
    res.status(500).send('Ha ocurrido un error al añadir la guardia.')
  }
}

//! Función para obtener las guardias de un profesor específico
export async function getGuardias (req, res) {
  // Obtiene el nombre del profesor de los parámetros de la ruta
  const token = req.headers.authorization.split(' ')[1]

  // Decodifica el token para obtener el nombre del profesor
  const decoded = jwt.verify(token, SECRET_KEY)
  const profesor = decoded.name

  // Construye la ruta al archivo JSON del profesor
  const filePath = path.join(__dirname, '../data/profes', `${profesor}.json`)

  try {
    // Lee el archivo JSON del profesor de manera asíncrona y envía como respuesta
    const data = await fs.readFile(filePath, 'utf8')
    res.json(JSON.parse(data))
  } catch (err) {
    console.error(err)
    res.status(500).send('Ocurrió un error al leer los datos de las guardias.')
  }
}

export async function deleteGuardia (req, res) {
  try {
    const id = req.params.id

    // Lee todas las guardias de todos los profesores
    const directorioProfesores = path.join(__dirname, '../data/profes')
    const archivosProfesores = await fs.readdir(directorioProfesores)
    for (const archivo of archivosProfesores) {
      const archivoPath = path.join(directorioProfesores, archivo)
      const guardiasProfesor = JSON.parse(await fs.readFile(archivoPath, 'utf8'))

      // Busca la guardia con el ID proporcionado
      const index = guardiasProfesor.findIndex(g => g.id === id)
      if (index !== -1) {
        // Elimina la guardia
        guardiasProfesor.splice(index, 1)

        // Guarda las guardias actualizadas
        await fs.writeFile(archivoPath, JSON.stringify(guardiasProfesor, null, 4), 'utf8')

        res.status(200).send(guardiasProfesor)
        return
      }
    }

    res.status(404).send('No se encontró la guardia con el ID proporcionado.')
  } catch (err) {
    console.log(`Error: ${err}`)
    res.status(500).send('Ha ocurrido un error al eliminar la guardia.')
  }
}

export async function deleteAllGuardias (req, res) {
  try {
    // Lee todas las guardias de todos los profesores
    const directorioProfesores = path.join(__dirname, '../data/profes')
    const archivosProfesores = await fs.readdir(directorioProfesores)
    for (const archivo of archivosProfesores) {
      const archivoPath = path.join(directorioProfesores, archivo)

      // Vacía el archivo de guardias del profesor
      await fs.writeFile(archivoPath, JSON.stringify([], null, 4), 'utf8')
    }

    res.status(200).send('Todas las guardias han sido eliminadas.')
  } catch (err) {
    console.log(`Error: ${err}`)
    res.status(500).send('Ha ocurrido un error al eliminar las guardias.')
  }
}

export async function updateGuardia (req, res) {
  try {
    // Obtiene el id de la guardia a editar de los parámetros de la ruta
    const { id } = req.params

    // Crea un objeto guardia con los datos recibidos
    const guardia = {
      id,
      profesor: req.body.profesor,
      dia: req.body.dia,
      hora: req.body.hora,
      lugar: req.body.lugar,
      descripcion: req.body.descripcion
    }

    const error = await validarGuardia(guardia.profesor, guardia.dia, guardia.hora)
    if (error) {
      res.status(422).send(error)
      return
    }

    // Lee todas las guardias del profesor
    const archivo = path.join(__dirname, '../data/profes', `${guardia.profesor}.json`)
    let guardiasProfesor
    try {
      guardiasProfesor = JSON.parse(await fs.readFile(archivo, 'utf8'))
    } catch (err) {
      res.status(404).send(`No se encontraron guardias para el profesor ${guardia.profesor}.`)
      return
    }

    // Encuentra la guardia a editar
    const index = guardiasProfesor.findIndex(g => g.id === id)
    if (index === -1) {
      res.status(404).send(`No se encontró la guardia con id ${id} para el profesor ${guardia.profesor}.`)
      return
    }

    // Guarda la guardia antigua y la elimina de la lista
    const guardiaAntigua = guardiasProfesor[index]
    guardiasProfesor.splice(index, 1)

    // Lee todas las guardias de todos los profesores
    const todasLasGuardias = await leerTodasLasGuardias()

    // Comprueba si ya existe una guardia en el mismo día y hora en todas las guardias de todos los profesores
    const existeGuardiaMismaHora = todasLasGuardias.some(g => g.dia === guardia.dia && g.hora === guardia.hora && g.id !== id)
    if (existeGuardiaMismaHora) {
      // Si existe, restaura la guardia antigua y envía un error
      guardiasProfesor.splice(index, 0, guardiaAntigua)
      res.status(400).send(`Ya existe una guardia en este día y hora: ${guardia.dia} a las ${guardia.hora}.`)
      return
    }

    // Comprueba si ya existe una guardia para el mismo profesor en el mismo día
    const existeGuardiaMismoProfesorMismoDia = guardiasProfesor.some(g => g.profesor === guardia.profesor && g.id !== id && g.dia === guardia.dia)
    if (existeGuardiaMismoProfesorMismoDia) {
      // Si existe, restaura la guardia antigua y envía un error
      guardiasProfesor.splice(index, 0, guardiaAntigua)
      res.status(400).send(`El profesor ${guardia.profesor} ya tiene una guardia asignada el ${guardia.dia}.`)
      return
    }

    // Si no existe, reemplaza la guardia antigua con la nueva
    guardiasProfesor.splice(index, 0, guardia)
    await fs.writeFile(archivo, JSON.stringify(guardiasProfesor, null, 4), 'utf8')

    res.status(200).send(guardiasProfesor)
  } catch (err) {
    console.log(`Error: ${err}`)
    res.status(500).send('Ha ocurrido un error al editar la guardia.')
  }
}
