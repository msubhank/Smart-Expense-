import React from 'react';
import { Wallet, Sparkles, CheckCircle2 } from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="glass-card-elevated rounded-3xl p-8 max-w-lg w-full text-center space-y-5 border border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-brand-500/25">
          <Wallet size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            SmartExpense
          </h1>
          <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold uppercase tracking-wider mt-1">
            Personal Expense Tracker — Java + Firebase + React
          </p>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-left space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            <CheckCircle2 size={16} />
            <span>Phase 1 Scaffolding Complete</span>
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
            Frontend foundation, Tailwind design system, Lucide icons, and Backend Maven configuration are ready!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
