import bcryptjs from 'bcryptjs'

export const encrypt = async (passwordPlain: string): Promise<string> => {
  // version encriptada de la contraseña
  const hash = await bcryptjs.hash(passwordPlain, 10)
  return hash
}

export const compare = async (passwordPlain: string, hashPassword: string): Promise<boolean> => {
  // compara contraseña encriptada y almanecenada en la BD con la ingresada al iniciar sesion
  return await bcryptjs.compare(passwordPlain, hashPassword)
}

