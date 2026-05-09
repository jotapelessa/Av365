import { addDays } from 'date-fns';

export interface VaccineScheduleItem {
  id: string;
  name: string;
  day: number;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export const STANDARD_VACCINATION_SCHEDULE: VaccineScheduleItem[] = [
  { id: 'v1', name: 'Marek e Bouba', day: 1, description: 'Vacinação via subcutânea ou in ovo no incubatório.', priority: 'CRITICAL' },
  { id: 'v2', name: 'Newcastle e Bronquite', day: 7, description: 'Vacinação via colírio ou spray.', priority: 'HIGH' },
  { id: 'v3', name: 'Gumboro (1ª dose)', day: 14, description: 'Vacinação via água de beber.', priority: 'HIGH' },
  { id: 'v4', name: 'Newcastle e Bronquite (Reforço)', day: 21, description: 'Vacinação via água de beber.', priority: 'MEDIUM' },
  { id: 'v5', name: 'Gumboro (2ª dose)', day: 28, description: 'Vacinação via água de beber.', priority: 'MEDIUM' },
  { id: 'v6', name: 'Bouba Aviária (Reforço)', day: 35, description: 'Vacinação via membrana da asa (wing web).', priority: 'HIGH' },
];

export function calculateFlockAge(arrivalDate: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - new Date(arrivalDate).getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getUpcomingVaccines(arrivalDate: Date) {
  const age = calculateFlockAge(arrivalDate);
  return STANDARD_VACCINATION_SCHEDULE
    .filter(v => v.day >= age)
    .sort((a, b) => a.day - b.day);
}
