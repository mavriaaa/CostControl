
import { BudgetTemplateItem } from './types';

export const GES_BUDGET_TEMPLATE: BudgetTemplateItem[] = [
  { id: 'g1', category: 'Sivil İşler', itemName: 'Hafriyat ve Saha Düzenleme', plannedAmount: 500000, unit: 'm2', unitPrice: 50 },
  { id: 'g2', category: 'Mekanik', itemName: 'Konstrüksiyon Montajı', plannedAmount: 1200000, unit: 'MW', unitPrice: 80000 },
  { id: 'g3', category: 'Mekanik', itemName: 'Panel Montajı', plannedAmount: 2000000, unit: 'Adet', unitPrice: 15 },
  { id: 'g4', category: 'Elektrik', itemName: 'DC Kablolama ve Inverter', plannedAmount: 1500000, unit: 'MW', unitPrice: 100000 },
  { id: 'g5', category: 'Elektrik', itemName: 'AC Orta Gerilim İşleri', plannedAmount: 800000, unit: 'Lump Sum', unitPrice: 800000 },
];

export const YOL_BUDGET_TEMPLATE: BudgetTemplateItem[] = [
  { id: 'y1', category: 'Toprak İşleri', itemName: 'Kazı-Dolgu (Hafriyat)', plannedAmount: 2500000, unit: 'm3', unitPrice: 120 },
  { id: 'y2', category: 'Üst Yapı', itemName: 'Alt Temel Tabakası', plannedAmount: 1200000, unit: 'km', unitPrice: 300000 },
  { id: 'y3', category: 'Üst Yapı', itemName: 'Temel Tabakası', plannedAmount: 1800000, unit: 'km', unitPrice: 450000 },
  { id: 'y4', category: 'Asfalt', itemName: 'Bitümlü Sıcak Karışım', plannedAmount: 4000000, unit: 'ton', unitPrice: 2200 },
  { id: 'y5', category: 'Sanat Yapıları', itemName: 'Menfezler ve Drenaj', plannedAmount: 900000, unit: 'Adet', unitPrice: 45000 },
];
