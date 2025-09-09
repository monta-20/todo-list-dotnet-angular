export interface AuthRequest {
  email?: string;
  password?: string;
  name?: string;
  googleToken?: string;
}

export interface AuthResponse {
  email: string;
  name: string;
  role: string;
  token?: string;
}
