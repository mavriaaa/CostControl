import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, Activity, AlertCircle, Plus, Briefcase, 
  Zap, Route, FileText, BrainCircuit, HardHat, 
  Download, Leaf, Package, Users, Timer, Trash2, 
  LayoutDashboard, ClipboardList, Warehouse, HardHat as HelmetIcon, BarChart3
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, ComposedChart, Line
} from 'recharts';

// --- 1. TİP TANIMLAMALARI (TYPES) ---
interface Project {
  id: string;
  name: string;
  type: 'GES' | 'YOL';
  location: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PLANNED';
  totalBudget: number;
  capacity: number;
  startDate: string;
  targetEndDate: string;
  percentComplete: number;
  targetCO2Saved?: number;
}

interface Expense {
  id: string;
  projectId: string;
  amount: number;
  quantity: number;
  unit: string;
  category: string;
  description: string;
  date: string;
  type: 'MATERIAL' | 'LABOR' | 'MACHINE' | 'FUEL' | 'OTHER';
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  lastUpdated: string;
}

interface LaborRecord {
  id: string;
  projectId: string;
  workerName: string;
  role: string;
  hours: number;
  overtime: number;
  date: string;
  dailyRate: number;
}

interface RiskMetrics {
  actualCost: number;
  burnRate: number;
  remainingDays: number;
  estimatedAtCompletion: number;
  budgetDeviation: number;
  cpi: number;
  carbonSaved: number;
}

// --- 2. SAHTE AI SERVİSİ (MOCK SERVICE) ---
// Gerçek API anahtarı olmadan çalışması için simülasyon
const getAiCostInsights = async (project: Project, expenses: Expense[]) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(`
**${project.name} - AI Stratejik Analiz Raporu**

1. **Bütçe Durumu:** Proje şu anki harcama hızıyla (Burn Rate) devam ederse, tahmini bütçe aşımı %12 civarında olacaktır. Özellikle ${project.type === 'GES' ? 'panel montaj' : 'hafriyat'} kalemlerinde maliyet artışı gözlemleniyor.

2. **Verimlilik Analizi (CPI):** Maliyet Performans Endeksi (CPI) 0.92 seviyesinde. Yani harcanan her 100 TL karşılığında 92 TL'lik iş üretiliyor. 

3. **Öneri:** ${project.type === 'GES' ? 'Panel tedarikçisi ile lojistik maliyetleri için sabit fiyat anlaşması yapılmalı.' : 'İş makinelerinin rölanti süreleri çok yüksek, vardiya planlaması gözden geçirilmeli.'}

4. **ESG Etkisi:** Proje tamamlandığında yıllık ${project.capacity * 450} Ton CO2 tasarrufu sağlayacak. Bu, yeşil tahvil finansmanı için uygun bir skordur.
      `);
    }, 2000); // 2 saniye bekleme efekti
  });
};

// --- 3. BİLEŞENLER (COMPONENTS) ---

// Sidebar Bileşeni
const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'projects', label: 'Projeler', icon: <Briefcase size={20} /> },
    { id: 'expenses', label: 'Yeşil Defter', icon: <ClipboardList size={20} /> },
    { id: 'inventory', label: 'Stok & Depo', icon: <Warehouse size={20} /> },
    { id: 'labor', label: 'Puantaj', icon: <HelmetIcon size={20} /> },
    { id: 'reports', label: 'AI Raporlama', icon: <BrainCircuit size={20} /> },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6 shadow-2xl z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Activity size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-black text-xl tracking-tighter">MegaCost</h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Construction AI</p>
        </div>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-8 left-6 right-6">
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-300">Sistem Online</span>
          </div>
          <p className="text-[10px] text-slate-500">v2.4.0 Enterprise</p>
        </div>
      </div>
    </div>
  );
};

// StatCard Bileşeni
const StatCard = ({ title, value, icon, color, trend, isPositive }: any) => {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colors[color] || colors.blue}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h4>
        <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

