import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import MeasurementClient from "./MeasurementClient";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id, tenantId: session.user.tenantId },
    include: {
      lines: {
        include: { operations: true }
      }
    }
  });

  if (!project) redirect("/");

  const personnel = await prisma.personnel.findMany({
    where: { tenantId: session.user.tenantId }
  });

  // Fetch recent observations for this project/line
  const observations = await prisma.observation.findMany({
    where: {
      operation: {
        productionLine: { projectId: id }
      }
    },
    include: { operation: true, personnel: true },
    orderBy: { timestamp: "desc" },
    take: 100
  });

  return <MeasurementClient project={project} personnel={personnel} dbObservations={observations} />;
}
