
import { GoogleGenAI } from "@google/genai";
import { Project, Expense } from "../types";

export async function getAiCostInsights(project: Project, expenses: Expense[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const actualCost = expenses.reduce((sum, e) => sum + e.amount, 0);
  const earnedValue = project.totalBudget * (project.percentComplete / 100);
  const cpi = actualCost > 0 ? earnedValue / actualCost : 1;
  
  // Risk Calculations
  const start = new Date(project.startDate).getTime();
  const end = new Date(project.targetEndDate).getTime();
  const now = new Date().getTime();
  const daysPassed = Math.max(1, (now - start) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, (end - now) / (1000 * 60 * 60 * 24));
  const burnRate = actualCost / daysPassed;
  const eac = actualCost + (burnRate * remainingDays);
  const budgetDeviation = project.totalBudget - eac;

  const dataContext = `
    DURUM RAPORU - ${project.name}
    PROJE TİPİ: ${project.type}
    BÜTÇE: ${project.totalBudget.toLocaleString('tr-TR')} TL
    HARCANAN (AC): ${actualCost.toLocaleString('tr-TR')} TL
    GÜNLÜK HARCAMA HIZI (BURN RATE): ${burnRate.toLocaleString('tr-TR')} TL
    KALAN SÜRE: ${Math.round(remainingDays)} Gün
    TAHMİNİ BİTİŞ MALİYETİ (EAC): ${eac.toLocaleString('tr-TR')} TL
    BÜTÇE SAPMA ÖNGÖRÜSÜ: ${budgetDeviation.toLocaleString('tr-TR')} TL
    CPI (PERFORMANS): ${cpi.toFixed(2)}
    TAMAMLANMA: %${project.percentComplete}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Proje verilerini teknik bir maliyet kontrol şefi gözüyle analiz et: ${dataContext}`,
      config: {
        systemInstruction: `Sen 'MegaControl AI' sisteminin baş finansal denetçisisin. 
        Müşteriye Earned Value Management (EVM) prensiplerine uygun, üst düzey bir risk analiz raporu sun.
        
        RAPOR FORMATIN ŞU ŞEKİLDE OLMALI:
        1. **Finansal Sağlık Skoru:** Mevcut Burn Rate ve CPI değerlerine göre projenin bütçe içinde kalma olasılığını değerlendir.
        2. **Kritik Risk Tespiti:** Eğer EAC bütçeyi aşıyorsa, projenin hangi aşamasında (Malzeme, İşçilik vb.) maliyet kontrolden çıkmış olabilir?
        3. **ESG ve Karbon Stratejisi:** Projenin yeşil enerji/ESG hedeflerine katkısını vurgula (Özellikle GES projelerinde).
        4. **Stratejik Aksiyon Planı:** Kalan sürede bütçeyi optimize etmek için 3 adet 'Senior' seviye tavsiye ver (Örn: Lojistik optimizasyonu, Fiyat farkı yönetimi, Taşeron revizyonu).
        
        Dilin: Çok profesyonel, veri odaklı, otoriter ve çözümleyici olmalı. Türkçe yanıt ver. Markdown kullanma.`
      }
    });

    return response.text;
  } catch (error) {
    console.error("MegaControl AI Error:", error);
    return "Analiz motoru şu an meşgul. Lütfen manuel veriler üzerinden risk değerlendirmesi yapınız.";
  }
}
