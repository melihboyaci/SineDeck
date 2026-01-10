export interface User {
  id: number;
  username: string;
  role: string;
}
export interface AuthResponse {
  access_token: string;
}