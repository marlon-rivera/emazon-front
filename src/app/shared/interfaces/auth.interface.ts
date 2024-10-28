export interface LoginRequest {
  email: string;
  password: string;
}
export interface Auth {
  token: string;
}
export interface InfoToken {
  role: string;
  name: string;
  email: string;
  sub: string;
  iat: number;
  exp: number;
}
