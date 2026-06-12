import apiClient from '@/shared/api/axios'
import type {
  AuthResponse,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  User,
} from '@/shared/types'

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('auth/register', credentials)
  return response.data
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('auth/login', credentials)
  return response.data
}

export const verifyToken = async (): Promise<User> => {
  const response = await apiClient.get<User>('auth/verify-token')
  return response.data
}

export const logout = async (): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('auth/logout')
  return response.data
}

export const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(`restablecerPassword/${token}`, {
    password,
    confirmPassword,
  })
  return response.data
}
