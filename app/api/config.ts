import axios from "axios";

export const api = axios.create({
  baseURL: "https://rfegraoskgndulpspcqd.supabase.co/rest/v1",
  timeout: 10000,
  headers: {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
  },
});

export const authApi = axios.create({
  baseURL: "https://rfegraoskgndulpspcqd.supabase.co/auth/v1",
  timeout: 10000,
  headers: {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
});

export type Beverage = {
  id: string;
  organization_id: string;
  name: string;
  price: number;
  description: string | null;
  stock: number | null;
  is_available: boolean | null;
  created_at: string;
  updated_at: string;
  image_path: string | null;
};
export type Organization = {
  id: string;
  name: string;
  address: string | null;
  created_at: string;
  updated_at: string;
};

export type NewBeverage = Omit<Beverage, "id" | "created_at" | "updated_at">;
export type UpdateBeverage = Partial<NewBeverage> & { id: string };
