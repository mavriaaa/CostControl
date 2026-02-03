
export type ProjectType = 'GES' | 'YOL';

export interface BudgetTemplateItem {
  id: string;
  category: string;
  itemName: string;
  plannedAmount: number;
  unit: string;
  unitPrice: number;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  location: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PLANNING';
  totalBudget: number;
  startDate: string;
  capacity?: string; // e.g., "15" (as number for calculation)
  unitLabel?: string; // "MW" or "KM"
  percentComplete: number; // 0-100
}

export interface Expense {
  id: string;
  projectId: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  type: 'MATERIAL' | 'LABOR' | 'MACHINE' | 'OTHER';
}

export interface FinancialMetrics {
  actualCost: number;
  plannedValue: number;
  earnedValue: number;
  cpi: number; // Cost Performance Index
  eac: number; // Estimate At Completion
  variance: number;
  unitCost: number;
}
