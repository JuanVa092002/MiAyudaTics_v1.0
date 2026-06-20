import type { User } from '@/shared/types'

export type WebBootstrapOutcome =
  | { kind: 'authenticated'; user: User }
  | { kind: 'guest' }

/** Resultado de verify-token al arrancar (contrato de AuthProvider). */
export async function resolveWebAuthBootstrap(
  verify: () => Promise<User>
): Promise<WebBootstrapOutcome> {
  try {
    const user = await verify()
    return { kind: 'authenticated', user }
  } catch {
    return { kind: 'guest' }
  }
}

export function applyWebBootstrapOutcome(outcome: WebBootstrapOutcome): {
  loading: false
  isAuthenticated: boolean
  user: User | null
} {
  if (outcome.kind === 'authenticated') {
    return {
      loading: false,
      isAuthenticated: true,
      user: outcome.user,
    }
  }

  return {
    loading: false,
    isAuthenticated: false,
    user: null,
  }
}
