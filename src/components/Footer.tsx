import React from 'react';
import { Dumbbell, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="no-print bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                FitBuddy<span className="text-emerald-600">-AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Personalized fitness plan generator powered by Google Gemini AI. Crafted for BSc Computer Science final capstone showcase.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe, evidence-informed guidance & privacy-focused design.</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-700 transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('generate')} className="hover:text-emerald-700 transition-colors cursor-pointer">
                  Generate Fitness Plan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-emerald-700 transition-colors cursor-pointer">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('users')} className="hover:text-emerald-700 transition-colors cursor-pointer">
                  FitBuddy Users
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-700 transition-colors cursor-pointer">
                  About & Tech Stack
                </button>
              </li>
            </ul>
          </div>

          {/* Goals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Fitness Targets</h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>Weight Loss Roadmaps</li>
              <li>Hypertrophy & Muscle Gain</li>
              <li>Lean Weight Building</li>
              <li>Mobility & General Fitness</li>
              <li>7-Day Split Schedules</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FitBuddy-AI. General fitness & educational purposes only.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for BSc Computer Science
          </p>
        </div>
      </div>
    </footer>
  );
};
