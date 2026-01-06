export interface User {
  id: number;
  username: string;
  role: string;
  //Backend'den gelecek diğer kullanıcı bilgileri buraya eklenebilir
}

export interface AuthResponse {
  access_token: string;
}
