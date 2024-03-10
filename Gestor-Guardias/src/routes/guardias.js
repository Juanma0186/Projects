import express from 'express'
import { getAllGuardias, getGuardias, addGuardia, deleteGuardia, deleteAllGuardias, updateGuardia } from '../controllers/guardiasController.js'

import { getProfesores } from '../controllers/profesControllers.js'
import { verifyToken, verifyAdmin } from '../middlewares/auth.js'

export const router = express.Router()

router.get('/all', verifyToken, verifyAdmin, getAllGuardias)
router.post('/add', verifyToken, verifyAdmin, addGuardia)
router.get('/profesores', verifyToken, verifyAdmin, getProfesores)

//! Ruta para obtener las guardias de un profesor específico
router.get('/profesor/', verifyToken, getGuardias)
router.delete('/deleteAll', verifyToken, verifyAdmin, deleteAllGuardias)
router.delete('/:id', verifyToken, verifyAdmin, deleteGuardia)
router.put('/:id', verifyToken, verifyAdmin, updateGuardia)

export default router
