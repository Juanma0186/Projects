import z from 'zod'

const tareasSchema = z.object({
  descripcion: z.string().min(2),
  estado: z.enum(['todo', 'doing', 'done'])
})

export function validarTarea (input) {
  return tareasSchema.safeParse(input)
}

// Validamos los campos como si todos fueran opcionales ya que no sabemos que va a cambiar el usuario
export function validarCampos (input) {
  return tareasSchema.partial().safeParse(input)
}
