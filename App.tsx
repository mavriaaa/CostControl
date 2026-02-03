
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import { 
  Project, 
  Expense, 
  ProjectType,
  FinancialMetrics
} from './types';
import { 
  TrendingUp, 
  Activity, 
  AlertCircle, 
  Plus,
  Briefcase,
  Calendar,
  Zap,
  Route,
  FileText,
  BrainCircuit,
  HardHat,
  Download,
  Filter,
  DollarSign,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getAiCostInsights } from './services/geminiService';

const INITIAL_PROJECTS: Project[] = [
  { id: '1', name: 'Manisa GES Projesi', type: 'GES', location: 'Manisa, TR', status: 'ACTIVE', totalBudget: 15000000, capacity: '20', unitLabel: 'MW', startDate: '2023-01-15', percentComplete: 45 },
  { id: '2', name: 'Ankara-Niğde Otoyolu', type: 'YOL', location: 'Ankara, TR', status: 'ACTIVE', totalBudget: 45000000, capacity: '12', unitLabel: 'KM', startDate: '2023-03-10', percentComplete: 30 },
];

const COLORS = ['#fbbf24', '#3b82f6', '#10b981', '#ef4444'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [selectedProjectForEntry, setSelectedProjectForEntry] = useState(projects[0].id);

  // Form State
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'Malzeme',
    description: '',
    type: 'MATERIAL' as any
  });

  // Init and Persistence
  useEffect(() => {
    const savedProjects = localStorage.getItem('mega_projects');
    const savedExpenses = localStorage.getItem('mega_expenses');
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  const save = (p: Project[], e: Expense[]) => {
    localStorage.setItem('mega_projects', JSON.stringify(p));
    localStorage.setItem('mega_expenses', JSON.stringify(e));
  };

  // Financial Logic (EAC / Burn Rate)
  const getProjectMetrics = (project: Project): FinancialMetrics => {
    const projExpenses = expenses.filter(e => e.projectId === project.id);
    const actualCost = projExpenses.reduce((sum, e) => sum + e.amount, 0);
    const earnedValue = project.totalBudget * (project.percentComplete / 100);
    const cpi = actualCost > 0 ? earnedValue / actualCost : 1;
    const eac = cpi > 0 ? project.totalBudget / cpi : project.totalBudget;
    const capacityNum = parseFloat(project.capacity || '1');
    const unitCost = actualCost / (capacityNum * (project.percentComplete / 100 || 1));

    return {
      actualCost,
      plannedValue: project.totalBudget,
      earnedValue,
      cpi,
      eac,
      variance: project.totalBudget - eac,
      unitCost
    };
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.description) return;

    const expense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      projectId: selectedProjectForEntry,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description,
      date: new Date().toISOString().split('T')[0],
      type: newExpense.type
    };

    const updatedExpenses = [expense, ...expenses];
    setExpenses(updatedExpenses);
    setNewExpense({ amount: '', category: 'Malzeme', description: '', type: 'MATERIAL' });
    save(projects, updatedExpenses);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Proje', 'Kategori', 'Açıklama', 'Tutar', 'Tarih', 'Tip'];
    const rows = expenses.map(e => [
      e.id,
      projects.find(p => p.id === e.projectId)?.name || 'N/A',
      e.category,
      e.description,
      e.amount,
      e.date,
      e.type
    ]);

    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `MegaCost_Rapor_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleAiAnalysis = async (project: Project) => {
    setLoadingAi(true);
    setActiveTab('reports');
    const projectExpenses = expenses.filter(e => e.projectId === project.id);
    const insight = await getAiCostInsights(project, projectExpenses);
    setAiAnalysis(insight || "Yanıt alınamadı.");
    setLoadingAi(false);
  };

  const dashboardData = useMemo(() => {
    return projects.map(p => {
      const m = getProjectMetrics(p);
      return {
        name: p.name,
        Bütçe: p.totalBudget / 1000,
        Harcama: m.actualCost / 1000,
        Tahmin: m.eac / 1000
      };
    });
  }, [projects, expenses]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">MegaCost <span className="text-amber-500 text-lg">v2.0</span></h1>
            <p className="text-slate-500 font-medium italic">Smarter Construction Cost Control</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold shadow-sm transition-all">
              <Download size={18} /> Excel'e Aktar
            </button>
            <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">SY</div>
          </div>
        </header>

        {/* Dynamic Tabs Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Toplam Portföy" 
                value={`${(projects.reduce((s, p) => s + p.totalBudget, 0) / 1000000).toFixed(1)}M TL`} 
                icon={<Briefcase size={22} />} 
                color="blue" 
              />
              <StatCard 
                title="Fiili Harcama" 
                value={`${(expenses.reduce((s, e) => s + e.amount, 0) / 1000000).toFixed(1)}M TL`} 
                trend="8.4%" 
                isPositive={false}
                icon={<DollarSign size={22} />} 
                color="red" 
              />
              <StatCard 
                title="EAC Tahmini (Toplam)" 
                value={`${(projects.reduce((s, p) => s + getProjectMetrics(p).eac, 0) / 1000000).toFixed(1)}M TL`} 
                icon={<TrendingUp size={22} />} 
                color="amber" 
              />
              <StatCard 
                title="Genel İlerleme" 
                value={`%${(projects.reduce((s, p) => s + p.percentComplete, 0) / projects.length).toFixed(0)}`} 
                icon={<Percent size={22} />} 
                color="green" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                  <Activity size={20} className="text-amber-500" /> Bütçe vs Harcama vs Tahmin (x1000 TL)
                </h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="Bütçe" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={40} />
                      <Bar dataKey="Harcama" fill="#fbbf24" radius={[6, 6, 0, 0]} barSize={40} />
                      <Bar dataKey="Tahmin" fill="#1e293b" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-xl font-bold mb-6 text-slate-800">Proje Bazlı Sağlık Skorları</h3>
                <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                  {projects.map(p => {
                    const m = getProjectMetrics(p);
                    const risk = m.variance < 0;
                    return (
                      <div key={p.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-700">{p.name}</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${risk ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {risk ? 'KRİTİK' : 'STABİL'}
                          </span>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-xs text-slate-400">Varyans (EAC vs Bütçe)</p>
                            <p className={`text-lg font-bold ${risk ? 'text-red-500' : 'text-green-600'}`}>
                              {new Intl.NumberFormat('tr-TR').format(Math.abs(m.variance))} TL
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400">Birim Maliyet</p>
                            <p className="text-sm font-bold text-slate-600">
                              {new Intl.NumberFormat('tr-TR').format(m.unitCost)} TL / {p.unitLabel}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-500">
            {/* Entry Form */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                <Plus className="bg-amber-400 p-1 rounded-lg text-white" /> Harcama Girişi
              </h3>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Proje Seçimi</label>
                  <select 
                    value={selectedProjectForEntry}
                    onChange={(e) => setSelectedProjectForEntry(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                  >
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Tutar (TL)</label>
                    <input 
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Harcama Tipi</label>
                    <select 
                      value={newExpense.type}
                      onChange={(e) => setNewExpense({...newExpense, type: e.target.value as any})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                    >
                      <option value="MATERIAL">Malzeme</option>
                      <option value="LABOR">Personel</option>
                      <option value="MACHINE">Makine / Akaryakıt</option>
                      <option value="OTHER">Diğer</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Kategori / Metraj Kalemi</label>
                  <input 
                    type="text"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                    placeholder="Örn: Panel Montajı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Detaylı Açıklama</label>
                  <textarea 
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    rows={3}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                    placeholder="Fatura no, tedarikçi vb..."
                  />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} /> Kaydet ve Veritabanına Yaz
                </button>
              </form>
            </div>

            {/* List View */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Son Hareketler</h3>
                <Filter className="text-slate-400 cursor-pointer" />
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {expenses.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <FileText size={48} className="mb-2 opacity-20" />
                    <p>Henüz harcama kaydı bulunmuyor.</p>
                  </div>
                ) : (
                  expenses.map(e => (
                    <div key={e.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-amber-200 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-white text-slate-600 shadow-sm group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors`}>
                          {e.type === 'MACHINE' ? <Route size={20} /> : e.type === 'LABOR' ? <HardHat size={20} /> : <Zap size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{e.category}</p>
                          <p className="text-xs text-slate-400">{e.description.substring(0, 30)}...</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{new Intl.NumberFormat('tr-TR').format(e.amount)} TL</p>
                        <p className="text-xs text-slate-400">{e.date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
             <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 -mr-20 -mt-20">
                  <BrainCircuit size={400} />
                </div>
                
                <div className="relative z-10 max-w-3xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-amber-400 p-4 rounded-3xl text-slate-950 animate-pulse">
                      <BrainCircuit size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-extrabold tracking-tight text-white">MegaCost AI Foresight</h2>
                      <p className="text-indigo-200/80 font-medium">Bütçe Öngörü ve Risk Analiz Modülü</p>
                    </div>
                  </div>

                  {loadingAi ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent mb-4"></div>
                      <p className="text-lg font-medium text-indigo-100">Büyük veriler işleniyor, maliyet matrisleri analiz ediliyor...</p>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-inner">
                      <div className="whitespace-pre-wrap text-lg leading-relaxed text-indigo-50 font-medium">
                        {aiAnalysis}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-white/5 rounded-3xl border border-dashed border-white/20 text-center">
                      <p className="text-xl text-indigo-200 mb-6 font-medium">Lütfen analiz etmek istediğiniz projeyi seçin.</p>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {projects.map(p => (
                          <button 
                            key={p.id}
                            onClick={() => handleAiAnalysis(p)}
                            className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold hover:bg-amber-400 transition-all active:scale-95 shadow-lg"
                          >
                            {p.name} Analiz Et
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-2xl text-green-600"><CheckCircle2 /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Proje Sayısı</p>
                    <p className="text-xl font-black text-slate-900">{projects.length}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-2xl text-amber-600"><TrendingUp /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Ortalama CPI</p>
                    <p className="text-xl font-black text-slate-900">
                      {(projects.reduce((s, p) => s + getProjectMetrics(p).cpi, 0) / projects.length).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-2xl text-red-600"><AlertCircle /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Riskli Kalemler</p>
                    <p className="text-xl font-black text-slate-900">3</p>
                  </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
