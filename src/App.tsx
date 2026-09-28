import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { PlanForm } from './components/PlanForm';
import { PlanResult } from './components/PlanResult';
import { UsersPage } from './components/UsersPage';
import { DashboardPage } from './components/DashboardPage';
import { AboutPage } from './components/AboutPage';
import { Footer } from './components/Footer';
import { FitUser } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [generatedUser, setGeneratedUser] = useState<FitUser | null>(null);

  const handlePlanGenerated = (user: FitUser) => {
    setGeneratedUser(user);
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Persistent Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={handleNavigate} />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {activeTab === 'generate' && (
          <PlanForm onSuccess={handlePlanGenerated} />
        )}

        {activeTab === 'result' && generatedUser && (
          <PlanResult
            user={generatedUser}
            onGenerateAnother={() => handleNavigate('generate')}
            onViewUsers={() => handleNavigate('users')}
          />
        )}

        {/* Fallback if user navigates to result tab directly without a generated plan */}
        {activeTab === 'result' && !generatedUser && (
          <PlanForm onSuccess={handlePlanGenerated} />
        )}

        {activeTab === 'users' && (
          <UsersPage onNavigateToGenerate={() => handleNavigate('generate')} />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigateToGenerate={() => handleNavigate('generate')}
            onNavigateToUsers={() => handleNavigate('users')}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
