# Design: Inteligência de Lotes e Integridade Operacional

## Visão Geral da Arquitetura
O núcleo da camada de inteligência reside nos componentes de UI e nas Server Actions. Vamos mover cálculos complexos do nível de componente para um utilitário compartilhado ou para a Server Action para garantir consistência.

## Fluxo de Dados e Integridade
### Transações Atômicas
Quando um registro diário é salvo, o seguinte deve acontecer em uma única transação:
1.  **Criar DailyRecord**: Persistir os dados de produção/consumo.
2.  **Atualizar Lote**: Incrementar ou decrementar a `currentQuantity` com base na mortalidade.
3.  **Ajuste de Inventário**: Criar um `InventoryMovement` do tipo `OUT` para deduzir a ração (se a ração foi consumida e um item de inventário estiver vinculado).

### Lógica de Validação
- **Guarda de Mortalidade**: Antes de confirmar, verificar se `mortality <= flock.currentQuantity`.
- **Guarda de Data**: Garantir que os registros não se sobreponham (um registro por dia por galpão/lote) ou lidar com atualizações de forma graciosa.

## Componentes de UI e Layout
### 1. Sistema Bento Grid (Layout Analítico)
A página de detalhes do lote será estruturada em um **Bento Grid** (CSS Grid) com as seguintes áreas:
- **Área Hero (2x2)**: Gráfico de produção principal com sparklines integrados.
- **Blocos de KPIs (1x1)**: Pequenos blocos com Viabilidade, Taxa de Postura e FCR.
- **Blocos de Alerta (2x1)**: Espaço dedicado para sanidade e avisos de linhagem.
- **Bloco Técnico (1x2)**: Detalhes da linhagem e cronograma de vacinação.

### 2. Estilização Avançada (SASS & Tailwind)
- **Glassmorphism Mixins**: Utilizar mixins SASS para definir o efeito de vidro (blur + border-gradient) de forma consistente.
- **Variações de Estado**: Definir variáveis SASS para estados de "Crítico" (vermelho profundo), "Alerta" (âmbar vibrante) e "Saudável" (verde esmeralda).
- **Tipografia Técnica**: Uso de fontes monoespaçadas para valores numéricos e fontes sem-serifa bold para rótulos técnicos.

### 3. Micro-interações
- **Hover Effects**: Elevação sutil do card e brilho periférico ao interagir com métricas.
- **Loading Skeletons**: Skeletons personalizados que mantêm o formato do Bento Grid durante o carregamento de dados.

## Funções Utilitárias
```typescript
/**
 * Calcula a idade do lote em semanas e dias
 */
export function calculateAge(acquisitionDate: Date, ageAtArrival: number = 0) {
  const diffTime = Math.abs(new Date().getTime() - acquisitionDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + ageAtArrival;
  return {
    weeks: Math.floor(diffDays / 7),
    days: diffDays % 7
  };
}
```
