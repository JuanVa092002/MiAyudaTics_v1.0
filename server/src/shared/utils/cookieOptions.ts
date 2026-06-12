import type { CookieOptions } from 'express'

export function getAuthCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 2 * 60 * 60 * 1000,
  }
}

export function getClearAuthCookieOptions(): CookieOptions {
  return {
    ...getAuthCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  }
}