// --- 4. ANA UYGULAMA (APP) ---
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [laborRecords, setLaborRecords] = useState<LaborRecord[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Form States
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    quantity: '',
    unit: 'm2',
    category: '',
    description: '',
    type: 'MATERIAL' as any,
    date: new Date().toISOString().split('T')[0]
  });

  const [projectFormData, setProjectFormData] = useState({
    name: '',
    type: 'GES' as any,
    location: '',
    totalBudget: '',
    capacity: '',
    startDate: new Date().toISOString().split('T')[0],
    targetEndDate: '',
    percentComplete: '0'
  });

  const [inventoryFormData, setInventoryFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: 'Adet',
    minStock: ''
  });

  const [laborFormData, setLaborFormData] = useState({
    workerName: '',
    role: 'Usta',
    hours: '8',
    overtime: '0',
    dailyRate: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Data Persistence
  useEffect(() => {
    const savedProjects = localStorage.getItem('megacontrol_projects');
    const savedExpenses = localStorage.getItem('megacontrol_expenses');
    const savedInventory = localStorage.getItem('megacontrol_inventory');
    const savedLabor = localStorage.getItem('megacontrol_labor');
    
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    if (savedLabor) setLaborRecords(JSON.parse(savedLabor));

    // Demo Data Başlangıçta Yoksa Ekle
    if (!savedProjects) {
      const initProjects: Project[] = [
        { 
          id: '1', name: 'Güneş Enerji Santrali - Manisa', type: 'GES', 
          location: 'Manisa, TR', status: 'ACTIVE', totalBudget: 15000000, 
          capacity: 20, startDate: '2023-08-01', targetEndDate: '2024-08-01', 
          percentComplete: 45, targetCO2Saved: 12500 
        },
        { 
          id: '2', name: 'Otoyol Genişletme - Segment A', type: 'YOL', 
          location: 'Ankara, TR', status: 'ACTIVE', totalBudget: 42000000, 
          capacity: 15, startDate: '2023-05-15', targetEndDate: '2024-12-30', 
          percentComplete: 30 
        }
      ];
      setProjects(initProjects);
      localStorage.setItem('megacontrol_projects', JSON.stringify(initProjects));
    }
  }, []);

  const saveToStorage = (p: Project[], e: Expense[], i: InventoryItem[], l: LaborRecord[]) => {
    localStorage.setItem('megacontrol_projects', JSON.stringify(p));
    localStorage.setItem('megacontrol_expenses', JSON.stringify(e));
    localStorage.setItem('megacontrol_inventory', JSON.stringify(i));
    localStorage.setItem('megacontrol_labor', JSON.stringify(l));
  };

  // --- MEGA CONTROL ENGINE ---
  const calculateMegaMetrics = (project: Project): RiskMetrics => {
    const projExpenses = expenses.filter(e => e.projectId === project.id);
    const projLabor = laborRecords.filter(l => l.projectId === project.id);
    const laborCost = projLabor.reduce((sum, l) => sum + (l.dailyRate * (l.hours / 8)) + (l.overtime * (l.dailyRate / 8) * 1.5), 0);
    const actualCost = projExpenses.reduce((sum, e) => sum + e.amount, 0) + laborCost;
    
    const start = new Date(project.startDate).getTime();
    const end = new Date(project.targetEndDate).getTime();
    const now = new Date().getTime();
    const daysPassed = Math.max(1, (now - start) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, (end - now) / (1000 * 60 * 60 * 24));
    
    const burnRate = actualCost / daysPassed;
    const eac = actualCost + (burnRate * remainingDays);
    const budgetDeviation = project.totalBudget - eac;
    
    const earnedValue = project.totalBudget * (project.percentComplete / 100);
    const cpi = actualCost > 0 ? earnedValue / actualCost : 1;
    const carbonSaved = project.type === 'GES' ? (project.capacity * (project.percentComplete / 100) * 450) : 0;

    return { actualCost, burnRate, remainingDays, estimatedAtCompletion: eac, budgetDeviation, cpi, carbonSaved };
  };

  const sCurveData = useMemo(() => [
    { name: 'Başlangıç', planned: 0, actual: 0 },
    { name: 'Q1', planned: 20, actual: 15 },
    { name: 'Q2', planned: 45, actual: 40 },
    { name: 'Q3', planned: 75, actual: 65 },
    { name: 'Q4', planned: 100, actual: null },
  ], []);

  // Event Handlers
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !formData.amount) return;
    const newExp: Expense = {
      id: Date.now().toString(),
      projectId: selectedProjectId,
      amount: parseFloat(formData.amount),
      quantity: parseFloat(formData.quantity || '0'),
      unit: formData.unit,
      category: formData.category,
      description: formData.description,
      date: formData.date,
      type: formData.type
    };
    const updated = [newExp, ...expenses];
    setExpenses(updated);
    setFormData({ ...formData, amount: '', quantity: '', category: '', description: '' });
    saveToStorage(projects, updated, inventory, laborRecords);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectFormData.name || !projectFormData.totalBudget) return;
    const newProj: Project = {
      id: Date.now().toString(),
      name: projectFormData.name,
      type: projectFormData.type,
      location: projectFormData.location,
      status: 'ACTIVE',
      totalBudget: parseFloat(projectFormData.totalBudget),
      capacity: parseFloat(projectFormData.capacity || '0'),
      startDate: projectFormData.startDate,
      targetEndDate: projectFormData.targetEndDate || new Date().toISOString(),
      percentComplete: parseInt(projectFormData.percentComplete)
    };
    const updated = [...projects, newProj];
    setProjects(updated);
    setProjectFormData({ name: '', type: 'GES', location: '', totalBudget: '', capacity: '', startDate: new Date().toISOString().split('T')[0], targetEndDate: '', percentComplete: '0' });
    saveToStorage(updated, expenses, inventory, laborRecords);
  };

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryFormData.name || !inventoryFormData.quantity) return;
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: inventoryFormData.name,
      category: inventoryFormData.category,
      quantity: parseFloat(inventoryFormData.quantity),
      unit: inventoryFormData.unit,
      minStock: parseFloat(inventoryFormData.minStock || '0'),
      lastUpdated: new Date().toISOString()
    };
    const updated = [newItem, ...inventory];
    setInventory(updated);
    setInventoryFormData({ name: '', category: '', quantity: '', unit: 'Adet', minStock: '' });
    saveToStorage(projects, expenses, updated, laborRecords);
  };

  const handleAddLabor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !laborFormData.workerName || !laborFormData.dailyRate) return;
    const newRecord: LaborRecord = {
      id: Date.now().toString(),
      projectId: selectedProjectId,
      workerName: laborFormData.workerName,
      role: laborFormData.role,
      hours: parseFloat(laborFormData.hours),
      overtime: parseFloat(laborFormData.overtime),
      date: laborFormData.date,
      dailyRate: parseFloat(laborFormData.dailyRate)
    };
    const updated = [newRecord, ...laborRecords];
    setLaborRecords(updated);
    setLaborFormData({ ...laborFormData, workerName: '', dailyRate: '', overtime: '0' });
    saveToStorage(projects, expenses, inventory, updated);
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    saveToStorage(updated, expenses, inventory, laborRecords);
  };

  const deleteInventory = (id: string) => {
    const updated = inventory.filter(i => i.id !== id);
    setInventory(updated);
    saveToStorage(projects, expenses, updated, laborRecords);
  };

  const deleteLabor = (id: string) => {
    const updated = laborRecords.filter(l => l.id !== id);
    setLaborRecords(updated);
    saveToStorage(projects, expenses, inventory, updated);
  };

  const triggerAiAnalysis = async (project: Project) => {
    setLoadingAi(true);
    setActiveTab('reports');
    const projectExpenses = expenses.filter(e => e.projectId === project.id);
    const insights = await getAiCostInsights(project, projectExpenses);
    setAiAnalysis(insights || "Analiz raporu oluşturulamadı.");
    setLoadingAi(false);
  };

  // --- RENDER ---
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">Enterprise AI</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              MegaControl <span className="text-indigo-600">AI</span>
            </h1>
            <p className="text-slate-500 font-medium">Earned Value Management & ESG Decision Support</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white text-slate-700 px-5 py-2.5 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
              <Download size={18} /> Yeşil Defter Dökümü
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Portföy Bütçesi" value={`${(projects.reduce((s, p) => s + p.totalBudget, 0) / 1000000).toFixed(1)}M TL`} icon={<Briefcase size={22} />} color="blue" />
              <StatCard title="Burn Rate (Günlük)" value={`${(projects.reduce((s, p) => s + calculateMegaMetrics(p).burnRate, 0) / 1000).toFixed(1)}K TL`} icon={<Activity size={22} />} color="amber" />
              <StatCard title="Öngörülen Sapma" value={`${(projects.reduce((s, p) => s + calculateMegaMetrics(p).budgetDeviation, 0) / 1000000).toFixed(1)}M TL`} trend="Risk Analizi" isPositive={projects.reduce((s, p) => s + calculateMegaMetrics(p).budgetDeviation, 0) > 0} icon={<AlertCircle size={22} />} color="red" />
              <StatCard title="ESG Karbon Tasarrufu" value={`${Math.round(projects.reduce((s, p) => s + calculateMegaMetrics(p).carbonSaved, 0))} Ton`} icon={<Leaf size={22} />} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><TrendingUp className="text-indigo-600" /> S-Curve Analizi</h3>
                  <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1"><div className="w-3 h-0.5 bg-slate-200"></div> Planlanan</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-0.5 bg-indigo-600"></div> Gerçekleşen</span>
                  </div>
                </div>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={sCurveData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="planned" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth={2} />
                      <Line type="monotone" dataKey="actual" stroke="#4f46e5" strokeWidth={4} dot={{r: 6, fill: '#4f46e5'}} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 -mr-10 -mt-10"><Leaf size={250} /></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-2">ESG Scorecard</h3>
                  <p className="text-indigo-100 text-sm mb-8 font-medium">Sürdürülebilirlik Metrikleri</p>
                  <div className="space-y-6">
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase">CO2 Azaltımı</span>
                        <span className="text-amber-400 font-black">74%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full"><div className="h-full bg-amber-400 rounded-full" style={{width: '74%'}}></div></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 p-4 rounded-2xl text-center"><Zap size={20} className="mx-auto mb-2" /><p className="text-lg font-black">12.4 GWh</p></div>
                      <div className="bg-white/10 p-4 rounded-2xl text-center"><HardHat size={20} className="mx-auto mb-2" /><p className="text-lg font-black">0 Kaza</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-left-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Plus className="text-indigo-600" /> Yeni Proje Kaydı</h3>
              <form onSubmit={handleAddProject} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Proje Adı</label>
                  <input type="text" value={projectFormData.name} onChange={e => setProjectFormData({...projectFormData, name: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200 outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tip</label>
                    <select value={projectFormData.type} onChange={e => setProjectFormData({...projectFormData, type: e.target.value as any})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200">
                      <option value="GES">GES</option>
                      <option value="YOL">YOL</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Bütçe (TL)</label>
                    <input type="number" value={projectFormData.totalBudget} onChange={e => setProjectFormData({...projectFormData, totalBudget: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Başlangıç</label>
                    <input type="date" value={projectFormData.startDate} onChange={e => setProjectFormData({...projectFormData, startDate: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Bitiş Hedefi</label>
                    <input type="date" value={projectFormData.targetEndDate} onChange={e => setProjectFormData({...projectFormData, targetEndDate: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200" />
                  </div>
                </div>
                <button className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl">Proje Oluştur</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold">Portföy Listesi</h3>
              {projects.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:shadow-lg transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="bg-slate-50 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {p.type === 'GES' ? <Zap size={24} /> : <Route size={24} />}
                    </div>
                    <div>
                      <h4 className="font-black text-lg">{p.name}</h4>
                      <p className="text-sm text-slate-400 font-medium flex items-center gap-2"><MapPin size={14} /> {p.location} • <Layers size={14} /> {p.capacity} {p.type === 'GES' ? 'MW' : 'KM'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="font-black text-slate-900">{new Intl.NumberFormat('tr-TR').format(p.totalBudget)} TL</p>
                      <p className="text-xs font-bold text-slate-400 uppercase">Toplam Bütçe</p>
                    </div>
                    <button onClick={() => deleteProject(p.id)} className="text-slate-200 hover:text-red-500 transition-all"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Package className="text-amber-500" /> Stok Girişi</h3>
              <form onSubmit={handleAddInventory} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Malzeme Adı</label>
                  <input type="text" value={inventoryFormData.name} onChange={e => setInventoryFormData({...inventoryFormData, name: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200 outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Miktar</label>
                    <input type="number" value={inventoryFormData.quantity} onChange={e => setInventoryFormData({...inventoryFormData, quantity: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Birim</label>
                    <input type="text" value={inventoryFormData.unit} onChange={e => setInventoryFormData({...inventoryFormData, unit: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Min. Stok Uyarısı</label>
                  <input type="number" value={inventoryFormData.minStock} onChange={e => setInventoryFormData({...inventoryFormData, minStock: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200" />
                </div>
                <button className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black hover:bg-amber-500 transition-all shadow-xl">Stoka Ekle</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Ambar Durumu</h3>
                <span className="text-xs font-bold text-slate-400 uppercase">{inventory.length} Kalem Malzeme</span>
              </div>
              <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="p-5">Malzeme</th>
                      <th className="p-5">Miktar</th>
                      <th className="p-5">Min. Stok</th>
                      <th className="p-5">Durum</th>
                      <th className="p-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {inventory.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-all">
                        <td className="p-5 font-bold">{item.name}</td>
                        <td className="p-5 font-black text-slate-700">{item.quantity} {item.unit}</td>
                        <td className="p-5 text-slate-400">{item.minStock} {item.unit}</td>
                        <td className="p-5">
                          {item.quantity <= item.minStock ? (
                            <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-1 rounded-full uppercase">Kritik</span>
                          ) : (
                            <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase">Yeterli</span>
                          )}
                        </td>
                        <td className="p-5 text-right"><button onClick={() => deleteInventory(item.id)} className="text-slate-200 hover:text-red-500 transition-all"><Trash2 size={18} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'labor' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Users className="text-blue-500" /> Puantaj Girişi</h3>
              <form onSubmit={handleAddLabor} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Proje</label>
                  <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold outline-none ring-1 ring-slate-200">
                    <option value="">Seçiniz...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Personel Adı</label>
                  <input type="text" value={laborFormData.workerName} onChange={e => setLaborFormData({...laborFormData, workerName: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Rol</label>
                    <select value={laborFormData.role} onChange={e => setLaborFormData({...laborFormData, role: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200">
                      <option value="Usta">Usta</option>
                      <option value="İşçi">İşçi</option>
                      <option value="Operatör">Operatör</option>
                      <option value="Mühendis">Mühendis</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Günlük Yevmiye</label>
                    <input type="number" value={laborFormData.dailyRate} onChange={e => setLaborFormData({...laborFormData, dailyRate: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Mesai (Saat)</label>
                    <input type="number" value={laborFormData.hours} onChange={e => setLaborFormData({...laborFormData, hours: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Fazla Mesai</label>
                    <input type="number" value={laborFormData.overtime} onChange={e => setLaborFormData({...laborFormData, overtime: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200" />
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl">Puantaj Kaydet</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Günlük Puantaj Listesi</h3>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase">
                  <span className="flex items-center gap-1"><Timer size={14} /> Toplam Mesai: {laborRecords.reduce((s, l) => s + l.hours + l.overtime, 0)} Saat</span>
                </div>
              </div>
              <div className="grid gap-3">
                {laborRecords.map(l => (
                  <div key={l.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Users size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-lg">{l.workerName}</h4>
                        <p className="text-sm text-slate-400 font-medium">{l.role} • {l.date} • {l.hours}s + {l.overtime}s FM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="font-black text-slate-900">
                          {new Intl.NumberFormat('tr-TR').format(Math.round((l.dailyRate * (l.hours / 8)) + (l.overtime * (l.dailyRate / 8) * 1.5)))} TL
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Maliyet</p>
                      </div>
                      <button onClick={() => deleteLabor(l.id)} className="text-slate-200 hover:text-red-500 transition-all"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3"><ClipboardList className="text-indigo-600" /> Metraj Cetveli Girişi</h3>
              <form onSubmit={handleAddExpense} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Proje</label>
                  <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600">
                    <option value="">Seçiniz...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Miktar</label>
                    <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Birim</label>
                    <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl ring-1 ring-slate-200">
                      <option value="m2">m2</option>
                      <option value="m3">m3</option>
                      <option value="ton">ton</option>
                      <option value="MW">MW</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Toplam Tutar (TL)</label>
                  <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-black outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-600 text-lg" placeholder="0.00" />
                </div>
                <button className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">Muhasebeleşir Kaydet</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold">Yeşil Defter Kayıtları</h3>
              <div className="grid gap-3">
                {expenses.map(exp => (
                  <div key={exp.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-50 p-3 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {exp.type === 'MACHINE' ? <Route size={20} /> : <Package size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{exp.category || 'Belirtilmemiş'}</p>
                        <p className="text-xs text-slate-400 font-medium">{exp.quantity} {exp.unit} • {exp.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900">{new Intl.NumberFormat('tr-TR').format(exp.amount)} TL</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
             <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-5 -mr-40 -mt-40"><BrainCircuit size={600} /></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="bg-indigo-500 p-6 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20"><BrainCircuit size={48} /></div>
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter">MegaControl Foresight</h2>
                      <p className="text-indigo-200 font-bold opacity-80">Gelişmiş Bütçe Tahmini & Risk Modülasyonu</p>
                    </div>
                  </div>
                  {loadingAi ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl">
                      <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-400 mb-8"></div>
                      <p className="text-2xl font-black text-indigo-50">TÜİK Endeksleri ve Şantiye Verileri İşleniyor...</p>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-inner">
                      <div className="prose prose-invert max-w-none text-indigo-50/90 leading-relaxed text-lg whitespace-pre-wrap font-medium">{aiAnalysis}</div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-2xl font-bold mb-10 text-indigo-100">Hangi projeyi teknik olarak denetlemek istersiniz?</p>
                      <div className="flex flex-wrap gap-4 justify-center">
                        {projects.map(p => <button key={p.id} onClick={() => triggerAiAnalysis(p)} className="bg-white text-slate-950 px-10 py-5 rounded-[2rem] font-black text-xl hover:bg-amber-400 transition-all active:scale-95 shadow-2xl">{p.name}</button>)}
                      </div>
                    </div>
                  )}
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
