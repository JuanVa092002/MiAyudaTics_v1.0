import axios from './axios.js'

//servicio para consumir el register

export const register = async credentials => {
  try {
    const response = await axios.post('auth/register', credentials)
    return response.data
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    throw error
  }
}

export const login = async credentials => {
  try {
    const response = await axios.post('auth/login', credentials)
    return response.data
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    throw error
  }
}

export const verifyToken = async () => {
  try {
    const response = await axios.get('auth/verify-token')
    return response.data
  } catch (error) {
    console.error('Error al verificar token:', error)
    throw error
  }
}

export const logout = async () => {
  try {
    const response = await axios.post('auth/logout')
    return response.data
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    throw error
  }
}

export const resetPassword = async (token, password, confirmPassword) => {
  try {
    const response = await axios.post(`restablecerPassword/${token}`, {
      password,
      confirmPassword,
    })
    return response.data
  } catch (error) {
    console.error('Error al restablecer contraseña:', error)
    throw error
  }
}


