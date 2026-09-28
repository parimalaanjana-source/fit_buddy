export type FitnessGoal = 'Weight Loss' | 'Weight Gain' | 'Muscle Gain' | 'General Fitness';
export type ActivityLevel = 'Low' | 'Moderate' | 'High';
export type Gender = 'Female' | 'Male' | 'Other';

export interface PlanFormInput {
  name: string;
  age: number | string;
  gender: Gender | '';
  height: number | string;
  weight: number | string;
  goal: FitnessGoal | '';
  activity: ActivityLevel | '';
  workout_preference?: string;
  dietary_preference?: string;
  available_time?: string;
}

export interface WorkoutExercise {
  exercise: string;
  sets: string;
  reps: string;
  notes: string;
}

export interface MealSuggestion {
  meal: string;
  items: string;
  notes: string;
}

export interface DaySchedule {
  day: string;
  focus: string;
  activities: string;
  duration: string;
}

export interface ProgressMetric {
  metric: string;
  method: string;
  frequency: string;
}

export interface AIFitnessPlan {
  summary: string;
  targetBmi?: {
    bmi: number;
    category: string;
    advice: string;
  };
  workoutPlan: {
    warmUp: string[];
    mainWorkout: WorkoutExercise[];
    coolDown: string[];
    recommendedFrequency: string;
  };
  nutritionGuidance: {
    overview: string;
    proteinSources: string[];
    fruitsVegetables: string[];
    hydrationTips: string;
    mealSuggestions: MealSuggestion[];
  };
  dailyActivities: string[];
  weeklySchedule: DaySchedule[];
  fitnessTips: string[];
  progressTracking: ProgressMetric[];
  disclaimer: string;
}

export interface FitUser {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  goal: FitnessGoal;
  activity: ActivityLevel;
  workout_preference?: string;
  dietary_preference?: string;
  available_time?: string;
  plan: AIFitnessPlan;
  created_at: string;
  is_demo?: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  weightLossCount: number;
  weightGainCount: number;
  muscleGainCount: number;
  generalFitnessCount: number;
  averageAge: number;
  averageBmi: number;
  activityBreakdown: {
    low: number;
    moderate: number;
    high: number;
  };
  genderBreakdown: {
    female: number;
    male: number;
    other: number;
  };
  recentUsers: FitUser[];
}
