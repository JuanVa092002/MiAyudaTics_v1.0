import { createContext } from 'react'
import type { AuthContextValue } from '@/shared/types'

export const AuthContext = createContext<AuthContextValue | null>(null)
