import { apiFetch } from '@/shared/api/client';
import type {
  LoginResponse,
  MessageResponse,
  RegisterFuncionarioResponse,
  RegisterInput,
  RegisterTecnicoResponse,
  User,
} from './types';

export async function loginRequest(correo: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { correo, password },
  });
}

export async function verifyTokenRequest(token: string): Promise<User> {
  return apiFetch<User>('/auth/verify-token', { token });
}

export async function logoutRequest(token: string): Promise<MessageResponse> {
  return apiFetch<MessageResponse>('/auth/logout', {
    method: 'POST',
    token,
  });
}

export async function forgotPasswordRequest(correo: string): Promise<MessageResponse> {
  return apiFetch<MessageResponse>('/recuperarPassword', {
    method: 'POST',
    body: { correo },
  });
}

export async function resetPasswordRequest(
  token: string,
  password: string,
  confirmPassword: string,
): Promise<MessageResponse> {
  return apiFetch<MessageResponse>(`/restablecerPassword/${token}`, {
    method: 'POST',
    body: { password, confirmPassword },
  });
}

export async function registerRequest(
  input: RegisterInput,
): Promise<RegisterFuncionarioResponse | RegisterTecnicoResponse> {
  const { fotoUri, ...fields } = input;

  if (fotoUri) {
    const formData = new FormData();
    formData.append('nombre', fields.nombre);
    formData.append('correo', fields.correo);
    formData.append('rol', fields.rol);
    formData.append('telefono', fields.telefono);
    formData.append('password', fields.password);
    formData.append('confirmPassword', fields.confirmPassword);
    formData.append('foto', {
      uri: fotoUri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    } as unknown as Blob);

    return apiFetch<RegisterFuncionarioResponse | RegisterTecnicoResponse>('/auth/register', {
      method: 'POST',
      formData,
    });
  }

  return apiFetch<RegisterFuncionarioResponse | RegisterTecnicoResponse>('/auth/register', {
    method: 'POST',
    body: fields,
  });
}
