import express, { json } from 'express'
import path from 'path'
import { fileURLToPath } from 'node:url'
import morgan from 'morgan'
import authRouter from './src/routes/auth.js'
import { router } from './src/routes/guardias.js'
const app = express()
app.disable('x-powered-by')
const PORT = process.env.PORT ?? 8080
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(json())
app.use(express.static(path.join(__dirname, 'src')))
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))

// ? Obtener el index()
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'formulario.html'))
})

app.use('/auth', authRouter)
app.use('/guardias', router)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
