# Design: Módulo de Galpões de Elite

## 🏗️ Visão Arquitetural
O "Galpão" (House) é o container físico para o "Lote" (Flock) biológico. O design deve enfatizar a relação entre espaço (m²) e população.

## 🗄️ Melhorias no Banco de Dados (Prisma)

```prisma
model House {
  // ... campos existentes ...
  width           Decimal? @default(12.0) // Padrão 12m
  length          Decimal? @default(100.0) // Padrão 100m
  housingSystem   String   @default("CONVENTIONAL") // CONVENCIONAL, AUTOMATIZADO, DARK_HOUSE
  hasClimate      Boolean  @default(false)
  hasAutoFeeding  Boolean  @default(false)
  lastSanitized   DateTime?
  
  // Helper de área calculada no código: area = width * length
}
```

## 🎨 Componentes e Padrões de UI

### 1. HouseCardExpert (O Protagonista)
- **Especificações Elite**: `rounded-[18px]`, `p-10`, fundo glassmorphism.
- **Indicadores Dinâmicos**:
  - **Medidor de Densidade**: Uma pequena barra de progresso ou anel mostrando aves/m² atual vs. limite ideal (ex: 12 aves/m² para convencional).
  - **Badge de Capacidade**: "85% Ocupado" ou "Vazio Sanitário".
- **Feedback Visual**:
  - **Ativo**: Brilho índigo primário.
  - **Vazio Sanitário**: Tom esmeralda/verde (Seguro para alojar).
  - **Manutenção**: Tom âmbar/amarelo.

### 2. HouseStatsSummary
- Layout horizontal no topo da página.
- 3 KPIs principais:
  - **Taxa de Ocupação**: % da capacidade total utilizada.
  - **Área Total Produtiva**: Soma da área de todos os galpões.
  - **Galpões em Vazio**: Contagem de galpões prontos para uso.

### 3. HouseForm (Criação Elite)
- **Métricas Interativas**: Conforme o usuário insere largura e comprimento, mostra a área total (m²).
- **Botões de Preset**: Seleção rápida para tamanhos comuns de galpão (12x100, 12x120, 15x150).

## 🚀 Estratégia de Grid Responsivo
Seguindo o `PADRAO_UI_PROJETO.md`:
- `grid-cols-4` para Desktop (1440px+).
- `grid-cols-3` para Tablet/Desktop Pequeno.
- `grid-cols-1` para Mobile.

## 🔒 Segurança e Proteção de Dados
- Ações destrutivas (excluir um galpão com um lote ativo) serão bloqueadas.
- Confirmação em 2 passos para mudanças de status.
