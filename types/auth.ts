export type LoginCredentials = {
  username: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  userId: number;
};
