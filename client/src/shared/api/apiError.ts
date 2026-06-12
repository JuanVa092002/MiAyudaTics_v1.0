import { isAxiosError } from 'axios'

type UnauthorizedHandler = () => void

let unauthorizedHandler: UnauthorizedHandler | null = null

export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  unauthorizedHandler = handler
}

export function notifyUnauthorized(): void {
  unauthorizedHandler?.()
}

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Sin conexión con el servidor. Verifica tu red e intenta de nuevo.'
    }

    const data = error.response.data as
      | { message?: string; error?: string; errors?: Array<{ message?: string }> }
      | undefined

    if (data?.message) return data.message
    if (data?.error) return data.error
    if (Array.isArray(data?.errors) && data.errors[0]?.message) {
      return data.errors[0].message
    }
  }

  return 'Ocurrió un error inesperado. Intenta nuevamente.'
}
