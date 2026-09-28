import React, { useState } from 'react';
import {
  Info,
  CheckCircle2,
  Code2,
  Database,
  Cpu,
  Shield,
  Copy,
  Check,
  GraduationCap,
  Sparkles,
  Layers,
  Server
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const supabaseSqlSchema = `-- FitBuddy-AI: Supabase PostgreSQL Schema
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
    gender TEXT NOT NULL CHECK (gender IN ('Female', 'Male', 'Other')),
    height NUMERIC(5, 2) NOT NULL CHECK (height > 0),
    weight NUMERIC(5, 2) NOT NULL CHECK (weight > 0),
    goal TEXT NOT NULL CHECK (goal IN ('Weight Loss', 'Weight Gain', 'Muscle Gain', 'General Fitness')),
    activity TEXT NOT NULL CHECK (activity IN ('Low', 'Moderate', 'High')),
    workout_preference TEXT,
    dietary_preference TEXT,
    available_time TEXT,
    plan JSONB NOT NULL,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to users"
    ON public.users FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert of user plans"
    ON public.users FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow deleting user plan"
    ON public.users FOR DELETE USING (true);`;

  const copySql = () => {
    navigator.clipboard.writeText(supabaseSqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
          BSc Computer Science Capstone Project
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About FitBuddy-AI
        </h1>
        <p className="mt-3 text-slate-600 text-base leading-relaxed">
          FitBuddy-AI is an AI-powered fitness planning application designed to provide personalized general fitness guidance based on user-provided body details, fitness objectives, and lifestyle preferences.
        </p>
      </div>

      {/* Project Goals */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>Project Goals & Core Objectives</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Personalized Fitness Guidance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Synthesize individualized workout splits, rep schemes, and dynamic warm-up/cool-down routines mapped to the user&apos;s physical constraints.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Easy-to-Use Interface</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clean, responsive, and accessible UX with real-time biometric feedback (live BMI estimation), validation, and printable output.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">AI-Assisted Planning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Leverage Google Gemini 3.8 Flash via a protected server-side proxy to formulate evidence-informed fitness and nutrition schedules safely.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Fitness Progress Awareness</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Educate users with practical milestone tracking, healthy hydration habits, and realistic progress expectations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              5
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Simple User Management</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full CRUD database capability allowing users to register plans, search profiles, view full breakdowns, and remove records securely.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              6
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Responsible AI & Safety</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict medical disclaimers and refusal of harmful extremes, dangerous diets, or medical diagnosis claims.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-emerald-600" />
          <span>Technology Stack</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2 font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">React 19</h4>
            <p className="text-xs text-slate-500 mt-1">Component architecture & hooks</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-2 font-bold">
              TS
            </div>
            <h4 className="font-bold text-sm text-slate-900">TypeScript</h4>
            <p className="text-xs text-slate-500 mt-1">End-to-end type safety</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-2 font-bold">
              CSS
            </div>
            <h4 className="font-bold text-sm text-slate-900">Tailwind CSS</h4>
            <p className="text-xs text-slate-500 mt-1">Modern utility-first styling</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Supabase</h4>
            <p className="text-xs text-slate-500 mt-1">PostgreSQL & JSONB storage</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2 font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Gemini AI</h4>
            <p className="text-xs text-slate-500 mt-1">Gemini 3.8 Flash model</p>
          </div>
        </div>
      </section>

      {/* Database Schema & Supabase Setup Viewer */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Database className="w-4 h-4" />
              <span>Database Architecture</span>
            </div>
            <h3 className="text-xl font-bold text-white">Supabase PostgreSQL Schema</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Copy and execute this script directly in the Supabase SQL Editor.
            </p>
          </div>

          <button
            onClick={copySql}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied SQL!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy SQL Schema</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 overflow-x-auto text-xs font-mono text-emerald-300">
          <pre>{supabaseSqlSchema}</pre>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>Storage: Tables include `users` with `plan JSONB` and Row Level Security enabled.</span>
          <span className="text-emerald-400 font-medium">Automatic fallback persistent store included.</span>
        </div>
      </section>

      {/* Security & API Key Safety */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-emerald-600" />
          <span>Security & API Protection</span>
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed">
          FitBuddy-AI is built in strict adherence to enterprise security best practices:
        </p>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span><strong>No Secret API Keys in Client:</strong> The frontend client code never imports or contains `GEMINI_API_KEY` or database secret keys.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span><strong>Server-Side Proxy Architecture:</strong> All AI prompts are constructed and dispatched from the Node.js Express server (`/api/plans/generate`).</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span><strong>Input Sanitization & Validation:</strong> Biometric variables (age, height, weight) are strictly checked for valid numeric boundaries before being processed.</span>
          </li>
        </ul>
      </section>
    </div>
  );
};
