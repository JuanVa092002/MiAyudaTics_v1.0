import { ApiError } from '@/shared/api/client';
import { clearToken, getToken, setToken } from '@/shared/storage/token';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  forgotPasswordRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  resetPasswordRequest,
  verifyTokenRequest,
} from './api';
import type {
  AuthStatus,
  RegisterFuncionarioResponse,
  RegisterInput,
  RegisterTecnicoResponse,
  User,
} from './types';
import { isInactiveAccountMessage, isPendingTechnicianMessage } from './types';

export type LoginResult =
  | { ok: true; user: User }
  | { ok: false; kind: 'invalid_credentials' | 'pending_approval' | 'inactive' | 'lider' | 'network'; message: string };

export type RegisterResult =
  | { ok: true; kind: 'funcionario_autologin'; user: User }
  | { ok: true; kind: 'tecnico_pending'; message: string }
  | { ok: false; message: string };

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  bootstrap: () => Promise<void>;
  login: (correo: string, password: string) => Promise<LoginResult>;
  register: (input: RegisterInput) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  forgotPassword: (correo: string) => Promise<string>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isFuncionarioRegisterResponse(
  response: RegisterFuncionarioResponse | RegisterTecnicoResponse,
): response is RegisterFuncionarioResponse {
  return 'data' in response && Boolean(response.data?.token);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  const applySession = useCallback(async (nextToken: string, nextUser: User) => {
    await setToken(nextToken);
    setTokenState(nextToken);
    setUser(nextUser);
    setStatus('authenticated');
  }, []);

  const clearSession = useCallback(async () => {
    await clearToken();
    setTokenState(null);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const bootstrap = useCallback(async () => {
    setStatus('loading');
    const storedToken = await getToken();
    if (!storedToken) {
      setStatus('unauthenticated');
      return;
    }

    try {
      const verifiedUser = await verifyTokenRequest(storedToken);
      setTokenState(storedToken);
      setUser(verifiedUser);
      setStatus('authenticated');
    } catch (error) {
      await clearSession();
      if (error instanceof ApiError && error.status === 403) {
        // token presente pero cuenta no permitida
        return;
      }
    }
  }, [clearSession]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(
    async (correo: string, password: string): Promise<LoginResult> => {
      try {
        const response = await loginRequest(correo, password);
        const { token: nextToken, user: nextUser } = response.dataUser;

        if (nextUser.rol === 'lider') {
          return {
            ok: false,
            kind: 'lider',
            message: 'El rol Líder TIC debe usar la versión web. Esta app es para funcionarios y técnicos.',
          };
        }

        await applySession(nextToken, nextUser);
        return { ok: true, user: nextUser };
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.status === 401) {
            return { ok: false, kind: 'invalid_credentials', message: error.message };
          }
          if (error.status === 403) {
            if (isPendingTechnicianMessage(error.message)) {
              return { ok: false, kind: 'pending_approval', message: error.message };
            }
            if (isInactiveAccountMessage(error.message)) {
              return { ok: false, kind: 'inactive', message: error.message };
            }
          }
          return { ok: false, kind: 'network', message: error.message };
        }
        return {
          ok: false,
          kind: 'network',
          message: 'No se pudo iniciar sesión. Intenta de nuevo.',
        };
      }
    },
    [applySession],
  );

  const register = useCallback(
    async (input: RegisterInput): Promise<RegisterResult> => {
      try {
        const response = await registerRequest(input);

        if (isFuncionarioRegisterResponse(response)) {
          await applySession(response.data.token, response.data.user);
          return { ok: true, kind: 'funcionario_autologin', user: response.data.user };
        }

        return { ok: true, kind: 'tecnico_pending', message: response.message };
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : 'No se pudo completar el registro.';
        return { ok: false, message };
      }
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    if (token) {
      try {
        await logoutRequest(token);
      } catch {
        // limpiar sesión local aunque falle el servidor
      }
    }
    await clearSession();
  }, [clearSession, token]);

  const forgotPassword = useCallback(async (correo: string) => {
    const response = await forgotPasswordRequest(correo);
    return response.message;
  }, []);

  const resetPassword = useCallback(async (resetToken: string, password: string, confirmPassword: string) => {
    const response = await resetPasswordRequest(resetToken, password, confirmPassword);
    return response.message;
  }, []);

  const value = useMemo(
    () => ({
      status,
      user,
      token,
      bootstrap,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
    }),
    [status, user, token, bootstrap, login, register, logout, forgotPassword, resetPassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
