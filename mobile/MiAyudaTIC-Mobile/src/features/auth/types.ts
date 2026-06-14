export type UserRole = 'funcionario' | 'tecnico' | 'lider';

export interface StorageRef {
  _id: string;
  url?: string;
  filename?: string;
}

export interface User {
  _id: string;
  nombre: string;
  correo: string;
  rol: UserRole;
  telefono?: string;
  activo?: boolean;
  estado?: boolean;
  foto?: StorageRef | null;
}

export interface LoginResponse {
  message: string;
  dataUser: {
    token: string;
    user: User;
    expiresIn: number;
  };
}

export interface RegisterFuncionarioResponse {
  message: string;
  data: {
    token: string;
    user: User;
    expiresIn: number;
  };
}

export interface RegisterTecnicoResponse {
  message: string;
}

export interface MessageResponse {
  message: string;
}

export interface RegisterInput {
  nombre: string;
  correo: string;
  rol: 'funcionario' | 'tecnico';
  telefono: string;
  password: string;
  confirmPassword: string;
  fotoUri?: string | null;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export function isPendingTechnicianMessage(message: string): boolean {
  return message.toLowerCase().includes('aprobación') || message.toLowerCase().includes('aprobacion');
}

export function isInactiveAccountMessage(message: string): boolean {
  return message.toLowerCase().includes('inactiva');
}
