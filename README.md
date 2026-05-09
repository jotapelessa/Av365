# AV365 (AgroVantagem 365) 🐓🌾

**AV365** é uma plataforma SaaS (Software as a Service) de ponta projetada para revolucionar a gestão de produtores de aves (avicultura de postura e corte). Com uma interface *Premium* (Elite Layout Orchestrator) e recursos de inteligência de dados, a plataforma oferece um controle "Bio-Operacional" em tempo real para maximizar a produtividade e a biosseguridade das granjas.

## 🚀 Principais Recursos

### 1. Cockpit Bio-Operacional (Dashboard Principal)
* **Monitoramento em Tempo Real:** KPIs vitais como Ovos Coletados, Taxa de Postura, Plantel Ativo e Receita Mensal.
* **Alertas Bio-Técnicos:** Sistema inteligente que cruza dados de mortalidade e produção para alertar o produtor sobre anomalias no plantel.
* **Gráficos Avançados:** "Produção vs Metas" com indicadores visuais de performance.

### 2. Gestão de Saúde e Biosseguridade (Health Hub)
* **Monitoramento por Lote:** Acompanhamento individual do vigor médio, histórico de vacinas e curva de mortalidade de cada lote.
* **Alertas Ativos:** Painel lateral dinâmico alertando sobre necessidades imediatas de intervenção sanitária.

### 3. Orquestrador de Layout Elite
* **Customização Administrativa:** O sistema possui um `AdminInspector` embutido que permite aos gestores redimensionarem e reordenarem os cards e módulos do sistema ao vivo.
* **Grid Inteligente:** Baseado em 12 colunas, o grid CSS responde perfeitamente a diferentes dispositivos (Desktop, Tablet, Smartphone) sem quebrar componentes complexos (resolvido "Grid Blowout").

### 4. Infraestrutura e Financeiro
* **Gestão de Galpões (Houses):** Capacidade, taxa de ocupação e status de manutenção.
* **Hub Financeiro:** Análise rápida de lucratividade com mini-gráficos (sparklines) apontando tendências financeiras.

## 🛠️ Tecnologias Utilizadas
* **Framework:** Next.js (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS (com foco em design Glassmorphism e Bento Box)
* **Banco de Dados:** PostgreSQL (gerenciado via Prisma ORM)
* **Gráficos:** Recharts
* **Animações:** Framer Motion
* **Ícones:** Lucide React
* **Autenticação:** Clerk

## 📦 Estrutura do Projeto
* `src/app/`: Rotas principais da aplicação (Dashboard, Health, Finance, etc).
* `src/components/`: Componentes reutilizáveis focados no "Elite Design System".
* `src/lib/`: Configurações de banco de dados (Prisma) e utilitários.
* `src/styles/`: Configurações globais de estilo e variáveis CSS.

## 🔒 Segurança (Git e Dados Sensíveis)
O arquivo `.gitignore` deste repositório está devidamente configurado para ignorar qualquer arquivo `.env`, garantindo que chaves de API, senhas de banco de dados e credenciais do Clerk/Vercel permaneçam privadas e seguras localmente.

## 🔧 Como Rodar Localmente

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o banco de dados e a autenticação no arquivo `.env` (solicite o modelo `.env.example` se necessário).
4. Rode as migrações do Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Inicie o servidor:
   ```bash
   npm run dev
   ```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.
