
export type ProjectType = 'GES' | 'YOL';

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  location: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PLANNING';
  totalBudget: number;
  capacity: number; // GES için MW, Yol için KM
  startDate: string;
  targetEndDate: string;
  percentComplete: number; // 0-100
  targetCO2Saved?: number; // Tons of CO2
}

export interface Expense {
  id: string;
  projectId: string;
  category: string;
  description: string;
  amount: number;
  quantity: number; // Metraj miktarı
  unit: string; // m2, m3, ton, MW vb.
  date: string;
  type: 'MATERIAL' | 'LABOR' | 'MACHINE' | 'OTHER';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  lastUpdated: string;
}

export interface LaborRecord {
  id: string;
  projectId: string;
  workerName: string;
  role: string;
  hours: number;
  overtime: number;
  date: string;
  dailyRate: number;
}

export interface RiskMetrics {
  actualCost: number;
  burnRate: number; // Günlük harcama hızı
  remainingDays: number;
  estimatedAtCompletion: number; // EAC
  budgetDeviation: number; // Formül: Budget - (Actual + (Burn * Remaining))
  cpi: number; // Cost Performance Index
  carbonSaved: number; // Mevcut ilerlemeye göre CO2 tasarrufu
}

export interface BudgetTemplateItem {
  id: string;
  category: string;
  itemName: string;
  plannedAmount: number;
  unit: string;
  unitPrice: number;
}
