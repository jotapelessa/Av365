# Design: SuperAdmin Design System

## 🗺️ Layout & UX
A página será organizada em um layout de fluxo vertical com seções temáticas, utilizando o ritmo de design `gap-16` para separar grandes blocos.

### 1. Seção de Identidade (Tokens)
- Visualização de cores em círculos de luxo com hex codes copiáveis.
- Amostras de tipografia em diferentes escalas (`7xl font-black italic` até `text-[10px] font-black uppercase`).

### 2. Seção de Componentes de Ação
- Grid de botões demonstrando a elevação de sombra e o efeito magnético.
- Demonstração do comportamento de "Confirmação em 2 Passos" para ações destrutivas.

### 3. Seção de Containers (Bento Cards)
- Demonstração de diferentes variantes de cards:
    - **KPI Card**: Valor grande + ícone lateral.
    - **Chart Container**: Padding `p-10` + Header estruturado.
    - **Interactive Card**: Feedback visual de hover intenso.

### 4. Seção de Dados (Tabelas)
- Exemplo de tabela operacional com estados de hover e tipografia condensada.

## 🔒 Segurança de Navegação
- **Sidebar.tsx**: O array de menus será limpo de qualquer referência a `/admin`. Isso evita que produtores vejam ou tentem acessar rotas de gestão global.
- **AdminSidebar.tsx**: Receberá o novo item `Design System` (`Settings2` icon), consolidando-o como uma ferramenta exclusiva de manutenção de marca.

## 🚀 Tecnologias & Performance
- **Framer Motion**: Uso de `AnimatePresence` e `staggerChildren` para uma experiência cinematográfica na entrada da página.
- **SASS**: Utilização de mixins para glassmorphism e sombras dinâmicas.
- **Next.js 15**: Otimização de renderização via Server Components para o esqueleto da página.
