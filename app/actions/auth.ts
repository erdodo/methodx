"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function register(formData: FormData) {
  const company = formData.get("company") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!company || !name || !email || !password) {
    return { error: "Lütfen tüm alanları doldurun." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Bu email adresi zaten kullanımda." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.tenant.create({
      data: {
        name: company,
        users: {
          create: {
            name,
            email,
            password: hashedPassword,
            role: "ADMIN"
          }
        }
      }
    });
    return { success: true };
  } catch (error) {
    return { error: "Kayıt sırasında bir hata oluştu." };
  }
}
