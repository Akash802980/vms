import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { 
  Camera, Shield, Users, BarChart3, LogOut, 
  UserPlus, Home, QrCode, 
  AlertCircle, CheckCircle, XCircle, 
  LayoutDashboard, FilePlus, Settings, HelpCircle, 
  RefreshCw, CameraOff, FileText, Smartphone, ScanFace 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- ⚠️ PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE ---
const GOOGLE_SCRIPT_URL = "PASTE_YOUR_WEB_APP_URL_HERE"; 

// --- MOCK DATA ---
const MOCK_DB = {
  regularVisitors: ['9876', '1234'],
};

const MOCK_ANALYTICS_DATA = {
  dailyTrend: [
    { name: 'Mon', visitors: 12 }, { name: 'Tue', visitors: 19 },
    { name: 'Wed', visitors: 15 }, { name: 'Thu', visitors: 22 },
    { name: 'Fri', visitors: 30 }, { name: 'Sat', visitors: 45 },
    { name: 'Sun', visitors: 38 },
  ],
  purposeDistribution: [
    { name: 'Meeting', value: 45 }, { name: 'Interview', value: 20 },
    { name: 'Delivery', value: 15 }, { name: 'Personal', value: 20 },
  ],
  COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
};

// --- MAIN APP COMPONENT ---
export default function SVIMS() {
  const [currentRoute, setCurrentRoute] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load Data from Google Sheets
  useEffect(() => {
    if (isAuthenticated) {
      fetchVisitors();
    }
  }, [isAuthenticated]);

  const fetchVisitors = async () => {
    if (GOOGLE_SCRIPT_URL === "PASTE_YOUR_WEB_APP_URL_HERE") return;
    
    setIsLoadingData(true);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setVisitors(data.reverse());
      }
    } catch (error) {
      console.error("Error fetching sheet data:", error);
    }
    setIsLoadingData(false);
  };

  const handleNewVisitor = async (visitorData) => {
    // 1. Update UI immediately
    setVisitors([visitorData, ...visitors]);

    // 2. Send to Google Sheet
    if (GOOGLE_SCRIPT_URL !== "PASTE_YOUR_WEB_APP_URL_HERE") {
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(visitorData)
            });
            console.log("Sent to Google Sheets");
        } catch (error) {
            console.error("Error sending to sheet:", error);
        }
    }
  };

  return (
    <div className="min-h-screen text-white font-sans relative overflow-x-hidden bg-[#1a1a2e]">
      {/* Global Background */}
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
            isLoading={isLoadingData}
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

// --- LOGIN PAGE (Fixed QR Code Link) ---
function LoginPage({ onLogin, onVisitorEntry }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState('');

  // Your deployed website URL for the QR Code
  const SITE_URL = "https://vmsaki.vercel.app/";

  const handleLoginClick = () => {
    if (username === 'admin' && password === 'admin123') {
      setError('');
      onLogin(true);
    } else {
      setError('❌ Access Denied! Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold leading-tight drop-shadow-lg">SVIMS<br/><span className="text-blue-400">Secure Access</span></h1>
          <p className="text-xl text-blue-200">Smart Visitor Intelligent Management System</p>
          
          <button 
            onClick={() => setShowQR(!showQR)}
            className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-md px-6 py-3 rounded-xl font-bold transition border border-blue-500/30"
          >
            <QrCode /> {showQR ? 'Hide QR Code' : 'Generate QR Code'}
          </button>
          
          {/* UPDATED QR CODE LOGIC */}
          {showQR && (
            <div className="bg-white p-4 rounded-xl w-fit animate-fade-in shadow-2xl">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${SITE_URL}`} 
                alt="Scan to Open Portal"
                className="w-[150px] h-[150px]"
              />
              <p className="text-black text-xs text-center mt-2 font-mono font-bold">Scan to Open App</p>
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="text-blue-400" /> Admin Login
          </h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-lg mb-4 text-red-200 text-sm font-bold flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm text-blue-200 ml-1 mb-1 block">Username</label>
              <input 
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/20 border border-blue-500/30 rounded-xl p-3 focus:border-blue-400 outline-none transition text-white"
              />
            </div>
            <div>
              <label className="text-sm text-blue-200 ml-1 mb-1 block">Password</label>
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-blue-500/30 rounded-xl p-3 focus:border-blue-400 outline-none transition text-white"
              />
            </div>
            <button 
              onClick={handleLoginClick}
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
function DashboardLayout({ onLogout, visitors, onAddVisitor, isLoading }) {
  const [activeTab, setActiveTab] = useState('overview');
  const btnClass = (tabName) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === tabName ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-blue-200 hover:bg-white/5'}`;

  return (
    <div className="flex h-screen overflow-hidden bg-black/20 backdrop-blur-lg">
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col pt-6">
        <div className="px-6 mb-8">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">SVIMS Admin</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={btnClass('overview')}><LayoutDashboard size={20} /> Overview</button>
          <button onClick={() => setActiveTab('new-entry')} className={btnClass('new-entry')}><FilePlus size={20} /> New Entry</button>
          <button onClick={() => setActiveTab('analytics')} className={btnClass('analytics')}><BarChart3 size={20} /> Analytics</button>
          <button onClick={() => setActiveTab('config')} className={btnClass('config')}><Settings size={20} /> Config</button>
          <button onClick={() => setActiveTab('faq')} className={btnClass('faq')}><HelpCircle size={20} /> FAQ</button>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-2 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg transition"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            </header>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-md p-6 rounded-3xl border border-blue-500/30 shadow-xl flex justify-between items-center">
                 <div><p className="text-blue-200 mb-1">Total Visitors</p><h3 className="text-4xl font-bold">{visitors.length}</h3></div>
                 <div className="p-4 bg-blue-600/80 rounded-2xl"><Users size={28}/></div>
              </div>
              <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 backdrop-blur-md p-6 rounded-3xl border border-green-500/30 shadow-xl flex justify-between items-center">
                 <div><p className="text-green-200 mb-1">Allowed</p><h3 className="text-4xl font-bold">{visitors.filter(v => v.status === 'Allowed').length}</h3></div>
                 <div className="p-4 bg-green-600/80 rounded-2xl"><CheckCircle size={28}/></div>
              </div>
              <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 backdrop-blur-md p-6 rounded-3xl border border-yellow-500/30 shadow-xl flex justify-between items-center">
                 <div><p className="text-yellow-200 mb-1">Pending</p><h3 className="text-4xl font-bold">{visitors.filter(v => v.status === 'Staff Verify').length}</h3></div>
                 <div className="p-4 bg-yellow-600/80 rounded-2xl"><AlertCircle size={28}/></div>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden mt-8">
              <div className="p-6 border-b border-white/10 flex justify-between">
                <h3 className="text-xl font-bold">Visitor Logs {isLoading && <span className="text-sm text-blue-400 animate-pulse">(Syncing...)</span>}</h3>
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
                  {visitors.map((v, i) => (
                    <tr key={v.id || i} className="hover:bg-white/5 transition">
                      <td className="p-4 font-medium">{v.name}</td>
                      <td className="p-4 font-mono text-gray-400">{v.aadhaar}</td>
                      <td className="p-4 text-gray-300">{v.purpose}</td>
                      <td className="p-4 text-gray-300">{v.time}</td>
                      <td className="p-4 font-bold">{v.score}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${v.status === 'Allowed' ? 'bg-green-500/20 border-green-500/50 text-green-400' : v.status === 'Staff Verify' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>{v.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'new-entry' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
             <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setActiveTab('overview')} className="p-2 hover:bg-white/10 rounded-lg"><Home size={20} /></button>
                <h1 className="text-3xl font-bold">Manual Entry</h1>
             </div>
             <VisitorForm onComplete={(data) => { onAddVisitor(data); setActiveTab('overview'); alert(`Entry Processed: ${data.status}`); }} isKiosk={false} />
          </div>
        )}

        {activeTab === 'analytics' && (
           <div className="space-y-6 animate-fade-in">
             <h1 className="text-3xl font-bold mb-6">Analytics & Reports</h1>
             <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                 <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BarChart3 size={20}/> Weekly Trend</h3>
                 <div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={MOCK_ANALYTICS_DATA.dailyTrend}><CartesianGrid strokeDasharray="3 3" stroke="#444" /><XAxis dataKey="name" stroke="#aaa" /><YAxis stroke="#aaa" /><Tooltip contentStyle={{backgroundColor: '#333', border: 'none'}} itemStyle={{color: '#fff'}}/><Line type="monotone" dataKey="visitors" stroke="#8884d8" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
               </div>
               <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                 <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText size={20}/> Purpose</h3>
                 <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={MOCK_ANALYTICS_DATA.purposeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" label>{MOCK_ANALYTICS_DATA.purposeDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={MOCK_ANALYTICS_DATA.COLORS[index % MOCK_ANALYTICS_DATA.COLORS.length]} />))}</Pie><Tooltip contentStyle={{backgroundColor: '#333', border: 'none'}} /><Legend /></PieChart></ResponsiveContainer></div>
               </div>
             </div>
           </div>
        )}
        
        {activeTab === 'faq' && <div className="space-y-4"><h1 className="text-3xl font-bold">FAQ</h1><div className="bg-black/40 p-6 rounded-xl border border-white/10"><p className="text-gray-300">How is Score Calculated? <br/>Duration + Face Match + Consistency + Purpose</p></div></div>}
        {activeTab === 'config' && <div className="space-y-4"><h1 className="text-3xl font-bold">Config</h1><div className="bg-black/40 p-6 rounded-xl border border-white/10"><p className="text-gray-300">Thresholds: Allow {'>'} 80, Deny {'<'} 50</p></div></div>}

      </main>
    </div>
  );
}

// --- VISITOR FORM ---
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
  const handleSendOTP = async () => { setLoading(true); await new Promise(r => setTimeout(r, 800)); setLoading(false); nextStep(); };
  const handleVerifyOTP = async () => { setLoading(true); await new Promise(r => setTimeout(r, 800)); setLoading(false); nextStep(); };
  
  const capturePhoto = useCallback(() => { const imageSrc = webcamRef.current.getScreenshot(); setCapturedImage(imageSrc); }, [webcamRef]);
  const retakePhoto = () => setCapturedImage(null);

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
    setAiAnalysis({ breakdown: { duration: durationScore, face: normFaceScore, consistency: consistencyScore, purpose: purposeScore }, total, status });
    setLoading(false);
    nextStep();
  };

  const finalize = () => { onComplete({ id: Date.now(), ...formData, score: aiAnalysis.total, status: aiAnalysis.status, photo: capturedImage }); };

  return (
    <div className={`bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl ${isKiosk ? 'max-w-md w-full' : 'w-full'}`}>
      <div className="flex justify-between mb-8">{[1, 2, 3, 4].map(i => (<div key={i} className={`h-1.5 flex-1 mx-1 rounded-full transition-all ${i <= step ? 'bg-blue-500' : 'bg-white/10'}`} />))}</div>
      
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Visitor Details</h2>
          <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/30 border border-indigo-500/30 rounded-xl p-4 text-white" placeholder="Full Name" />
          <div className="grid grid-cols-2 gap-4">
              <input value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})} className="w-full bg-black/30 border border-indigo-500/30 rounded-xl p-4 text-white" placeholder="Aadhaar" />
              <input value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full bg-black/30 border border-indigo-500/30 rounded-xl p-4 text-white" placeholder="Mobile" />
          </div>
          <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-black/30 border border-indigo-500/30 rounded-xl p-4 text-white" placeholder="Address" />
          <div className="grid grid-cols-2 gap-4">
            <input value={formData.visitPerson} onChange={e => setFormData({...formData, visitPerson: e.target.value})} className="w-full bg-black/30 border border-indigo-500/30 rounded-xl p-4 text-white" placeholder="Whom to Visit" />
            <select value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="w-full bg-black/30 border border-indigo-500/30 rounded-xl p-4 text-white bg-gray-900"><option>Meeting</option><option>Interview</option><option>Delivery</option><option>Personal</option></select>
          </div>
          <button onClick={handleSendOTP} disabled={!formData.aadhaar || loading} className="w-full bg-blue-600 py-4 rounded-xl font-bold mt-4">{loading ? 'Sending...' : 'Send OTP'}</button>
        </div>
      )}

      {step === 2 && <div className="space-y-6 text-center"><h2 className="text-2xl font-bold">OTP Verification</h2><p className="text-blue-200">Enter code sent to mobile</p><input className="w-40 bg-black/30 border border-blue-500/50 rounded-xl p-4 text-center text-2xl mx-auto block text-white" placeholder="XXXX" /><button onClick={handleVerifyOTP} className="w-full bg-green-600 py-4 rounded-xl font-bold">Verify</button></div>}

      {step === 3 && (
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-bold">Face Verification</h2>
          <div className="relative w-full h-72 bg-black rounded-2xl overflow-hidden flex items-center justify-center border-2 border-blue-500/50">
             {!capturedImage ? <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="absolute inset-0 w-full h-full object-cover" /> : <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />}
          </div>
          {!capturedImage ? <button onClick={capturePhoto} className="w-full bg-blue-600 py-4 rounded-xl font-bold">Capture Photo</button> : <div className="flex gap-3"><button onClick={retakePhoto} className="flex-1 bg-gray-600 py-4 rounded-xl font-bold">Retake</button><button onClick={handleAnalyzeFace} className="flex-[2] bg-blue-600 py-4 rounded-xl font-bold">{loading ? 'Analyzing...' : 'Analyze Face'}</button></div>}
        </div>
      )}

      {step === 4 && aiAnalysis && (
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-bold">Trust Score: {aiAnalysis.total}/100</h2>
          <div className="grid grid-cols-2 gap-3 text-sm text-left">
            <div className="bg-black/30 p-3 rounded flex justify-between"><span>Duration</span> <span className="text-green-400">+{aiAnalysis.breakdown.duration}</span></div>
            <div className="bg-black/30 p-3 rounded flex justify-between"><span>Face</span> <span className="text-green-400">+{aiAnalysis.breakdown.face}</span></div>
            <div className="bg-black/30 p-3 rounded flex justify-between"><span>Consistency</span> <span className="text-green-400">+{aiAnalysis.breakdown.consistency}</span></div>
            <div className="bg-black/30 p-3 rounded flex justify-between"><span>Purpose</span> <span className="text-green-400">+{aiAnalysis.breakdown.purpose}</span></div>
          </div>
          <div className={`p-4 rounded-xl border flex items-center gap-4 text-left ${aiAnalysis.status === 'Allowed' ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`}>
              <div><h3 className="font-bold uppercase">{aiAnalysis.status}</h3><p className="text-xs">{aiAnalysis.status === 'Denied' ? 'Entry Prohibited.' : 'Entry Granted.'}</p></div>
          </div>
          {aiAnalysis.status === 'Denied' ? <button onClick={() => window.location.reload()} className="w-full bg-red-600 py-4 rounded-xl font-bold animate-bounce">CLOSE POPUP</button> : <button onClick={finalize} className="w-full bg-blue-600 py-4 rounded-xl font-bold">Confirm Entry</button>}
        </div>
      )}
    </div>
  );
}

function UserKioskPage({ onComplete, onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <button onClick={onBack} className="absolute -top-16 left-0 text-white bg-black/30 px-4 py-2 rounded-full backdrop-blur-md">Back</button>
        <VisitorForm onComplete={onComplete} isKiosk={true} />
      </div>
    </div>
  );
}
