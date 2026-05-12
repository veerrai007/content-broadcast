import api from './api';
import { AuthResponse, User } from '@/types';

const authService = {

  async login(
    email:string, 
    password:string
  ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  async register(
    name:string, 
    email:string, 
    password:string, 
    role:string, 
    principalCode?:string
  ): Promise<AuthResponse>{
    const payload: Record<string, string> = { name, email, password, role };
    if (role === 'principal' && principalCode) {
      payload.principalCode = principalCode;
    }
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  async getMe(): Promise<{ user: User }> {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    document.cookie = 'token=; path=/; max-age=0';
  },

  saveSession(token:string, user:User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
  },

  getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  isLoggedIn():boolean {
    return !!localStorage.getItem('token');
  },

};

export default authService;