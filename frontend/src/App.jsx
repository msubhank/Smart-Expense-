import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import api from './services/api';
import { 
  Wallet, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Copy, 
  Check, 
  KeyRound, 
  Server, 
  Lock,
  Sparkles
} from 'lucide-react';

export function App() {
  const { currentUser, logout, getIdToken } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Endpoint testing states
  const [publicResponse, setPublicResponse] = useState(null);
  const [publicLoading, setPublicLoading] = useState(false);
  const [protectedResponse, setProtectedResponse] = useState(null);
  const [protectedLoading, setProtectedLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Test Public Endpoint
  async function testPublicEndpoint() {
    setPublicLoading(true);
    setPublicResponse(null);
    const start = performance.now();
    try {
      const res = await api.get('/health');
      const latency = Math.round(performance.now() - start);
      setPublicResponse({
        success: true,
        status: res.status,
        data: res.data,
        latency
      });
    } catch (err) {
      const latency = Math.round(performance.now() - start);
      setPublicResponse({
        success: false,
        status: err.response?.status || 'Network Error',
        data: err.response?.data || { error: 'Failed to connect to backend on port 8080' },
        latency
      });
    } finally {
      setPublicLoading(false);
    }
  }

  // Test Protected Endpoint
  async function testProtectedEndpoint() {
    setProtectedLoading(true);
    setProtectedResponse(null);
    const start = performance.now();
    try {
      const res = await api.get('/auth/me');
      const latency = Math.round(performance.now() - start);
      setProtectedResponse({
        success: true,
        status: res.status,
        data: res.data,
        latency
      });
    } catch (err) {
      const latency = Math.round(performance.now() - start);
      setProtectedResponse({
        success: false,
        status: err.response?.status || 'Error',
        data: err.response?.data || { error: 'Failed to reach backend' },
        latency
      });
    } finally {
      setProtectedLoading(false);
    }
  }

  // Copy raw token to clipboard
  async function handleCopyToken() {
    try {
      const token = await getIdToken();
      if (token) {
        await navigator.clipboard.writeText(token);
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
      }
    } catch (e) {
      console.error('Failed to copy token', e);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
              <Wallet size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-tight">SmartExpense</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                  Phase 2
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Firebase Auth & Spring Security JWT Bridge
              </p>
            </div>
          </div>

          {/* User Profile / Auth Action */}
          <div>
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 py-1.5 px-3 rounded-2xl">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-brand-500"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold leading-tight">
                      {currentUser.displayName || 'Authenticated User'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700/70 transition-all cursor-pointer"
                  title="Sign out"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-brand-500/25 transition-all cursor-pointer"
              >
                <LogIn size={15} />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Reminder Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-300">
          <KeyRound size={18} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-800 dark:text-amber-200">
              Firebase Credentials Ready Whenever You Are
            </p>
            <p className="text-[11px] text-amber-700/90 dark:text-amber-400/90 leading-relaxed">
              When you are ready to connect to your live Firebase project, paste your Web config keys into <code className="px-1.5 py-0.5 bg-amber-500/10 rounded font-mono font-semibold">frontend/.env</code> and place your Admin SDK key at <code className="px-1.5 py-0.5 bg-amber-500/10 rounded font-mono font-semibold">backend/src/main/resources/serviceAccountKey.json</code>.
            </p>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Frontend Auth State */}
          <div className="glass-card-elevated rounded-3xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">1. Frontend Firebase Auth</h3>
                  <p className="text-[11px] text-slate-500">Client-side login state & ID token</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                currentUser 
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {currentUser ? <CheckCircle2 size={12} /> : <Lock size={12} />}
                {currentUser ? 'AUTHENTICATED' : 'ANONYMOUS'}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">User Status:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {currentUser ? 'Logged In' : 'Not Logged In'}
                </span>
              </div>
              {currentUser && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">UID:</span>
                    <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                      {currentUser.uid}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Email:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {currentUser.email}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {currentUser ? (
                <button
                  onClick={handleCopyToken}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                >
                  {copiedToken ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copiedToken ? 'Token Copied!' : 'Copy Firebase ID Token (JWT)'}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <LogIn size={14} />
                  <span>Sign In or Register Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Backend Spring Security Status */}
          <div className="glass-card-elevated rounded-3xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Server size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">2. Spring Boot Security Filter</h3>
                  <p className="text-[11px] text-slate-500">Stateless JWT validation filter</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                PORT 8080
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Public Endpoint:</span>
                <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">/api/health (Permitted)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Protected Endpoint:</span>
                <span className="font-mono text-[11px] text-brand-600 dark:text-brand-400">/api/auth/me (JWT Required)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Filter Order:</span>
                <span className="font-medium text-slate-600 dark:text-slate-400 text-[11px]">FirebaseFilter ➔ SecurityFilterChain</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              When React calls an endpoint, Axios intercepts the request and automatically sets <code className="font-mono text-[10px] text-brand-500">Authorization: Bearer &lt;token&gt;</code>.
            </p>
          </div>
        </div>

        {/* Interactive Verification Section */}
        <div className="glass-card-elevated rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h2 className="text-base font-extrabold flex items-center gap-2">
              <Sparkles size={18} className="text-brand-500" />
              <span>Interactive Verification Playground</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Execute live HTTP calls from this React UI to the Spring Boot backend to verify public and protected security rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test 1: Public Call */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Test A: Public Health Check
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  GET /api/health
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tests if the Spring Boot server is alive and CORS is working. Requires no authentication.
              </p>
              <button
                onClick={testPublicEndpoint}
                disabled={publicLoading}
                className="w-full py-2 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {publicLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Send Public Request</span>
                  </>
                )}
              </button>

              {publicResponse && (
                <div className="mt-3 p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className={`font-bold flex items-center gap-1 ${
                      publicResponse.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {publicResponse.success ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      HTTP {publicResponse.status}
                    </span>
                    <span className="text-slate-400">{publicResponse.latency}ms</span>
                  </div>
                  <pre className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-[10px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
                    {JSON.stringify(publicResponse.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Test 2: Protected Call */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Test B: Protected User Verification
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                  GET /api/auth/me
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sends the Firebase JWT in the Bearer header. Spring Security verifies it and returns the AuthenticatedUser principal.
              </p>
              <button
                onClick={testProtectedEndpoint}
                disabled={protectedLoading}
                className="w-full py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-md shadow-brand-500/20"
              >
                {protectedLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock size={13} />
                    <span>Send Protected Request</span>
                  </>
                )}
              </button>

              {protectedResponse && (
                <div className="mt-3 p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className={`font-bold flex items-center gap-1 ${
                      protectedResponse.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {protectedResponse.success ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      HTTP {protectedResponse.status}
                    </span>
                    <span className="text-slate-400">{protectedResponse.latency}ms</span>
                  </div>
                  <pre className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-[10px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
                    {JSON.stringify(protectedResponse.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;
