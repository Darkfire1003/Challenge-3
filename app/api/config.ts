import axios from "axios";

export const api = axios.create({
  baseURL: "https://rfegraoskgndulpspcqd.supabase.co/rest/v1",
  timeout: 10000,
  headers: {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  },
});

export type Beverage = {
  id: number;
  organization_id: number;
  name: string;
  price: number;
  description: string | null;
  stock: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  image_path: string | null;
};

export type NewBeverage = Omit<Beverage, "id" | "created_at" | "updated_at">;
export type UpdateBeverage = Partial<NewBeverage> & { id: number };
