export type BeverageSuggestion = {
  id: string;
  organization_id: string | null;
  name: string;
  description: string | null;
  status: "pending" | "approved" | "rejected" | null;
  suggested_by: string | null;
  created_at: string;
};
