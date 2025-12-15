import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { 
  Camera, Shield, Users, BarChart3, LogOut, 
  UserPlus, Home, QrCode, 
  AlertCircle, CheckCircle, XCircle, 
  LayoutDashboard, FilePlus, Settings, HelpCircle, 
  RefreshCw, CameraOff, FileText, Smartphone, ScanFace // <--- Fixed: Added missing icons here
} from 'lucide-react';
// Imports for Charts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- CONFIGURATION & MOCK DATA ---
const MOCK_DB = {
  regularVisitors: ['9876', '1234'],
  blockedVisitors: ['0000']
};

// Mock data for Analytics charts
const MOCK_ANALYTICS_DATA = {
  dailyTrend: [
    { name: 'Mon', visitors: 12 },
    { name: 'Tue', visitors: 19 },
    { name: 'Wed', visitors: 15 },
    { name: 'Thu', visitors: 22 },
    { name: 'Fri', visitors: 30 },
    { name: 'Sat', visitors: 45 },
    { name: 'Sun', visitors: 38 },
  ],
  purposeDistribution: [
    { name: 'Meeting', value: 45 },
    { name: 'Interview', value: 20 },
    { name: 'Delivery', value: 15 },
    { name: 'Personal', value: 20 },
  ],
  COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
};


// --- MAIN APP COMPONENT ---
export default function SVIMS() {
  const [currentRoute, setCurrentRoute] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [visitors, setVisitors] = useState([
    { id: 1, name: 'Amit Singh', aadhaar: '9876', time: '09:15 AM', score: 85, status: 'Allowed', purpose: 'Meeting' },
    { id: 2, name: 'Rahul Verma', aadhaar: '3456', time: '10:20 AM', score: 60, status: 'Staff Verify', purpose: 'Delivery' }
  ]);

  const handleNewVisitor = (visitorData) => {
    setVisitors([visitorData, ...visitors]);
  };

  return (
    <div className="min-h-screen text-white font-sans relative overflow-x-hidden bg-[#1a1a2e]">
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'linear-gradient(to bottom right, #0f0c29, #302b63, #24243e)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10">
        {currentRoute === 'login' && (
          <LoginPage 
            onLogin={(isAuth) => { setIsAuthenticated(isAuth); setCurrentRoute('dashboard'); }} 
            onVisitorEntry={() => setCurrentRoute('user-kiosk')} 
          />
        )}
        
        {currentRoute === 'dashboard' && isAuthenticated && (
          <DashboardLayout 
            onLogout={() => { setIsAuthenticated(false); setCurrentRoute('login'); }}
            visitors={visitors}
            onAddVisitor={handleNewVisitor}
          />
        )}
        
        {currentRoute === 'user-kiosk' && (
          <UserKioskPage 
            onComplete={(data) => { handleNewVisitor(data); setCurrentRoute('login'); }}
            onBack={() => setCurrentRoute('login')}
            isKioskMode={true}
          />
        )}
      </div>
    </div>
  );
}

