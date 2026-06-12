const isProd = process.env.NODE_ENV === 'production'

function formatLog(
  level: 'info' | 'warn' | 'error',
  message: string,
  meta?: Record<string, unknown>
): string | Record<string, unknown> {
  const entry = {
    level,
    message,
    ...meta,
    ts: new Date().toISOString(),
  }
  return isProd ? JSON.stringify(entry) : entry
}

export function logInfo(message: string, meta?: Record<string, unknown>): void {
  const output = formatLog('info', message, meta)
  if (typeof output === 'string') {
    console.log(output)
  } else {
    console.log(output)
  }
}

export function logWarn(message: string, meta?: Record<string, unknown>): void {
  const output = formatLog('warn', message, meta)
  if (typeof output === 'string') {
    console.warn(output)
  } else {
    console.warn(output)
  }
}

export function logError(
  message: string,
  error?: unknown,
  meta?: Record<string, unknown>
): void {
  const errorMeta =
    error instanceof Error
      ? { error: error.message, stack: error.stack }
      : error !== undefined
        ? { error: String(error) }
        : {}

  const output = formatLog('error', message, { ...errorMeta, ...meta })
  if (typeof output === 'string') {
    console.error(output)
  } else {
    console.error(output)
  }
}
