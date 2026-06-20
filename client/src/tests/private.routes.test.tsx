import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PrivateRoutes from '@/app/router/private.routes'

const mockUseAuth = vi.fn()

vi.mock('@/features/auth', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('PrivateRoutes', () => {
  it('muestra loader mientras loading=true (rutas protegidas)', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
      user: null,
    })

    render(
      <MemoryRouter initialEntries={['/adminSolicitud']}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/adminSolicitud" element={<div>Panel privado</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Cargando...')).toBeInTheDocument()
    expect(screen.queryByText('Panel privado')).not.toBeInTheDocument()
  })

  it('redirige a login cuando la sesión no está autenticada', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
    })

    render(
      <MemoryRouter initialEntries={['/adminSolicitud']}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/adminSolicitud" element={<div>Panel privado</div>} />
          </Route>
          <Route path="/loginMain" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('permite contenido privado cuando hay sesión autenticada', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { rol: 'lider', correo: 'l@test.com' },
    })

    render(
      <MemoryRouter initialEntries={['/adminSolicitud']}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/adminSolicitud" element={<div>Panel privado</div>} />
          </Route>
          <Route path="/loginMain" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Panel privado')).toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })
})
