"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) throw new Error("Unauthorized");
  return session;
}

export async function createProject(formData: FormData) {
  const session = await getSession();
  const name = formData.get("name") as string;
  if (!name) return;

  await prisma.project.create({
    data: {
      name,
      tenantId: session.user.tenantId,
      lines: {
        create: { name: "Ana Hat" } // Create a default line for simplicity
      }
    }
  });

  revalidatePath("/");
}

export async function createPersonnel(formData: FormData) {
  const session = await getSession();
  const name = formData.get("name") as string;
  const experienceLevel = formData.get("experienceLevel") as string;
  
  if (!name) return;

  await prisma.personnel.create({
    data: { name, experienceLevel, tenantId: session.user.tenantId }
  });

  revalidatePath("/");
}

export async function deleteProject(id: string) {
  const session = await getSession();
  await prisma.project.delete({ where: { id, tenantId: session.user.tenantId } });
  revalidatePath("/");
}

export async function createOperation(projectId: string, lineId: string, formData: FormData) {
  const session = await getSession();
  const name = formData.get("name") as string;
  if (!name) return { error: "Operasyon adı gerekli" };

  await prisma.operation.create({
    data: { name, productionLineId: lineId }
  });
  
  revalidatePath(`/project/${projectId}`);
  return { success: true };
}

export async function saveObservation(data: any) {
  const session = await getSession();
  await prisma.observation.create({
    data: {
      operationId: data.operationId,
      personnelId: data.personnelId,
      observedTime: data.observed,
      rating: data.rating,
      normalTime: data.normal,
    }
  });
  return { success: true };
}
