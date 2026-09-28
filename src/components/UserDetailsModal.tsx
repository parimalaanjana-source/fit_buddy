import React, { useState } from 'react';
import { FitUser } from '../types';
import {
  X,
  User,
  Heart,
  Calendar,
  Dumbbell,
  Apple,
  Trash2,
  Printer,
  Download,
  AlertTriangle,
  Award,
  CheckCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface UserDetailsModalProps {
  user: FitUser | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  onClose,
  onDelete
}) => {
  if (!user) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'workout' | 'nutrition' | 'schedule'>('profile');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { plan } = user;
  const heightM = user.height / 100;
  const bmi = Number((user.weight / (heightM * heightM)).toFixed(1));

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const docContent = `
FitBuddy-AI Fitness Plan
========================
User: ${user.name} (${user.gender}, ${user.age} yrs)
Goal: ${user.goal} | Activity: ${user.activity}
Height: ${user.height} cm | Weight: ${user.weight} kg (BMI: ${bmi})
Created: ${new Date(user.created_at).toLocaleDateString()}

Summary:
${plan.summary}

Workout Plan:
- Recommended Frequency: ${plan.workoutPlan.recommendedFrequency}
- Main Exercises:
${plan.workoutPlan.mainWorkout.map(w => `  * ${w.exercise} - ${w.sets} x ${w.reps} (${w.notes})`).join('\n')}

Nutrition Guidelines:
${plan.nutritionGuidance.overview}
- Protein Sources: ${plan.nutritionGuidance.proteinSources.join(', ')}
- Hydration: ${plan.nutritionGuidance.hydrationTips}

Disclaimer: ${plan.disclaimer}
    `;

    const blob = new Blob([docContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FitBuddy-Plan-${user.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-slate-900">{user.name}</h3>
                {user.is_demo && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                    Demo Profile
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                ID: {user.id} • Registered {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 gap-2 bg-white text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Profile
          </button>
          <button
            onClick={() => setActiveTab('workout')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'workout'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Workout Plan
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'nutrition'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Nutrition & Meals
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'schedule'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            7-Day Schedule
          </button>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Biometric Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Age</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{user.age} yrs</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Gender</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{user.gender}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Height / Weight</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{user.height} cm / {user.weight} kg</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Body Mass Index</p>
                  <p className="text-base font-bold text-emerald-700 mt-0.5">BMI {bmi}</p>
                </div>
              </div>

              {/* Goal & Preferences Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Fitness Goal</p>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    {user.goal}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Activity Level</p>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
                    {user.activity}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Workout Preference</p>
                  <p className="text-xs font-semibold text-slate-800 mt-1">{user.workout_preference || 'Balanced'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Dietary Preference</p>
                  <p className="text-xs font-semibold text-slate-800 mt-1">{user.dietary_preference || 'Balanced whole foods'}</p>
                </div>
              </div>

              {/* AI Summary */}
              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-slate-800">
                <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Plan Summary
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">{plan.summary}</p>
              </div>

              {/* Tips & Progress Quick View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-600" />
                    Key Fitness Tips
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {plan.fitnessTips.slice(0, 3).map((tip, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Tracking Milestones
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {plan.progressTracking.slice(0, 3).map((p, i) => (
                      <li key={i} className="text-xs">
                        <strong>{p.metric}:</strong> {p.method}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workout' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">Workout Plan & Exercise Splits</h4>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {plan.workoutPlan.recommendedFrequency}
                </span>
              </div>

              {/* Warm-Up */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <p className="text-xs font-bold text-amber-900 mb-1">Dynamic Warm-Up:</p>
                <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                  {plan.workoutPlan.warmUp.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>

              {/* Main Workout */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2.5">Exercise</th>
                      <th className="px-3 py-2.5">Sets</th>
                      <th className="px-3 py-2.5">Reps</th>
                      <th className="px-3 py-2.5">Form Cue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {plan.workoutPlan.mainWorkout.map((ex, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2.5 font-bold text-slate-900">{ex.exercise}</td>
                        <td className="px-3 py-2.5 font-medium text-emerald-700">{ex.sets}</td>
                        <td className="px-3 py-2.5 text-slate-700">{ex.reps}</td>
                        <td className="px-3 py-2.5 text-slate-500">{ex.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cool-Down */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                <p className="text-xs font-bold text-emerald-900 mb-1">Cool-Down & Mobility:</p>
                <ul className="list-disc list-inside text-xs text-emerald-800 space-y-1">
                  {plan.workoutPlan.coolDown.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {plan.nutritionGuidance.overview}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-emerald-800 mb-1.5">Protein Sources</p>
                  <p className="text-xs text-slate-600">{plan.nutritionGuidance.proteinSources.join(', ')}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-teal-800 mb-1.5">Vegetables & Fruits</p>
                  <p className="text-xs text-slate-600">{plan.nutritionGuidance.fruitsVegetables.join(', ')}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-blue-900">
                <strong>Hydration: </strong> {plan.nutritionGuidance.hydrationTips}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900 mb-2">Sample Daily Meals</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {plan.nutritionGuidance.mealSuggestions.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-bold text-xs text-emerald-700">{m.meal}</span>
                      <p className="text-xs text-slate-800 font-medium mt-0.5">{m.items}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{m.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900">7-Day Weekly Schedule</h4>
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                {plan.weeklySchedule.map((s, idx) => (
                  <div key={idx} className="p-3.5 bg-white hover:bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{s.day}</span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {s.focus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{s.activities}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{s.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Disclaimer Note */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>{plan.disclaimer}</p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {showConfirmDelete ? (
              <div className="flex items-center gap-2 animate-in fade-in">
                <span className="text-xs text-rose-600 font-bold">Delete this user?</span>
                <button
                  onClick={() => onDelete(user.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete User</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
