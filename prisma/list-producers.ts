
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const producers = await prisma.producer.findMany({
    select: { id: true, name: true }
  });
  console.log(JSON.stringify(producers, null, 2));
}

main()
  .catch(console.error)
  .finally(() => pool.end());
