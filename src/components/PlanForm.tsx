import React, { useState, useId } from 'react';
import {
  PlanFormInput,
  FitnessGoal,
  ActivityLevel,
  Gender,
  FitUser
} from '../types';
import {
  Sparkles,
  User,
  Heart,
  Scale,
  Ruler,
  Clock,
  Utensils,
  Dumbbell,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

interface PlanFormProps {
  onSuccess: (user: FitUser) => void;
}

export const PlanForm: React.FC<PlanFormProps> = ({ onSuccess }) => {
  const formId = useId();

  // Form State
  const [formData, setFormData] = useState<PlanFormInput>({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    activity: '',
    workout_preference: 'Home & Gym balanced routine',
    dietary_preference: 'Balanced nutritious whole foods',
    available_time: '45 mins'
  });

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusStep, setStatusStep] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);

  // Live BMI calculation
  const heightNum = Number(formData.height);
  const weightNum = Number(formData.weight);
  const liveBmi = (heightNum > 80 && weightNum > 20)
    ? Number((weightNum / Math.pow(heightNum / 100, 2)).toFixed(1))
    : null;

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (bmi < 25) return { label: 'Normal weight', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Obesity range', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum < 12 || ageNum > 110) {
      newErrors.age = 'Please enter a realistic age between 12 and 110.';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender.';
    }

    const hNum = Number(formData.height);
    if (!formData.height || isNaN(hNum) || hNum < 80 || hNum > 250) {
      newErrors.height = 'Please enter a valid height (80 - 250 cm).';
    }

    const wNum = Number(formData.weight);
    if (!formData.weight || isNaN(wNum) || wNum < 25 || wNum > 350) {
      newErrors.weight = 'Please enter a valid weight (25 - 350 kg).';
    }

    if (!formData.goal) {
      newErrors.goal = 'Please choose your primary fitness goal.';
    }

    if (!formData.activity) {
      newErrors.activity = 'Please select your current activity level.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      // Scroll to the first error
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    setStatusStep('Analyzing biometric measurements...');

    const timer1 = setTimeout(() => {
      setStatusStep('Consulting Gemini AI fitness & nutrition models...');
    }, 1200);

    const timer2 = setTimeout(() => {
      setStatusStep('Finalizing 7-day schedule & saving to database...');
    }, 2800);

    try {
      const response = await api.generatePlan(formData);
      clearTimeout(timer1);
      clearTimeout(timer2);
      onSuccess(response.user);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      console.error('Plan generation failed:', err);
      setApiError(
        err.message || 'The AI service is temporarily busy. Please try again in a moment.'
      );
      setIsLoading(false);
    }
  };

  const setPresetGoal = (goal: FitnessGoal) => {
    setFormData(prev => ({ ...prev, goal }));
    if (errors.goal) setErrors(prev => ({ ...prev, goal: '' }));
  };

  const setPresetActivity = (activity: ActivityLevel) => {
    setFormData(prev => ({ ...prev, activity }));
    if (errors.activity) setErrors(prev => ({ ...prev, activity: '' }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Fitness Blueprint Generator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Generate Your Fitness Plan
        </h1>
        <p className="mt-3 text-slate-600 text-base">
          Fill in your details below. FitBuddy-AI will construct an evidence-based workout routine, nutrition guidance, and weekly schedule.
        </p>
      </div>

      {/* Error Alert if any */}
      {apiError && (
        <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Notice</h4>
            <p className="text-sm mt-0.5">{apiError}</p>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        {/* Section 1: Basic Information */}
        <div>
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">1. Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Name */}
            <div className="lg:col-span-2">
              <label htmlFor={`${formId}-name`} className="block text-sm font-semibold text-slate-800 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id={`${formId}-name`}
                type="text"
                placeholder="e.g. Alex Johnson"
                value={formData.name}
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                  errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Age */}
            <div>
              <label htmlFor={`${formId}-age`} className="block text-sm font-semibold text-slate-800 mb-1.5">
                Age (Years) <span className="text-rose-500">*</span>
              </label>
              <input
                id={`${formId}-age`}
                type="number"
                min="10"
                max="120"
                placeholder="e.g. 25"
                value={formData.age}
                onChange={e => {
                  setFormData({ ...formData, age: e.target.value });
                  if (errors.age) setErrors({ ...errors, age: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                  errors.age ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              />
              {errors.age && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div className="sm:col-span-1">
              <label htmlFor={`${formId}-gender`} className="block text-sm font-semibold text-slate-800 mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                id={`${formId}-gender`}
                value={formData.gender}
                onChange={e => {
                  setFormData({ ...formData, gender: e.target.value as Gender });
                  if (errors.gender) setErrors({ ...errors, gender: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                  errors.gender ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.gender}</p>}
            </div>

            {/* Height */}
            <div>
              <label htmlFor={`${formId}-height`} className="block text-sm font-semibold text-slate-800 mb-1.5">
                Height <span className="text-slate-400 font-normal">(cm)</span> <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={`${formId}-height`}
                  type="number"
                  placeholder="e.g. 175"
                  value={formData.height}
                  onChange={e => {
                    setFormData({ ...formData, height: e.target.value });
                    if (errors.height) setErrors({ ...errors, height: '' });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                    errors.height ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                  }`}
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
                  cm
                </span>
              </div>
              {errors.height && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.height}</p>}
            </div>

            {/* Weight */}
            <div>
              <label htmlFor={`${formId}-weight`} className="block text-sm font-semibold text-slate-800 mb-1.5">
                Weight <span className="text-slate-400 font-normal">(kg)</span> <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={`${formId}-weight`}
                  type="number"
                  placeholder="e.g. 70"
                  value={formData.weight}
                  onChange={e => {
                    setFormData({ ...formData, weight: e.target.value });
                    if (errors.weight) setErrors({ ...errors, weight: '' });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                    errors.weight ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                  }`}
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
                  kg
                </span>
              </div>
              {errors.weight && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.weight}</p>}
            </div>
          </div>

          {/* Live BMI indicator preview */}
          {liveBmi && (
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-600 font-medium">Estimated Baseline BMI:</span>
                <span className="text-slate-900 font-bold text-sm">{liveBmi}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full font-semibold border ${getBmiCategory(liveBmi).color}`}>
                {getBmiCategory(liveBmi).label}
              </span>
            </div>
          )}
        </div>

        {/* Section 2: Goals & Activity Level */}
        <div>
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-6">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">2. Fitness Goals & Activity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fitness Goal */}
            <div>
              <label htmlFor={`${formId}-goal`} className="block text-sm font-semibold text-slate-800 mb-1.5">
                Primary Fitness Goal <span className="text-rose-500">*</span>
              </label>
              <select
                id={`${formId}-goal`}
                value={formData.goal}
                onChange={e => {
                  setFormData({ ...formData, goal: e.target.value as FitnessGoal });
                  if (errors.goal) setErrors({ ...errors, goal: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                  errors.goal ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <option value="">Select Primary Goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Weight Gain">Weight Gain</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="General Fitness">General Fitness</option>
              </select>
              {errors.goal && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.goal}</p>}

              {/* Quick Select Goal Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(['Weight Loss', 'Muscle Gain', 'General Fitness', 'Weight Gain'] as FitnessGoal[]).map(g => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setPresetGoal(g)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      formData.goal === g
                        ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label htmlFor={`${formId}-activity`} className="block text-sm font-semibold text-slate-800 mb-1.5">
                Current Activity Level <span className="text-rose-500">*</span>
              </label>
              <select
                id={`${formId}-activity`}
                value={formData.activity}
                onChange={e => {
                  setFormData({ ...formData, activity: e.target.value as ActivityLevel });
                  if (errors.activity) setErrors({ ...errors, activity: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                  errors.activity ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <option value="">Select Activity Level</option>
                <option value="Low">Low (Sedentary, desk work, little exercise)</option>
                <option value="Moderate">Moderate (Exercise 1-3 times / week)</option>
                <option value="High">High (Vigorous exercise 4+ times / week)</option>
              </select>
              {errors.activity && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.activity}</p>}

              {/* Quick Select Activity Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(['Low', 'Moderate', 'High'] as ActivityLevel[]).map(a => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => setPresetActivity(a)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      formData.activity === a
                        ? 'bg-teal-600 text-white border-teal-600 font-semibold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {a} Activity
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Preferences (Optional) */}
        <div>
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">3. Preferences & Schedule</h2>
              <p className="text-xs text-slate-500">Optional customization to help the AI refine your routine</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Workout Preference */}
            <div>
              <label htmlFor={`${formId}-workout-pref`} className="block text-sm font-semibold text-slate-800 mb-1.5">
                Workout Preference
              </label>
              <input
                id={`${formId}-workout-pref`}
                type="text"
                placeholder="e.g. Home Dumbbells, Calisthenics, Gym"
                value={formData.workout_preference}
                onChange={e => setFormData({ ...formData, workout_preference: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Dietary Preference */}
            <div>
              <label htmlFor={`${formId}-dietary-pref`} className="block text-sm font-semibold text-slate-800 mb-1.5">
                Dietary Preference
              </label>
              <input
                id={`${formId}-dietary-pref`}
                type="text"
                placeholder="e.g. High Protein, Vegetarian, Vegan"
                value={formData.dietary_preference}
                onChange={e => setFormData({ ...formData, dietary_preference: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Available Workout Time */}
            <div>
              <label htmlFor={`${formId}-time`} className="block text-sm font-semibold text-slate-800 mb-1.5">
                Workout Time / Day
              </label>
              <select
                id={`${formId}-time`}
                value={formData.available_time}
                onChange={e => setFormData({ ...formData, available_time: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="20 mins">20 minutes (Quick express)</option>
                <option value="30 mins">30 minutes (Standard)</option>
                <option value="45 mins">45 minutes (Recommended)</option>
                <option value="60 mins">60 minutes (Comprehensive)</option>
                <option value="90 mins">90 minutes (Advanced)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button & Disclaimer */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-3 transition-all cursor-pointer ${
              isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 active:scale-98'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{statusStep || 'Generating Fitness Plan...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Fitness Plan</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-500 leading-relaxed px-4">
            By generating, your details are saved to your FitBuddy profile. This plan provides general fitness and educational guidance only.
          </p>
        </div>
      </form>
    </div>
  );
};
