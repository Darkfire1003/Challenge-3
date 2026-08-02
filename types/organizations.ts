import { Organization } from "@/app/api/config";

export type NewOrganization = Omit<
  Organization,
  "id" | "created_at" | "updated_at"
>;
export type UpdateOrganization = Partial<NewOrganization> & { id: string };
