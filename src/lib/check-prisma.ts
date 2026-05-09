import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { db } from './prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

async function check() {
  const connectionString = process.env.DATABASE_URL
  const pool = new pg.Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  console.log('--- DIAGNÓSTICO PRISMA ---')
  const keys = Object.keys(prisma).filter(k => !k.startsWith('$'))
  console.log('Modelos encontrados no Client:', keys)
  
  if (keys.includes('subscriptionPlan')) {
    console.log('✅ subscriptionPlan encontrado!')
  } else if (keys.includes('SubscriptionPlan')) {
    console.log('⚠️ subscriptionPlan está capitalizado como SubscriptionPlan!')
  } else {
    console.log('❌ subscriptionPlan NÃO encontrado na lista.')
  }
  
  await db.$disconnect()
}

check().catch(console.error)
