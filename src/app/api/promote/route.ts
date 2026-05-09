import { db } from "@/lib/prisma";
import { createClerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function GET() {
  try {
    // 1. Pegar o último usuário (você)
    const user = await db.user.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!user) return NextResponse.json({ error: "Usuário não encontrado" });

    // 2. Promover no Banco
    await db.user.update({
      where: { id: user.id },
      data: { role: 'SUPER_ADMIN' }
    });

    // 3. Promover no Clerk
    await clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: 'super_admin'
      }
    });

    const response = NextResponse.json({ 
      success: true, 
      message: `Usuário ${user.email} promovido a SUPER_ADMIN!`,
      instructions: "Agora sua sessão foi atualizada. Tente acessar /admin novamente."
    });

    // 🐣 Cookie de Segurança para o Middleware (Edge Compatible)
    response.cookies.set('clerk-role', 'super_admin', {
      path: '/',
      httpOnly: false, // Permitir que o middleware leia, mas seguro
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
