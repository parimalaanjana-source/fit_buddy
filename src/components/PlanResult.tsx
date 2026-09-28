import React, { useState } from 'react';
import { FitUser } from '../types';
import {
  Sparkles,
  Dumbbell,
  Apple,
  Calendar,
  CheckCircle,
  Clock,
  Printer,
  Download,
  RotateCcw,
  Users,
  AlertTriangle,
  Flame,
  Droplets,
  Heart,
  TrendingUp,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';

interface PlanResultProps {
  user: FitUser;
  onGenerateAnother: () => void;
  onViewUsers: () => void;
}

export const PlanResult: React.FC<PlanResultProps> = ({
  user,
  onGenerateAnother,
  onViewUsers
}) => {
  const { plan } = user;
  const [selectedDay, setSelectedDay] = useState<string>(
    plan.weeklySchedule?.[0]?.day || 'Monday'
  );

  // Height and Weight formatted
  const heightM = user.height / 100;
  const bmi = Number((user.weight / (heightM * heightM)).toFixed(1));

  const getBmiBadge = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    if (val < 25) return { label: 'Normal weight', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (val < 30) return { label: 'Overweight', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { label: 'Obese', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  const bmiBadge = getBmiBadge(bmi);

  // Print Plan handler
  const handlePrint = () => {
    window.print();
  };

  // Download Plan handler: generates a nicely formatted printable HTML file / PDF download
  const handleDownload = () => {
    const formattedDate = new Date(user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const docContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FitBuddy-AI Plan - ${user.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; max-width: 800px; margin: auto; }
    h1 { color: #047857; margin-bottom: 4px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; background: #e6f4ea; color: #047857; }
    .profile-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; }
    .section { margin: 28px 0; }
    .section-title { font-size: 18px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 6px; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
    th { background: #f1f5f9; }
    ul { padding-left: 20px; }
    li { margin-bottom: 6px; }
    .disclaimer { background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; font-size: 12px; color: #92400e; margin-top: 30px; border-radius: 6px; }
  </style>
</head>
<body>
  <h1>FitBuddy-AI Personalized Fitness Plan</h1>
  <p style="color: #64748b; font-size: 14px;">Generated for <strong>${user.name}</strong> • ${formattedDate}</p>

  <div class="profile-card">
    <table style="border: none;">
      <tr style="border: none;">
        <td style="border: none;"><strong>Age:</strong> ${user.age} yrs</td>
        <td style="border: none;"><strong>Gender:</strong> ${user.gender}</td>
        <td style="border: none;"><strong>Height:</strong> ${user.height} cm</td>
        <td style="border: none;"><strong>Weight:</strong> ${user.weight} kg</td>
      </tr>
      <tr style="border: none;">
        <td style="border: none;"><strong>Goal:</strong> ${user.goal}</td>
        <td style="border: none;"><strong>Activity Level:</strong> ${user.activity}</td>
        <td style="border: none;"><strong>BMI:</strong> ${bmi} (${bmiBadge.label})</td>
        <td style="border: none;"><strong>Workout Time:</strong> ${user.available_time || '45 mins'}</td>
      </tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">1. Personalized Summary</div>
    <p>${plan.summary}</p>
  </div>

  <div class="section">
    <div class="section-title">2. Workout Plan (${plan.workoutPlan.recommendedFrequency})</div>
    <p><strong>Warm-Up:</strong></p>
    <ul>
      ${plan.workoutPlan.warmUp.map(item => `<li>${item}</li>`).join('')}
    </ul>

    <p><strong>Main Routine:</strong></p>
    <table>
      <thead>
        <tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>Form Cue</th></tr>
      </thead>
      <tbody>
        ${plan.workoutPlan.mainWorkout.map(w => `
          <tr>
            <td><strong>${w.exercise}</strong></td>
            <td>${w.sets}</td>
            <td>${w.reps}</td>
            <td>${w.notes}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <p style="margin-top: 14px;"><strong>Cool-Down:</strong></p>
    <ul>
      ${plan.workoutPlan.coolDown.map(item => `<li>${item}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">3. Nutrition Guidance</div>
    <p>${plan.nutritionGuidance.overview}</p>
    <p><strong>Recommended Protein Sources:</strong> ${plan.nutritionGuidance.proteinSources.join(', ')}</p>
    <p><strong>Fruits & Vegetables:</strong> ${plan.nutritionGuidance.fruitsVegetables.join(', ')}</p>
    <p><strong>Hydration:</strong> ${plan.nutritionGuidance.hydrationTips}</p>

    <p><strong>Sample Meals:</strong></p>
    <ul>
      ${plan.nutritionGuidance.mealSuggestions.map(m => `
        <li><strong>${m.meal}:</strong> ${m.items} <em>(${m.notes})</em></li>
      `).join('')}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">4. Weekly Schedule</div>
    <table>
      <thead>
        <tr><th>Day</th><th>Focus</th><th>Activities</th><th>Duration</th></tr>
      </thead>
      <tbody>
        ${plan.weeklySchedule.map(s => `
          <tr>
            <td><strong>${s.day}</strong></td>
            <td>${s.focus}</td>
            <td>${s.activities}</td>
            <td>${s.duration}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">5. General Fitness Tips</div>
    <ul>
      ${plan.fitnessTips.map(tip => `<li>${tip}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">6. Progress Tracking</div>
    <ul>
      ${plan.progressTracking.map(p => `<li><strong>${p.metric} (${p.frequency}):</strong> ${p.method}</li>`).join('')}
    </ul>
  </div>

  <div class="disclaimer">
    <strong>Medical Disclaimer:</strong> ${plan.disclaimer}
  </div>
</body>
</html>
    `;

    const blob = new Blob([docContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FitBuddy-Plan-${user.name.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 printable-plan">
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Plan Ready & Stored In Database
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 action-buttons">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            title="Print this fitness plan"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Plan</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
            title="Save plan as downloadable document"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Download Plan</span>
          </button>

          <button
            onClick={onViewUsers}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>View All Users</span>
          </button>

          <button
            onClick={onGenerateAnother}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Generate Another</span>
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Personalized AI Blueprint
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Your Personalized FitBuddy Plan
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Evidence-informed exercise science and nutrition tailored to your specific physique and schedule.
        </p>
      </div>

      {/* User Information Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Plan Created on {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              Goal: {user.goal}
            </span>
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold">
              Activity: {user.activity}
            </span>
            <span className={`px-3 py-1 rounded-full border text-xs font-bold ${bmiBadge.color}`}>
              BMI {bmi} ({bmiBadge.label})
            </span>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-6">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Age</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{user.age} <span className="text-xs font-normal text-slate-400">yrs</span></p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Gender</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{user.gender}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Height</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{user.height} <span className="text-xs font-normal text-slate-400">cm</span></p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Weight</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{user.weight} <span className="text-xs font-normal text-slate-400">kg</span></p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Session Time</p>
            <p className="text-sm font-bold text-slate-900 mt-1">{user.available_time || '45 mins'}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Preference</p>
            <p className="text-xs font-bold text-slate-900 mt-1 truncate" title={user.workout_preference}>
              {user.workout_preference || 'Balanced'}
            </p>
          </div>
        </div>
      </div>

      {/* Plan Sections */}
      <div className="space-y-8">
        {/* 1. Personalized Summary Card */}
        <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-2.5 mb-3 text-emerald-200">
            <Sparkles className="w-5 h-5 text-emerald-200" />
            <h3 className="text-sm font-bold uppercase tracking-wider">1. Personalized Summary</h3>
          </div>
          <p className="text-base sm:text-lg leading-relaxed font-normal text-white">
            {plan.summary}
          </p>
          {plan.targetBmi && (
            <div className="mt-4 pt-4 border-t border-emerald-500/40 text-xs sm:text-sm text-emerald-100 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>Biometric Note: {plan.targetBmi.advice}</span>
            </div>
          )}
        </section>

        {/* 2. Workout Plan Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">2. Workout Plan</h3>
                <p className="text-xs text-slate-500">Structured progressive training</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold self-start sm:self-auto">
              Frequency: {plan.workoutPlan.recommendedFrequency}
            </span>
          </div>

          {/* Warm-Up Protocol */}
          <div className="mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2 mb-3 text-amber-700">
              <Flame className="w-4 h-4" />
              <h4 className="text-sm font-bold">Dynamic Warm-Up (5 - 8 mins)</h4>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
              {plan.workoutPlan.warmUp.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Workout Exercises Table/Cards */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span>Main Workout Routine</span>
            </h4>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Exercise</th>
                    <th className="px-4 py-3">Sets</th>
                    <th className="px-4 py-3">Reps / Timing</th>
                    <th className="px-4 py-3">Technique & Form Cue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plan.workoutPlan.mainWorkout.map((ex, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900">{ex.exercise}</td>
                      <td className="px-4 py-3.5 font-medium text-emerald-700">{ex.sets}</td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">{ex.reps}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-600">{ex.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="sm:hidden space-y-3">
              {plan.workoutPlan.mainWorkout.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{ex.exercise}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">{ex.sets}</span>
                  </div>
                  <p className="text-xs text-slate-600"><strong>Target:</strong> {ex.reps}</p>
                  <p className="text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">{ex.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cool-Down Protocol */}
          <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-2 mb-3 text-emerald-800">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-bold">Cool-Down & Mobility Stretch (5 mins)</h4>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
              {plan.workoutPlan.coolDown.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Nutrition Guidance Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">3. Nutrition Guidance</h3>
              <p className="text-xs text-slate-500">Fueling performance and recovery</p>
            </div>
          </div>

          {/* Overview */}
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {plan.nutritionGuidance.overview}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Protein Sources */}
            <div className="p-5 rounded-2xl border border-slate-200/90 bg-white">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Targeted Protein Sources
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {plan.nutritionGuidance.proteinSources.map((prot, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/60">
                    {prot}
                  </span>
                ))}
              </div>
            </div>

            {/* Fruits and Vegetables */}
            <div className="p-5 rounded-2xl border border-slate-200/90 bg-white">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                Essential Fruits & Micronutrients
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {plan.nutritionGuidance.fruitsVegetables.map((fv, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-medium border border-teal-200/60">
                    {fv}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hydration */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 mb-6">
            <Droplets className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Hydration Protocol</h5>
              <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">{plan.nutritionGuidance.hydrationTips}</p>
            </div>
          </div>

          {/* Meal Suggestions */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Structured Meal Suggestions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {plan.nutritionGuidance.mealSuggestions.map((meal, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs mb-2">
                      {meal.meal}
                    </span>
                    <p className="text-xs font-semibold text-slate-800 mb-2 leading-relaxed">{meal.items}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 italic border-t border-slate-200/60 pt-2">{meal.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Daily Activities Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">4. Daily Activity Suggestions</h3>
              <p className="text-xs text-slate-500">Non-exercise physical activity and healthy movement</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plan.dailyActivities.map((act, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{act}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Weekly Schedule Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">5. 7-Day Weekly Fitness Schedule</h3>
              <p className="text-xs text-slate-500">Structured progression across the full week</p>
            </div>
          </div>

          {/* Interactive Day Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {plan.weeklySchedule.map((sched) => (
              <button
                key={sched.day}
                onClick={() => setSelectedDay(sched.day)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDay === sched.day
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sched.day}
              </button>
            ))}
          </div>

          {/* Selected Day Feature Card */}
          {plan.weeklySchedule.find(s => s.day === selectedDay) && (
            (() => {
              const current = plan.weeklySchedule.find(s => s.day === selectedDay)!;
              return (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                    <span className="text-emerald-400 font-extrabold text-sm uppercase tracking-wider">{current.day} Schedule</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                      Target: {current.duration}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{current.focus}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{current.activities}</p>
                </div>
              );
            })()
          )}

          {/* Full Week Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {plan.weeklySchedule.map((dayPlan) => (
              <div
                key={dayPlan.day}
                onClick={() => setSelectedDay(dayPlan.day)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedDay === dayPlan.day
                    ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50'
                }`}
              >
                <p className="text-xs font-bold text-slate-900">{dayPlan.day}</p>
                <p className="text-[11px] font-semibold text-emerald-700 mt-1 truncate">{dayPlan.focus}</p>
                <p className="text-[10px] text-slate-500 mt-2 line-clamp-2">{dayPlan.activities}</p>
                <span className="inline-block mt-2 text-[10px] text-slate-400 font-medium">{dayPlan.duration}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. General Fitness Tips & 7. Progress Tracking Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fitness Tips */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">6. General Fitness Tips</h3>
                  <p className="text-xs text-slate-500">Core principles for longevity & safety</p>
                </div>
              </div>

              <ul className="space-y-3">
                {plan.fitnessTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Progress Tracking */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">7. Progress Tracking</h3>
                  <p className="text-xs text-slate-500">Measuring sustainable milestones</p>
                </div>
              </div>

              <div className="space-y-3">
                {plan.progressTracking.map((track, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900">{track.metric}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">{track.frequency}</span>
                    </div>
                    <p className="text-xs text-slate-600">{track.method}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Mandatory Medical Disclaimer Banner */}
        <section className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-bold">Medical Disclaimer: </span>
            {plan.disclaimer}
          </div>
        </section>

        {/* Bottom Actions Bar */}
        <div className="no-print pt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onGenerateAnother}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Generate Another Plan</span>
          </button>
          <button
            onClick={onViewUsers}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>View All Users</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-semibold text-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-teal-700" />
            <span>Download Plan</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
