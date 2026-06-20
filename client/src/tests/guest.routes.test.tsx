import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import GuestOnlyRoutes from '@/app/router/guest.routes'

const mockUseAuth = vi.fn()

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('GuestOnlyRoutes', () => {
  it('muestra la ruta guest mientras loading=true (no bloquea en verify-token)', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
      user: null,
    })

    render(
      <MemoryRouter initialEntries={['/loginMain']}>
        <Routes>
          <Route element={<GuestOnlyRoutes />}>
            <Route path="/loginMain" element={<div>Login público</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Login público')).toBeInTheDocument()
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
  })

  it('redirige al home del rol cuando la sesión ya está resuelta', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { rol: 'lider' },
    })

    render(
      <MemoryRouter initialEntries={['/loginMain']}>
        <Routes>
          <Route element={<GuestOnlyRoutes />}>
            <Route path="/loginMain" element={<div>Login público</div>} />
          </Route>
          <Route path="/adminSolicitud" element={<div>Panel líder</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Panel líder')).toBeInTheDocument()
  })

  it('no redirige mientras loading=true aunque isAuthenticated sea true', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: true,
      user: { rol: 'lider' },
    })

    render(
      <MemoryRouter initialEntries={['/loginMain']}>
        <Routes>
          <Route element={<GuestOnlyRoutes />}>
            <Route path="/loginMain" element={<div>Login público</div>} />
          </Route>
          <Route path="/adminSolicitud" element={<div>Panel líder</div>} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Login público')).toBeInTheDocument()
    expect(screen.queryByText('Panel líder')).not.toBeInTheDocument()
  })
})
