
import { GoogleGenAI } from "@google/genai";
import { Project, Expense } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAiCostInsights(project: Project, expenses: Expense[]) {
  const actualCost = expenses.reduce((sum, e) => sum + e.amount, 0);
  const earnedValue = project.totalBudget * (project.percentComplete / 100);
  const cpi = actualCost > 0 ? earnedValue / actualCost : 1;
  const eac = cpi > 0 ? project.totalBudget / cpi : project.totalBudget;
  const variance = project.totalBudget - eac;

  const dataSummary = `
    PROJE KARNESİ:
    Adı: ${project.name}
    Tip: ${project.type}
    Tamamlanma Oranı: %${project.percentComplete}
    Bütçe: ${project.totalBudget} TL
    Fiili Harcama (AC): ${actualCost} TL
    Kazanılmış Değer (EV): ${earnedValue} TL
    Performans Endeksi (CPI): ${cpi.toFixed(2)}
    Tahmini Final Maliyeti (EAC): ${eac.toFixed(0)} TL
    Varyans: ${variance.toFixed(0)} TL
    Kategori Detayları: ${JSON.stringify(
      expenses.reduce((acc: any, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {})
    )}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bu verileri analiz et: ${dataSummary}`,
      config: {
        systemInstruction: `Sen 'MegaCost' uygulamasının baş maliyet kontrol (Cost Control) analistisin. 
        Kullanıcıya inşaat projesinin (GES veya Yol) finansal sağlığı hakkında profesyonel, 
        stratejik ve aksiyon odaklı bir rapor sun. 
        
        Raporun şunları içermeli:
        1. Mevcut CPI değerine göre bütçe risk analizi.
        2. Kategori bazlı (Malzeme, İşçilik vb.) anormal sapmaların tespiti.
        3. Projenin EAC (Tahmini Bitiş Maliyeti) bütçeyi aşıyorsa alınması gereken somut tasarruf tedbirleri.
        4. Gelecek dönem nakit akışı için stratejik tavsiye.
        
        Dili profesyonel, güven verici ama risk durumunda uyarıcı olsun. Türkçe yanıt ver. Markdown kullanma, düz metin veya liste yapısı kullan.`
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Maliyet analizi sırasında bir hata oluştu. Verileri kontrol edip tekrar deneyin.";
  }
}
