import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Users,
  Target,
  Dumbbell,
  Apple,
  Calendar,
  LineChart,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Activity,
  Award
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-20 bg-radial from-emerald-50/80 via-white to-slate-50 border-b border-slate-200/80">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-6 border border-emerald-200/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            AI-Powered Personalized Fitness Planner
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none mb-6">
            Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">AI Fitness Companion</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
            Generate a personalized fitness plan based on your body details, fitness goal and activity level.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => onNavigate('generate')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Generate My Fitness Plan</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('users')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>View Users</span>
            </button>
          </div>

          {/* Quick Stats Pill Bar */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left sm:text-center">
            <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-slate-100 shadow-2xs">
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-medium">Personalized AI Roadmaps</p>
            </div>
            <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-slate-100 shadow-2xs">
              <p className="text-2xl font-bold text-emerald-600">7-Day</p>
              <p className="text-xs text-slate-500 font-medium">Structured Weekly Splits</p>
            </div>
            <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-slate-100 shadow-2xs">
              <p className="text-2xl font-bold text-slate-900">Nutritional</p>
              <p className="text-xs text-slate-500 font-medium">Whole-Food Blueprints</p>
            </div>
            <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-slate-100 shadow-2xs">
              <p className="text-2xl font-bold text-teal-600">Free</p>
              <p className="text-xs text-slate-500 font-medium">For Health & Wellness</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Designed for Real, Sustainable Results
          </h2>
          <p className="mt-3 text-base text-slate-600">
            FitBuddy-AI evaluates your biometric profile to generate practical, safe, and progressive routines tailored to your lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Customized Workouts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Targeted warm-ups, progressive main lifts or bodyweight exercises, sets, reps, and safe cool-down protocols.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Apple className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Nutrition Guidance</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              High-quality protein sources, fresh vegetables, hydration guidelines, and real meal blueprints for breakfast, lunch, and dinner.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">7-Day Weekly Schedule</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Day-by-day activity distribution, scheduled active recovery, and sessions mapped precisely to your daily available time.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Progress & Tracking</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Clear tracking milestones, weekly weigh-in routines, habit tips, and realistic metrics to keep you motivated every step.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mb-10">
            <span className="text-emerald-400 font-semibold text-xs tracking-wider uppercase">Simple 3-Step Process</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-white">How FitBuddy-AI Works</h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Transforming your baseline physical data into an actionable, health-first fitness blueprint in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
                1
              </div>
              <h4 className="text-lg font-semibold text-white">Enter Your Body Details</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Provide your age, gender, height, weight, fitness goal (Weight Loss, Muscle Gain, etc.), and activity level.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center border border-teal-500/30">
                2
              </div>
              <h4 className="text-lg font-semibold text-white">AI Analyzes & Synthesizes</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Gemini AI computes BMI context, metabolic requirements, and designs exercises matching your daily schedule.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center border border-blue-500/30">
                3
              </div>
              <h4 className="text-lg font-semibold text-white">Follow, Print & Track</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                View your complete plan, download as a PDF, print it out, or review anytime in the FitBuddy community directory.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-emerald-300 text-sm">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>Safe, balanced guidelines without extreme crash diets or risky workouts.</span>
            </div>
            <button
              onClick={() => onNavigate('generate')}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Start Now →
            </button>
          </div>
        </div>
      </section>

      {/* Target Goals Supported */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h3 className="text-2xl font-bold text-slate-900">Supported Fitness Objectives</h3>
          <p className="text-slate-600 text-sm mt-1">Whether your priority is shedding fat or building athletic strength.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Target className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900">Weight Loss</h4>
            <p className="text-xs text-slate-500 mt-1">
              Caloric-conscious whole foods, metabolic conditioning, and daily non-exercise physical activity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900">Muscle Gain</h4>
            <p className="text-xs text-slate-500 mt-1">
              Hypertrophy rep ranges, compound strength lifts, protein targets, and optimal recovery timing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900">Weight Gain</h4>
            <p className="text-xs text-slate-500 mt-1">
              Caloric surplus with nutrient-dense foods, progressive resistance, and structured healthy weight building.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900">General Fitness</h4>
            <p className="text-xs text-slate-500 mt-1">
              Cardiovascular endurance, joint mobility, posture correction, and sustained longevity habits.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-emerald-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-emerald-600/20">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to begin your fitness transformation?</h2>
          <p className="mt-3 text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
            Input your information once and receive a comprehensive, structured plan formatted for your exact goals.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('generate')}
              className="px-8 py-3.5 rounded-xl bg-white text-emerald-800 hover:bg-slate-50 font-bold text-base shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Generate My Fitness Plan
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="px-6 py-3.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white font-medium text-base border border-emerald-400/40 transition-all cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
