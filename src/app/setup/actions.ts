'use server';

import { db } from "@/lib/prisma";
import { auth, currentUser, createClerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Role, HousingSystem, FlockPurpose } from "@prisma/client";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function completeSetup(data: {
  farmName: string;
  capacity: number;
  purpose: string;
  housingSystem: string;
  planId: string;
}) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Usuário não autenticado.");
  }

  // Validação de Elite
  const capacityInt = parseInt(data.capacity.toString());
  if (isNaN(capacityInt) || capacityInt <= 0) {
    throw new Error("A capacidade informada é inválida. Por favor, insira um número positivo.");
  }

  if (!data.farmName || data.farmName.trim().length < 3) {
    throw new Error("O nome da granja deve ter pelo menos 3 caracteres.");
  }

  try {
    console.log(`[SETUP] Iniciando configuração de elite para: ${userId} | Capacidade: ${capacityInt}`);

    // 1. Criar o Produtor (Tenant Principal)
    const producer = await db.producer.create({
      data: {
        name: data.farmName,
        plan: data.planId.toUpperCase(),
        status: "ACTIVE",
        settings: {
          create: {
            config: { 
              theme: 'light', 
              notifications: true,
              currency: 'BRL',
              language: 'pt-BR'
            }
          }
        },
        // Criar o primeiro galpão automaticamente baseado nos dados técnicos
        houses: {
          create: {
            name: "Galpão Principal",
            capacity: capacityInt,
            housingSystem: data.housingSystem as HousingSystem,
          }
        }
      }
    });

    // 2. Sincronização Atômica do Usuário no DB
    await db.user.upsert({
      where: { id: userId },
      update: {
        producerId: producer.id,
        role: Role.PRODUCER,
      },
      create: {
        id: userId,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName ? `${user.firstName} ${user.lastName || ''}` : data.farmName,
        producerId: producer.id,
        role: Role.PRODUCER,
      }
    });

    // 3. Atualizar Metadados no Clerk (Fonte da Verdade para Autenticação)
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        producerId: producer.id,
        role: Role.PRODUCER,
        setupCompleted: true
      }
    });

    // 4. Limpeza e Redirecionamento
    revalidatePath('/', 'layout');
    
    return { success: true, producerId: producer.id };

  } catch (error: any) {
    console.error("ERRO CRÍTICO NO SETUP:", error);
    throw new Error(`Falha na configuração do ecossistema: ${error.message}`);
  }
}
