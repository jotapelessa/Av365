import { PrismaClient, TaskStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedTasks() {
  console.log('🚀 Semeando tarefas operacionais de elite...');

  const clerkUserId = "user_3D8vftklnuNjeuHEZ7Naca1Wsaw";
  
  // Achar o usuário e seu producerId
  const user = await prisma.user.findUnique({
    where: { id: clerkUserId },
    select: { producerId: true, name: true }
  });

  let targetProducerId = user?.producerId;

  if (!targetProducerId) {
    console.log('⚠️ Usuário Clerk não encontrado, tentando buscar por nome "jotape"...');
    const jotapeProducer = await prisma.producer.findFirst({
      where: { name: { contains: 'jotape', mode: 'insensitive' } }
    });
    
    if (!jotapeProducer) {
        console.error("❌ Nenhum produtor encontrado. Rode o seed de galpões primeiro.");
        return;
    }
    targetProducerId = jotapeProducer.id;
  }

  console.log(`✅ Usando ProducerID: ${targetProducerId}`);

  // Busca os galpões deste produtor
  const houses = await prisma.house.findMany({
    where: { producerId: targetProducerId }
  });

  if (!houses.length) {
    console.error('❌ Nenhum galpão encontrado para este produtor.');
    return;
  }

  const tasksData = [
    { title: 'Manutenção Exaustores', desc: 'Verificar correias e lubrificação dos exaustores do fundo.', status: 'PENDING' },
    { title: 'Verificação de Amônia', desc: 'Medir níveis de amônia nos 4 quadrantes do galpão.', status: 'IN_PROGRESS' },
    { title: 'Limpeza de Bebedouros', desc: 'Sanitização completa da linha de niples.', status: 'COMPLETED' },
    { title: 'Ajuste de Setpoints', desc: 'Revisar temperaturas de acionamento do painel.', status: 'PENDING' },
    { title: 'Coleta de Amostra', desc: 'Separar 12 ovos para análise laboratorial semanal.', status: 'PENDING' },
  ];

  for (const house of houses) {
    console.log(`🏠 Criando tarefas para o galpão: ${house.name}`);
    
    // Limpa tarefas antigas do galpão para não duplicar no teste
    await prisma.task.deleteMany({ where: { houseId: house.id } });

    // Cria 3 tarefas aleatórias para cada galpão
    const shuffled = tasksData.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    for (const t of shuffled) {
      await prisma.task.create({
        data: {
          title: t.title,
          description: t.desc,
          status: t.status as TaskStatus,
          dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
          houseId: house.id,
          producerId: targetProducerId,
        }
      });
    }
  }

  console.log('✅ Tarefas de elite semeadas com sucesso!');
}

seedTasks()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
