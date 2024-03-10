// ? Importamos los módulos necesarios
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import fs from 'node:fs/promises'
import morgan from 'morgan'
import { validarTarea, validarCampos } from './src/script/schema/tareas.js'
// Módulo para dar color a la terminal
import pc from 'picocolors'
// Módulo para poder usar require en los módulos de ES6
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

// ? App de express y puerto
const app = express()
app.disable('x-powered-by')
const PORT = process.env.PORT ?? 8080
let tareasJSON = require('./src/json/pelis.json')

// ? Configuramos la ruta de las tareas
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ARCHIVO_JSON = 'pelis.json'

// ? Configuramos el servidor
app.use(express.static(path.join(__dirname, 'src')))
app.use(express.urlencoded({ extended: true }))
// Morgan para ver las peticiones
app.use(morgan('dev'))
// Middleware para parsear el body de las peticiones
app.use(express.json())
// Cors para evitar el error de CORS (CROSSORIGIN RESOURCE SHARING)
app.use(cors())

// ? Obtener el index()
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'))
})

// ? Obtener todas las tareas
app.get('/api/tareas', (req, res) => {
  res.json(tareasJSON)
})

// ? Crear una tarea

app.post('/', async (req, res) => {
  try {
    const result = validarTarea(req.body)

    if (result.error) {
      return res.status(400).json({ error: 'Error al crear la tarea' })
    }
    // Creamos la tarea
    const tarea = {
      id: Date.now(),
      ...result.data
    }

    // Añadimos la tarea al json
    tareasJSON.push(tarea)

    // Guardamos la tarea en el archivo
    await fs.writeFile(
      path.join(__dirname, 'src/json', ARCHIVO_JSON),
      JSON.stringify(tareasJSON),
      'utf-8'
    )

    res.status(201).json(tarea)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al crear la tarea')
  }
})

// ? Eliminar una tarea

app.delete('/:id', async (req, res) => {
  // Eliminamos la tarea del array
  tareasJSON = tareasJSON.filter(
    (tarea) => tarea.id !== parseInt(req.params.id)
  )

  // Guardamos las tareas restantes en el archivo
  await fs.writeFile(
    path.join(__dirname, 'src/json', ARCHIVO_JSON),
    JSON.stringify(tareasJSON),
    'utf-8'
  )

  res.status(200).end()
})

// ? Eliminar todas las tareas

app.delete('/', async (req, res) => {
  tareasJSON = []

  // Guardamos las tareas restantes en el archivo
  await fs.writeFile(
    path.join(__dirname, 'src/json', ARCHIVO_JSON),
    JSON.stringify(tareasJSON),
    'utf-8'
  )

  res.status(204).end()
})

// ? Actualizar una tarea

app.patch('/:id', async (req, res) => {
  try {
    // Buscamos la tarea a actualizar por el id
    const tareaIndex = tareasJSON.findIndex(
      (tarea) => tarea.id === parseInt(req.params.id)
    )

    // Si no existe la tarea devolvemos un error
    if (tareaIndex < 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' })
    }

    // Validamos los campos
    const result = validarCampos(req.body)

    if (result.error) {
      return res.status(400).json({ error: 'Error al actualizar la tarea' })
    }

    // Actualizamos la tarea con los datos existentes y los nuevos
    const tareaActualizada = {
      ...tareasJSON[tareaIndex],
      ...result.data
    }

    // Actualizamos la tarea en el array
    tareasJSON[tareaIndex] = tareaActualizada

    // Guardamos las tareas restantes en el archivo
    await fs.writeFile(
      path.join(__dirname, 'src/json', ARCHIVO_JSON),
      JSON.stringify(tareasJSON),
      'utf-8'
    )

    return res.status(200).json(tareaActualizada)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al actualizar la tarea')
  }
})

// ! Ruta 404 para cualquier otra ruta que no sea ninguna de las anteriores
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'src', 'html', '404.html'))
})

// ? Iniciamos el servidor
app.listen(PORT, () => {
  console.error(
    'Escuchando en: ' + pc.blue('http://localhost:') + pc.magenta(PORT)
  )
})
