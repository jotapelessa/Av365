/**
 * EggTrack Elite - Poultry Intelligence Utilities
 */

/**
 * Calculates flock age in weeks and days
 */
export function calculateFlockAge(acquisitionDate: Date, ageAtArrivalDays: number = 0) {
  const diffTime = Math.abs(new Date().getTime() - new Date(acquisitionDate).getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + ageAtArrivalDays;
  
  return {
    totalDays: diffDays,
    weeks: Math.floor(diffDays / 7),
    days: diffDays % 7,
    formatted: `${Math.floor(diffDays / 7)} sem, ${diffDays % 7} dias`
  };
}

/**
 * Calculates Viability (%)
 */
export function calculateViability(initialQuantity: number, currentQuantity: number) {
  if (initialQuantity <= 0) return 0;
  return parseFloat(((currentQuantity / initialQuantity) * 100).toFixed(1));
}

/**
 * Calculates Daily Intake (g/bird/day)
 */
export function calculateDailyIntake(feedConsumedKg: number, birdQuantity: number) {
  if (birdQuantity <= 0) return 0;
  return parseFloat(((feedConsumedKg * 1000) / birdQuantity).toFixed(1));
}

/**
 * Calculates Feed Conversion Ratio (FCR / CA) per egg
 * Standard: Total Feed (g) / Total Eggs produced
 */
export function calculateFCR(feedConsumedKg: number, eggsProduced: number) {
  if (eggsProduced <= 0) return 0;
  return parseFloat(((feedConsumedKg * 1000) / eggsProduced).toFixed(2));
}

/**
 * Calculates Production Rate (%)
 */
export function calculateProductionRate(eggsProduced: number, birdQuantity: number) {
  if (birdQuantity <= 0) return 0;
  return parseFloat(((eggsProduced / birdQuantity) * 100).toFixed(1));
}

/**
 * Calculates variation between two values (Trend)
 */
export function calculateTrend(current: number, previous: number) {
  if (previous === 0) return 0;
  return parseFloat((((current - previous) / previous) * 100).toFixed(1));
}

/**
 * Compares current production against lineage standard
 */
export function getLineageDeviation(currentRate: number, standardRate: number) {
  return parseFloat((currentRate - standardRate).toFixed(1));
}
/**
 * Gets the expected production rate for a specific age based on lineage standard
 */
export function getStandardRateForAge(standardsJson: any, ageInDays: number) {
  if (!standardsJson) return 0;
  try {
    const standards = typeof standardsJson === 'string' ? JSON.parse(standardsJson) : standardsJson;
    if (!Array.isArray(standards)) return 0;

    const currentWeek = Math.floor(ageInDays / 7);
    
    // Find the closest standard week (preferring the one that is <= currentWeek)
    const sorted = [...standards].sort((a, b) => b.week - a.week);
    const match = sorted.find(s => s.week <= currentWeek) || sorted[sorted.length - 1];

    return match ? match.rate : 0;
  } catch (e) {
    return 0;
  }
}
/**
 * Detects production alerts (drops or significant deviations)
 */
export function detectProductionAlerts(records: any[], birdQuantity: number, lineageStandard?: any) {
  if (records.length < 2) return null;

  const current = records[0];
  const previous = records[1];

  const currentRate = calculateProductionRate(current.eggsTotal, birdQuantity);
  const previousRate = calculateProductionRate(previous.eggsTotal, birdQuantity);
  const dailyDrop = previousRate - currentRate;

  // 1. Sudden Drop Alert (> 3% in 24h)
  if (dailyDrop >= 3) {
    return {
      type: 'DANGER',
      title: 'Queda Crítica Detectada',
      message: `A postura caiu ${dailyDrop.toFixed(1)}% nas últimas 24h. Verifique ambiência e nutrição.`,
      icon: 'Skull'
    };
  }

  // 2. Lineage Deviation Alert
  if (lineageStandard) {
    const ageInDays = calculateFlockAge(current.date, 0).totalDays; // simplified for detection
    const standardRate = getStandardRateForAge(lineageStandard.standardsJson, ageInDays);
    const deviation = getLineageDeviation(currentRate, standardRate);

    if (deviation <= -5) {
      return {
        type: 'WARNING',
        title: 'Performance Sub-Ótima',
        message: `O lote está ${Math.abs(deviation)}% abaixo do potencial genético da linhagem.`,
        icon: 'Target'
      };
    }
  }

  return null;
}
