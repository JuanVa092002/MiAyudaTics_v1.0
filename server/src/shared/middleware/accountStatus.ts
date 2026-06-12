import type { IUsuario } from '../../features/users/models/usuarios'
import type { Response } from 'express'

export function isAccountAllowed(user: IUsuario): boolean {
  if (user.activo === false) return false
  if (user.rol === 'tecnico' && user.estado === false) return false
  return true
}

export function rejectInactiveAccount(res: Response, user: IUsuario): boolean {
  if (user.rol === 'tecnico' && user.estado === false) {
    res.status(403).send({
      message:
        'Su registro se encuentra sujeto a aprobación por parte del Líder TIC. Una vez sea aprobado, podrá ingresar al sistema.',
    })
    return true
  }

  if (user.activo === false) {
    res.status(403).send({
      message:
        'Su cuenta se encuentra inactiva. Contacte al Líder TIC para reactivarla.',
    })
    return true
  }

  return false
}

export function assertAccountActive(res: Response, user: IUsuario): boolean {
  if (!isAccountAllowed(user)) {
    rejectInactiveAccount(res, user)
    return false
  }
  return true
}
