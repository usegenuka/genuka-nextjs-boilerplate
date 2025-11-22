import { Company } from "@/app/generated/prisma/client";

export type CompanyCreate = Omit<Company, "createdAt" | "updatedAt">;
