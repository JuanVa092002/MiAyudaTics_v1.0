import { IUsuario } from '../models/usuarios'

declare global {
  namespace Express {
    interface Request {
      usuario?: IUsuario;
    }
  }
}

