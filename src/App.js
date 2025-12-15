import React, { useState, useEffect } from 'react';
import { 
  Camera, Shield, Users, Clock, BarChart3, LogOut, 
  UserPlus, Home, QrCode, Fingerprint, 
  AlertCircle, CheckCircle, XCircle, Smartphone, 
  LayoutDashboard, FilePlus, Settings, HelpCircle, FileText
} from 'lucide-react';

// --- CONFIGURATION ---
const MOCK_DB = {
  regularVisitors: ['9876', '1234'], // Aadhaar last 4 digits representing regulars
  blockedVisitors: ['0000']
};

// --- MAIN APP COMPONENT ---
export default function SVIMS() {
  const [currentRoute, setCurrentRoute] = useState('login'); // 'login', 'dashboard', 'user-kiosk'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Centralized State for Visitors
  const [visitors, setVisitors] = useState([
    { id: 1, name: 'Amit Singh', aadhaar: '9876', time: '09:15 AM', score: 85, status: 'Allowed', purpose: 'Meeting' },
    { id: 2, name: 'Rahul Verma', aadhaar: '3456', time: '10:20 AM', score: 60, status: 'Staff Verify', purpose: 'Delivery' }
  ]);

  const handleNewVisitor = (visitorData) => {
    setVisitors([visitorData, ...visitors]);
  };

  return (
    <div className="min-h-screen text-white font-sans relative overflow-x-hidden">
      {/* --- 1. GLOBAL BACKGROUND THEME (Applied Everywhere) --- */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) contrast(1.2)'
        }}
      />

      {/* Content Wrapper */}
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
            onAddVisitor={handleNewVisitor} // Pass function to allow Admin to add
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
          <h1 className="text-6xl font-bold leading-tight drop-shadow-lg">SVIMS<br/><span className="text-pink-500">Secure Access</span></h1>
          <p className="text-xl text-gray-300">Smart Visitor Intelligent Management System</p>
          
          <button 
            onClick={() => setShowQR(!showQR)}
            className="flex items-center gap-2 bg-pink-600/80 hover:bg-pink-600 backdrop-blur-md px-6 py-3 rounded-xl font-bold transition border border-pink-500/30"
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
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="text-pink-500" /> Admin Login
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 ml-1">Username</label>
              <input 
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-pink-500 outline-none transition text-white"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 ml-1">Password</label>
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-pink-500 outline-none transition text-white"
                placeholder="••••••"
              />
            </div>
            <button 
              onClick={() => onLogin(true)}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-3 rounded-xl font-bold hover:scale-105 transition shadow-lg"
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
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'new-entry', 'analytics', 'faq', 'config'

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Sidebar - Glass Effect */}
      <aside className="w-64 bg-black/60 backdrop-blur-xl border-r border-white/10 flex flex-col pt-6">
        <div className="px-6 mb-8">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            SVIMS Admin
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'overview' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
            <LayoutDashboard size={20} /> Overview
          </button>
          
          <button onClick={() => setActiveTab('new-entry')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'new-entry' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
            <FilePlus size={20} /> New Entry
          </button>

          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'analytics' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
            <BarChart3 size={20} /> Analytics
          </button>

          <button onClick={() => setActiveTab('config')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'config' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
            <Settings size={20} /> Config
          </button>

          <button onClick={() => setActiveTab('faq')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'faq' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
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
                <p className="text-gray-400">Welcome back, Admin</p>
              </div>
            </header>

            {/* Stats Cards - Large & Colorful */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-600/30 to-blue-900/30 backdrop-blur-md p-8 rounded-3xl border border-blue-500/30 shadow-xl transform hover:scale-105 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-200 font-medium mb-2">Total Visitors</p>
                    <h3 className="text-5xl font-bold text-white">{visitors.length}</h3>
                  </div>
                  <div className="p-4 bg-blue-500 rounded-2xl text-white shadow-lg"><Users size={32}/></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-600/30 to-green-900/30 backdrop-blur-md p-8 rounded-3xl border border-green-500/30 shadow-xl transform hover:scale-105 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-green-200 font-medium mb-2">Allowed Entry</p>
                    <h3 className="text-5xl font-bold text-white">
                      {visitors.filter(v => v.status === 'Allowed').length}
                    </h3>
                  </div>
                  <div className="p-4 bg-green-500 rounded-2xl text-white shadow-lg"><CheckCircle size={32}/></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-600/30 to-yellow-900/30 backdrop-blur-md p-8 rounded-3xl border border-yellow-500/30 shadow-xl transform hover:scale-105 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-yellow-200 font-medium mb-2">Pending / Review</p>
                    <h3 className="text-5xl font-bold text-white">
                      {visitors.filter(v => v.status === 'Staff Verify').length}
                    </h3>
                  </div>
                  <div className="p-4 bg-yellow-500 rounded-2xl text-white shadow-lg"><AlertCircle size={32}/></div>
                </div>
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden mt-8">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold">Visitor Logs</h3>
                <button className="text-sm text-pink-400 hover:text-pink-300">Download Report</button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4 text-gray-400 text-sm">Name</th>
                    <th className="p-4 text-gray-400 text-sm">Aadhaar</th>
                    <th className="p-4 text-gray-400 text-sm">Purpose</th>
                    <th className="p-4 text-gray-400 text-sm">Time</th>
                    <th className="p-4 text-gray-400 text-sm">Score</th>
                    <th className="p-4 text-gray-400 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {visitors.map((v) => (
                    <tr key={v.id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-medium">{v.name}</td>
                      <td className="p-4 font-mono text-gray-400">{v.aadhaar}</td>
                      <td className="p-4 text-gray-300">{v.purpose}</td>
                      <td className="p-4 text-gray-300">{v.time}</td>
                      <td className="p-4">
                        <span className={`font-bold ${v.score > 80 ? 'text-green-400' : v.score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {v.score}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${
                          v.status === 'Allowed' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 
                          v.status === 'Staff Verify' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 
                          'bg-red-500/10 border-red-500/30 text-red-400'
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

        {/* NEW ENTRY TAB (Internal) */}
        {activeTab === 'new-entry' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
             <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setActiveTab('overview')} className="p-2 hover:bg-white/10 rounded-lg">
                  <Home size={20} />
                </button>
                <h1 className="text-3xl font-bold">Manual Visitor Entry</h1>
             </div>
             <VisitorForm 
               onComplete={(data) => {
                 onAddVisitor(data);
                 setActiveTab('overview');
                 alert(`Visitor Entry: ${data.status}`);
               }}
               isKiosk={false}
             />
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold">Analytics & Reports</h1>
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 h-64 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <BarChart3 size={48} className="mx-auto mb-2 text-pink-500 opacity-50"/>
                <p>Visitor trends and graphical reports will appear here.</p>
              </div>
            </div>
          </div>
        )}

        {/* CONFIG TAB */}
        {activeTab === 'config' && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold">System Configuration</h1>
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-xl font-bold border-b border-white/10 pb-2">Trust Score Thresholds</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm text-gray-400">Auto Allow Score</label>
                   <input type="number" defaultValue={80} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 mt-1"/>
                 </div>
                 <div>
                   <label className="block text-sm text-gray-400">Deny Score</label>
                   <input type="number" defaultValue={50} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 mt-1"/>
                 </div>
              </div>
              <button className="bg-pink-600 px-4 py-2 rounded-lg font-bold">Save Settings</button>
            </div>
          </div>
        )}

        {/* FAQ TAB */}
        {activeTab === 'faq' && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
            <div className="space-y-4">
              <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <h3 className="font-bold text-pink-400 mb-2">How is Trust Score Calculated?</h3>
                <p className="text-gray-300">It is based on 4 parameters: Visitor Duration, Face Match, Consistency, and Purpose Validity.</p>
              </div>
              <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <h3 className="font-bold text-pink-400 mb-2">What happens if entry is denied?</h3>
                <p className="text-gray-300">A security popup alert is generated on the portal and the guard is notified.</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// --- REUSABLE VISITOR FORM (Used by Kiosk AND Dashboard) ---
function VisitorForm({ onComplete, isKiosk }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', aadhaar: '', mobile: '', purpose: 'Meeting', 
    address: '', visitPerson: '', timeIn: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  });
  const [aiAnalysis, setAiAnalysis] = useState(null);

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

  // 3. Face Scan (Camera Access)
  const handleFaceScan = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    
    // Face Match Logic: Regular vs New
    const isRegular = MOCK_DB.regularVisitors.includes(formData.aadhaar.slice(-4));
    
    // Regular gets high match score, New gets lower (approx 50 as per note)
    const detectedScore = isRegular ? 85 : 55;
    
    // Calculate Final 4-Parameter Score
    // Q1: Duration (Mocked as 25 for demo)
    const durationScore = 25; 
    
    // Q2: Face Score (Max 25)
    const normFaceScore = Math.min(25, Math.round(detectedScore * 0.25));
    
    // Q3: Consistency (Regular=25, New=10)
    const consistencyScore = isRegular ? 25 : 10;
    
    // Q4: Purpose (Meeting/Interview=25, Others=15)
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
      purpose: formData.purpose
    });
  };

  return (
    <div className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl ${isKiosk ? 'max-w-md w-full' : 'w-full'}`}>
      
      {/* Step Indicators */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map(i => (
           <div key={i} className={`h-1.5 flex-1 mx-1 rounded-full transition-all ${i <= step ? 'bg-pink-500' : 'bg-white/10'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">{isKiosk ? 'Visitor Registration' : 'Enter Visitor Details'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-pink-500 outline-none text-white" 
              placeholder="Full Name"
            />
            <input 
              value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-pink-500 outline-none text-white" 
              placeholder="Aadhaar Number"
            />
            <input 
              value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-pink-500 outline-none text-white" 
              placeholder="Phone Number"
            />
            <input 
              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-pink-500 outline-none text-white" 
              placeholder="Address"
            />
            <input 
              value={formData.visitPerson} onChange={e => setFormData({...formData, visitPerson: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-pink-500 outline-none text-white" 
              placeholder="Whom to Visit"
            />
            <select 
              value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-pink-500 outline-none text-white bg-gray-900" 
            >
              <option value="Meeting">Meeting</option>
              <option value="Interview">Interview</option>
              <option value="Delivery">Delivery</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
          
          <div className="bg-white/5 p-3 rounded-xl text-gray-400 text-sm flex justify-between">
            <span>Time In:</span> <span className="text-white font-mono">{formData.timeIn}</span>
          </div>

          <button onClick={handleSendOTP} disabled={!formData.aadhaar || loading} className="w-full bg-pink-600 hover:bg-pink-700 py-3 rounded-xl font-bold mt-4">
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 text-center animate-fade-in">
          <h2 className="text-2xl font-bold">OTP Verification</h2>
          <p className="text-gray-400">Enter code sent to {formData.mobile}</p>
          <input type="text" placeholder="XXXX" className="w-32 bg-white/5 border border-white/20 rounded-xl p-3 text-center text-2xl tracking-widest mx-auto block text-white" />
          <button onClick={handleVerifyOTP} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 text-center animate-fade-in">
          <h2 className="text-2xl font-bold">Face Verification</h2>
          <div className="relative w-full h-64 bg-black/50 rounded-2xl overflow-hidden border border-pink-500/30 flex items-center justify-center">
            {loading && <div className="absolute inset-0 bg-green-500/20 animate-pulse z-10" />}
            
            {/* Camera Viewfinder UI */}
            <div className="absolute inset-0 border-2 border-white/10 m-4 rounded-xl">
               <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-pink-500 rounded-tl-xl"></div>
               <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-pink-500 rounded-tr-xl"></div>
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-pink-500 rounded-bl-xl"></div>
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-pink-500 rounded-br-xl"></div>
            </div>
            
            <Camera size={48} className="text-gray-500" />
            <p className="absolute bottom-4 text-white/50 text-sm">Align face within frame</p>
          </div>
          <button onClick={handleFaceScan} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold">
            {loading ? 'Analyzing...' : 'Capture & Scan'}
          </button>
        </div>
      )}

      {step === 4 && aiAnalysis && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-center">AI Trust Score Analysis</h2>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
              <span>Visitor Duration</span> 
              <span className="text-green-400 font-mono">+{aiAnalysis.breakdown.duration}</span>
            </div>
            <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
              <span>Face Match</span> 
              <span className="text-green-400 font-mono">+{aiAnalysis.breakdown.face}</span>
            </div>
            <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
              <span>Consistency</span> 
              <span className="text-green-400 font-mono">+{aiAnalysis.breakdown.consistency}</span>
            </div>
            <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
              <span>Purpose Valid</span> 
              <span className="text-green-400 font-mono">+{aiAnalysis.breakdown.purpose}</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-white/10 pt-2">
            <span className="font-bold">Total Score</span>
            <span className={`text-3xl font-bold ${aiAnalysis.total > 50 ? 'text-green-400' : 'text-red-400'}`}>{aiAnalysis.total}/100</span>
          </div>

          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
              aiAnalysis.status === 'Allowed' ? 'bg-green-500/20 border-green-500' : 
              aiAnalysis.status === 'Staff Verify' ? 'bg-yellow-500/20 border-yellow-500' : 
              'bg-red-500/20 border-red-500'
            }`}>
              {aiAnalysis.status === 'Allowed' && <CheckCircle className="text-green-500" size={32} />}
              {aiAnalysis.status === 'Staff Verify' && <AlertCircle className="text-yellow-500" size={32} />}
              {aiAnalysis.status === 'Denied' && <XCircle className="text-red-500" size={32} />}
              <div>
                <h3 className="font-bold uppercase text-lg">{aiAnalysis.status}</h3>
                <p className="text-xs text-white/70">
                  {aiAnalysis.status === 'Allowed' && 'Safe to Enter.'}
                  {aiAnalysis.status === 'Staff Verify' && 'Manual Check Required.'}
                  {aiAnalysis.status === 'Denied' && 'Entry Prohibited. Security Alerted.'}
                </p>
              </div>
          </div>

          {/* Logic: Popup/Notification for Denied */}
          {aiAnalysis.status === 'Denied' ? (
             <div className="mt-2 animate-bounce">
               <button onClick={() => window.location.reload()} className="w-full bg-red-600 py-3 rounded-xl font-bold shadow-lg shadow-red-500/50">
                 CLOSE POPUP
               </button>
             </div>
          ) : (
            <button onClick={finalize} className="w-full bg-pink-600 hover:bg-pink-700 py-3 rounded-xl font-bold shadow-lg shadow-pink-500/30">
              Confirm Entry
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// --- USER KIOSK PAGE (Tablet Mode) ---
function UserKioskPage({ onComplete, onBack, isKioskMode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <button onClick={onBack} className="absolute -top-12 left-0 text-white/50 hover:text-white flex items-center gap-2 transition">
          <Home size={20} /> Back to Home
        </button>
        <VisitorForm onComplete={onComplete} isKiosk={true} />
      </div>
    </div>
  );
}