// --- LOGIN PAGE ---
function LoginPage({ onLogin, onVisitorEntry }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Branding */}
        <div className="space-y-6">
          <h1 className="text-6xl font-bold leading-tight drop-shadow-lg">SVIMS<br/><span className="text-blue-400">Secure Access</span></h1>
          <p className="text-xl text-blue-200">Smart Visitor Intelligent Management System</p>
          
          <button 
            onClick={() => setShowQR(!showQR)}
            className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-md px-6 py-3 rounded-xl font-bold transition border border-blue-500/30"
          >
            <QrCode /> {showQR ? 'Hide QR Code' : 'Generate QR Code'}
          </button>

          {showQR && (
            <div className="bg-white p-4 rounded-xl w-fit animate-fade-in shadow-2xl">
              <QrCode size={150} className="text-black" />
              <p className="text-black text-xs text-center mt-2 font-mono">scan to open portal</p>
            </div>
          )}
        </div>

        {/* Right: Login Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="text-blue-400" /> Admin Login
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-blue-200 ml-1 mb-1 block">Username</label>
              <input 
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/20 border border-blue-500/30 rounded-xl p-3 focus:border-blue-400 outline-none transition text-white"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="text-sm text-blue-200 ml-1 mb-1 block">Password</label>
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-blue-500/30 rounded-xl p-3 focus:border-blue-400 outline-none transition text-white"
                placeholder="••••••"
              />
            </div>
            <button 
              onClick={() => onLogin(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl font-bold hover:scale-105 transition shadow-lg"
            >
              Login Dashboard
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <button 
              onClick={onVisitorEntry}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/20 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              <UserPlus size={18} /> Open Visitor Kiosk (Entry Portal)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD LAYOUT ---
function DashboardLayout({ onLogout, visitors, onAddVisitor }) {
  const [activeTab, setActiveTab] = useState('overview');

  const btnClass = (tabName) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === tabName ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-blue-200 hover:bg-white/5'}`;

  return (
    <div className="flex h-screen overflow-hidden bg-black/20 backdrop-blur-lg">
      
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col pt-6">
        <div className="px-6 mb-8">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            SVIMS Admin
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={btnClass('overview')}>
            <LayoutDashboard size={20} /> Overview
          </button>
          <button onClick={() => setActiveTab('new-entry')} className={btnClass('new-entry')}>
            <FilePlus size={20} /> New Entry
          </button>
          <button onClick={() => setActiveTab('analytics')} className={btnClass('analytics')}>
            <BarChart3 size={20} /> Analytics
          </button>
          <button onClick={() => setActiveTab('config')} className={btnClass('config')}>
            <Settings size={20} /> Config
          </button>
          <button onClick={() => setActiveTab('faq')} className={btnClass('faq')}>
            <HelpCircle size={20} /> FAQ
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-2 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">Dashboard Overview</h1>
              </div>
            </header>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Total Visitors */}
              <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-md p-6 rounded-3xl border border-blue-500/30 shadow-xl flex items-center justify-between">
                 <div>
                    <p className="text-blue-200 font-medium mb-1">Total Visitors</p>
                    <h3 className="text-4xl font-bold text-white">{visitors.length}</h3>
                 </div>
                 <div className="p-4 bg-blue-600/80 rounded-2xl"><Users size={28}/></div>
              </div>
              {/* Allowed */}
              <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 backdrop-blur-md p-6 rounded-3xl border border-green-500/30 shadow-xl flex items-center justify-between">
                 <div>
                    <p className="text-green-200 font-medium mb-1">Allowed Entry</p>
                    <h3 className="text-4xl font-bold text-white">{visitors.filter(v => v.status === 'Allowed').length}</h3>
                 </div>
                 <div className="p-4 bg-green-600/80 rounded-2xl"><CheckCircle size={28}/></div>
              </div>
               {/* Pending */}
              <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 backdrop-blur-md p-6 rounded-3xl border border-yellow-500/30 shadow-xl flex items-center justify-between">
                 <div>
                    <p className="text-yellow-200 font-medium mb-1">Pending / Review</p>
                    <h3 className="text-4xl font-bold text-white">{visitors.filter(v => v.status === 'Staff Verify').length}</h3>
                 </div>
                 <div className="p-4 bg-yellow-600/80 rounded-2xl"><AlertCircle size={28}/></div>
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden mt-8">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold">Visitor Logs</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 text-blue-200 text-sm">Name</th>
                    <th className="p-4 text-blue-200 text-sm">Aadhaar</th>
                    <th className="p-4 text-blue-200 text-sm">Purpose</th>
                    <th className="p-4 text-blue-200 text-sm">Time</th>
                    <th className="p-4 text-blue-200 text-sm">Score</th>
                    <th className="p-4 text-blue-200 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {visitors.map((v) => (
                    <tr key={v.id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-medium">{v.name}</td>
                      <td className="p-4 font-mono text-gray-400">{v.aadhaar}</td>
                      <td className="p-4 text-gray-300">{v.purpose}</td>
                      <td className="p-4 text-gray-300">{v.time}</td>
                      <td className="p-4 font-bold">{v.score}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          v.status === 'Allowed' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 
                          v.status === 'Staff Verify' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 
                          'bg-red-500/20 border-red-500/50 text-red-400'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NEW ENTRY TAB */}
        {activeTab === 'new-entry' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
             <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setActiveTab('overview')} className="p-2 hover:bg-white/10 rounded-lg">
                  <Home size={20} />
                </button>
                <h1 className="text-3xl font-bold">Manual Entry</h1>
             </div>
             <VisitorForm 
               onComplete={(data) => {
                 onAddVisitor(data);
                 setActiveTab('overview');
                 alert(`Visitor Entry Processed: ${data.status}`);
               }}
               isKiosk={false}
             />
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">Analytics & Reports</h1>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-blue-500/30 text-center">
                    <h4 className="text-blue-200 text-sm">Avg. Daily Visitors</h4>
                    <p className="text-3xl font-bold">26</p>
                </div>
                <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-green-500/30 text-center">
                    <h4 className="text-green-200 text-sm">Approval Rate</h4>
                    <p className="text-3xl font-bold">85%</p>
                </div>
                <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-purple-500/30 text-center">
                    <h4 className="text-purple-200 text-sm">Peak Hour</h4>
                    <p className="text-2xl font-bold">10:00 AM</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Weekly Trend Chart */}
              <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BarChart3 size={20}/> Weekly Visitor Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_ANALYTICS_DATA.dailyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#aaa" />
                      <YAxis stroke="#aaa" />
                      <Tooltip contentStyle={{backgroundColor: '#333', border: 'none'}} itemStyle={{color: '#fff'}}/>
                      <Line type="monotone" dataKey="visitors" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Purpose Distribution Chart */}
              <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText size={20}/> Purpose of Visit</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={MOCK_ANALYTICS_DATA.purposeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        {MOCK_ANALYTICS_DATA.purposeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={MOCK_ANALYTICS_DATA.COLORS[index % MOCK_ANALYTICS_DATA.COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{backgroundColor: '#333', border: 'none'}} itemStyle={{color: '#fff'}}/>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONFIG TAB */}
        {activeTab === 'config' && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold">System Configuration</h1>
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 space-y-6 max-w-2xl">
              <div>
                  <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-4">Trust Score Rules</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-blue-300 mb-1">Auto-Allow Threshold (Score &gt;)</label>
                      <input type="number" defaultValue={80} className="w-full bg-black/20 border border-blue-500/30 rounded-xl p-3 text-white focus:border-blue-400 outline-none"/>
                    </div>
                    <div>
                      <label className="block text-sm text-red-300 mb-1">Deny Threshold (Score &lt;)</label>
                      <input type="number" defaultValue={50} className="w-full bg-black/20 border border-red-500/30 rounded-xl p-3 text-white focus:border-red-400 outline-none"/>
                    </div>
                  </div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl font-bold shadow-lg">Save Configuration</button>
            </div>
          </div>
        )}

        {/* FAQ TAB */}
        {activeTab === 'faq' && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
            <div className="grid gap-4 max-w-3xl">
              <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <h3 className="font-bold text-blue-300 flex items-center gap-2 mb-2"><HelpCircle size={18}/> How is the Trust Score calculated?</h3>
                <p className="text-gray-300 leading-relaxed">The score is a sum of 4 parameters (max 100): Visitor Duration History (25), Real-time Face Match Confidence (25), Visit Consistency (Regular vs New) (25), and Validity of Purpose (25).</p>
              </div>
              <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <h3 className="font-bold text-red-300 flex items-center gap-2 mb-2"><AlertCircle size={18}/> What triggers a "Denied" status?</h3>
                <p className="text-gray-300 leading-relaxed">If the total Trust Score falls below 50, the entry is automatically denied, and a security alert popup is generated.</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// --- REUSABLE VISITOR FORM ---
function VisitorForm({ onComplete, isKiosk }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', aadhaar: '', mobile: '', purpose: 'Meeting', 
    address: '', visitPerson: '', timeIn: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);

  const nextStep = () => setStep(p => p + 1);

  // 1. Send OTP
  const handleSendOTP = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); 
    setLoading(false);
    nextStep();
  };

  // 2. Verify OTP
  const handleVerifyOTP = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    nextStep();
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // 3. Analyze Captured Face & Calculate Score
  const handleAnalyzeFace = async () => {
    if (!capturedImage) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const isRegular = MOCK_DB.regularVisitors.includes(formData.aadhaar.slice(-4));
    const detectedScore = isRegular ? 85 : 55;
    
    const durationScore = 25; 
    const normFaceScore = Math.min(25, Math.round(detectedScore * 0.25));
    const consistencyScore = isRegular ? 25 : 10;
    const purposeScore = ['Meeting', 'Interview'].includes(formData.purpose) ? 25 : 15;
    
    const total = durationScore + normFaceScore + consistencyScore + purposeScore;
    
    let status = 'Denied';
    if (total > 80) status = 'Allowed';
    else if (total > 50) status = 'Staff Verify';
    
    setAiAnalysis({ 
      breakdown: { duration: durationScore, face: normFaceScore, consistency: consistencyScore, purpose: purposeScore }, 
      total, 
      status 
    });
    setLoading(false);
    nextStep();
  };

  const finalize = () => {
    onComplete({
      id: Date.now(),
      name: formData.name,
      aadhaar: formData.aadhaar,
      time: formData.timeIn,
      score: aiAnalysis.total,
      status: aiAnalysis.status,
      purpose: formData.purpose,
      photo: capturedImage 
    });
  };

  return (
    <div className={`bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl ${isKiosk ? 'max-w-md w-full' : 'w-full'}`}>
      
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map(i => (
           <div key={i} className={`h-1.5 flex-1 mx-1 rounded-full transition-all ${i <= step ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Visitor Details</h2>
          
          <div className="space-y-4">
            <input 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/30 border border-indigo-500/30 rounded-xl p-4 focus:border-blue-400 outline-none text-white placeholder-indigo-200/50" 
              placeholder="Full Name"
            />
            <div className="grid grid-cols-2 gap-4">
                <input 
                  value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})}
                  className="w-full bg-black/30 border border-indigo-500/30 rounded-xl p-4 focus:border-blue-400 outline-none text-white placeholder-indigo-200/50" 
                  placeholder="Aadhaar Number"
                />
                <input 
                  value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
                  className="w-full bg-black/30 border border-indigo-500/30 rounded-xl p-4 focus:border-blue-400 outline-none text-white placeholder-indigo-200/50" 
                  placeholder="Mobile Number"
                />
            </div>
            <input 
              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full bg-black/30 border border-indigo-500/30 rounded-xl p-4 focus:border-blue-400 outline-none text-white placeholder-indigo-200/50" 
              placeholder="Full Address"
            />
             <div className="grid grid-cols-2 gap-4">
                <input 
                  value={formData.visitPerson} onChange={e => setFormData({...formData, visitPerson: e.target.value})}
                  className="w-full bg-black/30 border border-indigo-500/30 rounded-xl p-4 focus:border-blue-400 outline-none text-white placeholder-indigo-200/50" 
                  placeholder="Whom to Visit"
                />
                <select 
                  value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}
                  className="w-full bg-black/30 border border-indigo-500/30 rounded-xl p-4 focus:border-blue-400 outline-none text-white bg-gray-900/90" 
                >
                  <option value="Meeting">Meeting</option>
                  <option value="Interview">Interview</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Personal">Personal</option>
                </select>
            </div>
          </div>
          
          <div className="bg-indigo-900/30 p-3 rounded-xl text-indigo-200 text-sm flex justify-between border border-indigo-500/20">
            <span>Time In:</span> <span className="text-white font-mono font-bold">{formData.timeIn}</span>
          </div>

          <button onClick={handleSendOTP} disabled={!formData.aadhaar || loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-4 rounded-xl font-bold mt-4 text-lg shadow-lg transition transform hover:scale-[1.02]">
            {loading ? 'Sending...' : 'Send OTP Verification'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 text-center animate-fade-in py-4">
          <div className="bg-blue-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Smartphone size={40} className="text-blue-400"/>
          </div>
          <div>
              <h2 className="text-2xl font-bold mb-2">OTP Verification</h2>
              <p className="text-indigo-200">Enter the 4-digit code sent to {formData.mobile}</p>
          </div>
          <input type="text" placeholder="XXXX" className="w-40 bg-black/30 border border-blue-500/50 rounded-xl p-4 text-center text-3xl tracking-[0.5em] font-mono mx-auto block text-white focus:border-blue-400 outline-none" />
          <button onClick={handleVerifyOTP} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-4 rounded-xl font-bold text-lg shadow-lg">
            {loading ? 'Verifying...' : 'Verify & Proceed'}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 text-center animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Face Verification</h2>
          
          <div className="relative w-full h-72 bg-black rounded-2xl overflow-hidden border-2 border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.2)] flex items-center justify-center">
            {loading && <div className="absolute inset-0 bg-blue-500/20 animate-pulse z-20" ><div className="h-full w-full flex items-center justify-center"><RefreshCw className="animate-spin text-blue-400" size={40}/></div></div>}
            
            {!capturedImage ? (
                <>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="absolute inset-0 w-full h-full object-cover"
                    videoConstraints={{ facingMode: "user" }}
                />
                <div className="absolute inset-0 border-2 border-transparent m-6 rounded-xl z-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
                </div>
                <p className="absolute bottom-4 text-white/70 text-sm bg-black/50 px-3 py-1 rounded-full z-10">Align your face within the frame</p>
                </>
            ) : (
                <img src={capturedImage} alt="Captured face" className="absolute inset-0 w-full h-full object-cover" />
            )}
          </div>

          {!capturedImage ? (
             <button onClick={capturePhoto} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2">
               <Camera size={24}/> Capture Photo
             </button>
          ) : (
             <div className="flex gap-3">
                 <button onClick={retakePhoto} disabled={loading} className="flex-1 bg-gray-600 hover:bg-gray-700 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2">
                   <CameraOff size={20}/> Retake
                 </button>
                 <button onClick={handleAnalyzeFace} disabled={loading} className="flex-[2] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2">
                   {loading ? 'Analyzing...' : <>Analyze & Get Score <ScanFace size={20}/></>}
                 </button>
             </div>
          )}
        </div>
      )}

      {step === 4 && aiAnalysis && (
        <div className="space-y-6 animate-fade-in text-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI Trust Score Analysis</h2>
          
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
             <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-gray-700 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                <circle className={`${aiAnalysis.total > 50 ? 'text-green-500' : 'text-red-500'} stroke-current transition-all duration-1000 ease-out`} strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray={`${aiAnalysis.total * 2.51}, 251`} transform="rotate(-90 50 50)"></circle>
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${aiAnalysis.total > 50 ? 'text-green-400' : 'text-red-400'}`}>{aiAnalysis.total}</span>
                <span className="text-gray-400 text-sm">/100</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-left">
            <ScoreItem label="Duration History" score={aiAnalysis.breakdown.duration} />
            <ScoreItem label="Face Match" score={aiAnalysis.breakdown.face} />
            <ScoreItem label="Consistency" score={aiAnalysis.breakdown.consistency} />
            <ScoreItem label="Purpose Valid" score={aiAnalysis.breakdown.purpose} />
          </div>

          <div className={`p-4 rounded-xl border flex items-center gap-4 text-left transition-all ${
              aiAnalysis.status === 'Allowed' ? 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 
              aiAnalysis.status === 'Staff Verify' ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 
              'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
            }`}>
              {aiAnalysis.status === 'Allowed' && <div className="bg-green-500 p-2 rounded-full"><CheckCircle className="text-white" size={24} /></div>}
              {aiAnalysis.status === 'Staff Verify' && <div className="bg-yellow-500 p-2 rounded-full"><AlertCircle className="text-white" size={24} /></div>}
              {aiAnalysis.status === 'Denied' && <div className="bg-red-500 p-2 rounded-full"><XCircle className="text-white" size={24} /></div>}
              <div>
                <h3 className="font-bold uppercase text-lg tracking-wider">{aiAnalysis.status}</h3>
                <p className="text-sm text-white/80">
                  {aiAnalysis.status === 'Allowed' && 'Automatic Entry Granted.'}
                  {aiAnalysis.status === 'Staff Verify' && 'Manual security check required.'}
                  {aiAnalysis.status === 'Denied' && 'Entry Prohibited. Security Alerted.'}
                </p>
              </div>
          </div>

          {aiAnalysis.status === 'Denied' ? (
             <div className="mt-4 animate-bounce">
               <button onClick={() => window.location.reload()} className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 py-4 rounded-xl font-bold shadow-lg text-lg">
                 CLOSE ALERT POPUP
               </button>
             </div>
          ) : (
            <button onClick={finalize} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-4 rounded-xl font-bold shadow-lg text-lg mt-4">
              Confirm & Complete Entry
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreItem({ label, score }) {
    return (
        <div className="bg-black/30 border border-indigo-500/20 p-3 rounded-lg flex justify-between items-center">
          <span className="text-indigo-200">{label}</span> 
          <span className="text-green-400 font-mono font-bold">+{score}</span>
        </div>
    )
}

function UserKioskPage({ onComplete, onBack, isKioskMode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <button onClick={onBack} className="absolute -top-16 left-0 text-blue-200 hover:text-white flex items-center gap-2 transition bg-black/30 px-4 py-2 rounded-full backdrop-blur-md">
          <Home size={20} /> Back to Home
        </button>
        <VisitorForm onComplete={onComplete} isKiosk={true} />
      </div>
    </div>
  );
}