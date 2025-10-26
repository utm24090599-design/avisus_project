export interface User {
  id: number;
  email: string;
  name: string;
  picture?: string;
  role: string;
  role_color: string;
  role_badge: string;
  created_at: string;
  last_login: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface GoogleCredentialResponse {
  credential: string;
}
