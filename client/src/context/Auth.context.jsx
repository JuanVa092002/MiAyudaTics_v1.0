import { createContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

import { verifyToken } from '../services/auth.services.js'

export const AuthContext = createContext()

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      setLoading(true)
      const cookies = Cookies.get()

      if (!cookies.token) {
        setIsAuthenticated(false)
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const response = await verifyToken(cookies.token)
        console.log(response)

        if (!response) {
          setIsAuthenticated(false)
          setUser(null)
          return
        }

        setIsAuthenticated(true)
        setUser(response)
      } catch (error) {
        console.log(error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkLogin()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
