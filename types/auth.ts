export type LoginInfo = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
  };
};

export type RegisterInfo = {
  email: string;
  password: string;
  name: string;
  organization_id: string;
};
