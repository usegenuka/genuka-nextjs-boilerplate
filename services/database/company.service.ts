import prisma from "@/lib/prisma";
import type { CompanyCreate } from "@/types/company";

export class CompanyDBService {

  async findByAccessToken(accessToken: string) {
    return prisma.company.findFirst({
      where: { accessToken },
    });
  }


  async upsertCompany(data: CompanyCreate) {
    return prisma.company.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }

  async findByCompanyId(id: string) {
    return prisma.company.findUnique({
      where: { id },
    });
  }

  async findByHandle(handle: string) {
    return prisma.company.findUnique({
      where: { handle },
    });
  }

  async updateById(id: string, data: Partial<CompanyCreate>) {
    return prisma.company.update({
      where: { id },
      data,
    });
  }
}
