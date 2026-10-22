import React from 'react';
import { BookOpen, BarChart3, Mic, PenTool, Sparkles, Globe, LogIn, LogOut, User, CheckCircle2 } from 'lucide-react';
import type { FirebaseUser } from '../lib/firebase';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: FirebaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
  targetBand: number;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onLogin,
  onLogout,
  targetBand,
}: NavbarProps) {
  const navItems = [
    { id: 'cambridge', label: 'Cambridge Books 1-19', icon: BookOpen },
    { id: 'writing', label: 'AI Writing Evaluator', icon: PenTool },
    { id: 'speaking', label: 'Speaking Studio', icon: Mic },
    { id: 'dashboard', label: 'Progress & Analytics', icon: BarChart3 },
    { id: 'intel', label: 'Exam Trends & Intel', icon: Globe },
    { id: '3d-hall', label: '3D Exam Hall', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('cambridge')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20 font-black text-white text-lg">
              IR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight">IELTS<span className="text-red-500">Ready</span></span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/60">
                  Academic
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Cambridge Official Mock Suite</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile / Authentication */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs text-amber-400 font-semibold">
              <span className="text-slate-400 font-normal">Target:</span> Band {targetBand.toFixed(1)}
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-800/90 pl-2 pr-3 py-1 rounded-full border border-slate-700">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-200 max-w-[100px] truncate">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700/80 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/25 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Google Sign-In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
