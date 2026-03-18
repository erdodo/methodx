"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-12">
      <div className="bg-brand-bg2 max-w-md w-full p-8 p-10 rounded-[var(--r-lg)] shadow-[var(--shadow-lg)] border border-brand-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-brand-text mb-2 tracking-tight">
            metod<em className="text-brand-blue not-italic">X</em>
          </h1>
          <p className="text-brand-text2 text-sm">Hesabınıza giriş yapın</p>
        </div>
        
        {error && (
          <div className="bg-brand-red-lt text-brand-red p-3 rounded-lg text-sm mb-6 border border-[#fca5a5]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-brand-text2 mb-1.5" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2.5 rounded-[var(--r)] border border-brand-border focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors text-sm"
              placeholder="ornek@fabrika.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-text2 mb-1.5" htmlFor="password">Şifre</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2.5 rounded-[var(--r)] border border-brand-border focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue hover:bg-brand-blue-dk disabled:opacity-50 text-white font-semibold py-2.5 rounded-[var(--r)] shadow-[0_2px_8px_rgba(37,99,235,0.22)] transition-all font-sans text-[0.85rem]"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-brand-text3">
          Hesabınız yok mu? <Link href="/register" className="text-brand-blue hover:underline font-semibold">Şimdi oluşturun</Link>
        </div>
      </div>
    </div>
  );
}
