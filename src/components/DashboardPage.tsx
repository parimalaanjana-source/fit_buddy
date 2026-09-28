import React, { useState, useEffect } from 'react';
import { DashboardStats, FitUser } from '../types';
import { api } from '../services/api';
import {
  BarChart3,
  Users,
  Target,
  Flame,
  Award,
  Activity,
  TrendingUp,
  Clock,
  ArrowRight,
  Eye,
  RefreshCw,
  Scale
} from 'lucide-react';
import { UserDetailsModal } from './UserDetailsModal';

interface DashboardPageProps {
  onNavigateToGenerate: () => void;
  onNavigateToUsers: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToGenerate,
  onNavigateToUsers
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<FitUser | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const total = stats?.totalUsers || 0;
  const pct = (val: number) => (total > 0 ? Math.round((val / total) * 100) : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            Database Analytics
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            FitBuddy Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time biometric and goal distribution computed directly from user profiles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
          <button
            onClick={onNavigateToGenerate}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            + Create New Plan
          </button>
        </div>
      </div>

      {isLoading && !stats ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600 font-semibold text-sm">Calculating database analytics...</p>
        </div>
      ) : stats ? (
        <>
          {/* Top Level Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Total Users */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalUsers}</p>
                <p className="text-xs text-emerald-700 font-medium mt-1">Registered in database</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Average Age */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Age</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">
                  {stats.averageAge > 0 ? stats.averageAge : '--'} <span className="text-sm font-normal text-slate-400">yrs</span>
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">Across all fitness seekers</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Average BMI */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Average BMI</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">
                  {stats.averageBmi > 0 ? stats.averageBmi : '--'}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">Baseline biometric ratio</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
            </div>

            {/* Card 4: Top Goal */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Goal</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {stats.weightLossCount >= stats.muscleGainCount && stats.weightLossCount >= stats.generalFitnessCount
                    ? 'Weight Loss'
                    : stats.muscleGainCount >= stats.weightGainCount
                    ? 'Muscle Gain'
                    : 'Fitness'}
                </p>
                <p className="text-xs text-emerald-700 font-medium mt-1">Most requested roadmap</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Goal Distribution Statistics Grid (Explicitly Required) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Fitness Goals Breakdown</h3>
                <p className="text-xs text-slate-500">Live statistics computed strictly from database records</p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
                {stats.totalUsers} Total Registrations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Weight Loss */}
              <div className="p-5 rounded-2xl border border-rose-100 bg-rose-50/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Weight Loss</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    {pct(stats.weightLossCount)}%
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">{stats.weightLossCount}</p>
                <div className="w-full bg-rose-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct(stats.weightLossCount)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Caloric deficit & metabolic training</p>
              </div>

              {/* Muscle Gain */}
              <div className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">Muscle Gain</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    {pct(stats.muscleGainCount)}%
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">{stats.muscleGainCount}</p>
                <div className="w-full bg-indigo-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct(stats.muscleGainCount)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Hypertrophy & high protein</p>
              </div>

              {/* Weight Gain */}
              <div className="p-5 rounded-2xl border border-amber-100 bg-amber-50/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Weight Gain</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {pct(stats.weightGainCount)}%
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">{stats.weightGainCount}</p>
                <div className="w-full bg-amber-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct(stats.weightGainCount)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Caloric surplus & strength building</p>
              </div>

              {/* General Fitness */}
              <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">General Fitness</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {pct(stats.generalFitnessCount)}%
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">{stats.generalFitnessCount}</p>
                <div className="w-full bg-emerald-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct(stats.generalFitnessCount)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Cardio, mobility & functional wellness</p>
              </div>
            </div>
          </div>

          {/* Activity Breakdown & Recent Users Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activity Level Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
                Activity Level Distribution
              </h3>

              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Low Activity (Sedentary)</span>
                    <span>{stats.activityBreakdown.low} ({pct(stats.activityBreakdown.low)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${pct(stats.activityBreakdown.low)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Moderate Activity (1-3x/wk)</span>
                    <span>{stats.activityBreakdown.moderate} ({pct(stats.activityBreakdown.moderate)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-full rounded-full"
                      style={{ width: `${pct(stats.activityBreakdown.moderate)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>High Activity (4+x/wk)</span>
                    <span>{stats.activityBreakdown.high} ({pct(stats.activityBreakdown.high)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${pct(stats.activityBreakdown.high)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                Helps AI evaluate current work capacity and prevents initial overtraining or injury risks.
              </div>
            </div>

            {/* Recent Users List */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Recent Users</h3>
                <button
                  onClick={onNavigateToUsers}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {stats.recentUsers.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No recent users recorded in database.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {stats.recentUsers.map(user => (
                    <div
                      key={user.id}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{user.name}</span>
                            {user.is_demo && (
                              <span className="text-[9px] px-1 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200 uppercase">
                                Demo
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {user.gender}, {user.age} yrs • {user.goal}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Plan</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}

      {/* Selected User Plan Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={async (id) => {
            await api.deleteUser(id);
            setSelectedUser(null);
            fetchStats();
          }}
        />
      )}
    </div>
  );
};
