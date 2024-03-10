export interface User {
  id: number;
  username: string;
  lastname: string;
  first_name:string;
  last_name:string
  email: string;
  rol: Rol;
  entidad?: string;
  promotor?: string;
  password: string;
}

export enum Rol {
  Administracion = 'admin',
  Ciudadano = 'ciudadano',
  Promotor = 'promotor',
  Banco = 'banco',
}
