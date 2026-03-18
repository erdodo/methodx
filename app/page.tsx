import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { createProject, createPersonnel, deleteProject } from "@/app/actions/data";
import { LogOut, Folder, Users, ExternalLink, Trash2 } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { lines: true } } }
  });

  const personnel = await prisma.personnel.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-brand-bg pb-12">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-border px-6 py-3 flex items-center justify-between">
        <div className="text-xl font-extrabold text-brand-text tracking-tight">
          metod<em className="text-brand-blue not-italic">X</em>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-brand-text2">{session.user.name}</div>
          <Link href="/api/auth/signout" className="text-brand-text3 hover:text-brand-red transition-colors">
            <LogOut size={18} />
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Projects Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-text flex items-center gap-2">
              <Folder className="text-brand-blue" size={20} /> Projeler
            </h2>
          </div>

          <div className="bg-brand-bg2 border border-brand-border rounded-[var(--r-lg)] p-5 shadow-sm">
            <form action={createProject} className="flex gap-3 mb-6">
              <input 
                name="name" 
                placeholder="Yeni Proje Adı..." 
                required 
                className="flex-1 px-3 py-2 border border-brand-border rounded-[var(--r)] text-sm focus:outline-none focus:border-brand-blue"
              />
              <button type="submit" className="bg-brand-blue text-white px-4 py-2 rounded-[var(--r)] text-sm font-semibold hover:bg-brand-blue-dk transition-colors">
                Oluştur
              </button>
            </form>

            <div className="space-y-3">
              {projects.length === 0 ? (
                <div className="text-sm text-brand-text3 text-center py-6">Henüz proje oluşturulmadı.</div>
              ) : projects.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-[var(--r)] border border-brand-border hover:border-brand-blue transition-colors group">
                  <div className="flex-1">
                    <div className="font-semibold text-brand-text text-sm">{p.name}</div>
                    <div className="text-xs text-brand-text3 mt-0.5">{new Date(p.createdAt).toLocaleDateString("tr-TR")}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={async () => { "use server"; await deleteProject(p.id); }}>
                      <button type="submit" className="text-brand-text3 hover:text-brand-red p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                    </form>
                    <Link href={`/project/${p.id}`} className="flex items-center gap-1.5 bg-brand-blue-lt text-brand-blue border border-brand-blue-md px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-blue-md transition-colors">
                      Ölçüme Git <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personnel Column */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-brand-text flex items-center gap-2">
            <Users className="text-brand-green" size={20} /> Personel Listesi
          </h2>

          <div className="bg-brand-bg2 border border-brand-border rounded-[var(--r-lg)] p-5 shadow-sm">
            <form action={createPersonnel} className="space-y-3 mb-6">
              <input 
                name="name" 
                placeholder="Ad Soyad..." 
                required 
                className="w-full px-3 py-2 border border-brand-border rounded-[var(--r)] text-sm focus:outline-none focus:border-brand-blue"
              />
              <select name="experienceLevel" className="w-full px-3 py-2 border border-brand-border rounded-[var(--r)] text-sm focus:outline-none focus:border-brand-blue">
                <option value="Acemi">Acemi</option>
                <option value="Orta">Orta Düzey</option>
                <option value="Uzman">Uzman</option>
              </select>
              <button type="submit" className="w-full bg-brand-green text-white px-4 py-2 rounded-[var(--r)] text-sm font-semibold hover:bg-[#15803d] transition-colors">
                Personel Ekle
              </button>
            </form>

            <div className="space-y-2">
              {personnel.length === 0 ? (
                <div className="text-sm text-brand-text3 text-center py-4">Kayıtlı personel yok.</div>
              ) : personnel.map(p => (
                <div key={p.id} className="p-2.5 rounded-lg border border-brand-border text-sm flex justify-between items-center">
                  <span className="font-semibold text-brand-text">{p.name}</span>
                  <span className="text-xs px-2 py-0.5 bg-brand-bg3 rounded text-brand-text2">{p.experienceLevel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
