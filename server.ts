import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AIFitnessPlan, FitUser, PlanFormInput, DashboardStats } from './src/types';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini AI client if API key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Initialize Supabase if credentials are provided
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully.');
  } catch (err) {
    console.warn('Supabase initialization failed, falling back to local persistent store:', err);
  }
}

// Local Persistent Store fallback
const DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function getLocalUsers(): FitUser[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local users file:', err);
    return [];
  }
}

function saveLocalUsers(users: FitUser[]) {
  ensureDataFile();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local users file:', err);
  }
}

// Helper: Calculate BMI
function calculateBmi(heightCm: number, weightKg: number) {
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
  let category = 'Normal weight';
  let advice = 'Maintain a balanced diet and regular physical activity.';
  if (bmi < 18.5) {
    category = 'Underweight';
    advice = 'Focus on nutrient-dense foods, adequate caloric intake, and progressive resistance training.';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    advice = 'Combine regular cardiovascular exercise with a moderate caloric deficit and strength training.';
  } else if (bmi >= 30) {
    category = 'Obesity range';
    advice = 'Emphasize low-impact movement (walking, swimming), sustainable nutrition adjustments, and hydration.';
  }
  return { bmi, category, advice };
}

// Fallback high-quality plan generator (when Gemini is busy, rate-limited, or key not yet supplied)
function generateFallbackPlan(input: PlanFormInput): AIFitnessPlan {
  const bmiData = calculateBmi(Number(input.height), Number(input.weight));
  const goal = input.goal || 'General Fitness';
  const activity = input.activity || 'Moderate';
  const pref = input.workout_preference || 'Balanced home & gym exercises';
  const diet = input.dietary_preference || 'Balanced whole foods';
  const time = input.available_time || '45 minutes';

  const isMuscle = goal === 'Muscle Gain';
  const isLoss = goal === 'Weight Loss';
  const isGain = goal === 'Weight Gain';

  return {
    summary: `Hello ${input.name}! Welcome to your FitBuddy personalized fitness roadmap. Designed specifically for a ${input.age}-year-old with a goal of ${goal} and a ${activity.toLowerCase()} current activity level, this program emphasizes sustainable progress, progressive overload, and wholesome nutrition tailored to ${time} sessions focusing on ${pref}.`,
    targetBmi: bmiData,
    workoutPlan: {
      warmUp: [
        '5 minutes of brisk walking, light jogging in place, or jumping jacks to raise heart rate',
        'Dynamic arm circles, shoulder rolls, and torso twists (10-12 reps each direction)',
        'Leg swings (front-to-back and side-to-side) and bodyweight air squats (10 reps)',
        'Hip openers (cat-cow stretch and inchworms with a brief pause at plank)'
      ],
      mainWorkout: [
        {
          exercise: isMuscle ? 'Barbell or Dumbbell Squats' : isLoss ? 'Goblet Squats or Bodyweight Squats' : 'Air Squats to Chair',
          sets: '3-4 sets',
          reps: isMuscle ? '8-10 reps' : isLoss ? '12-15 reps' : '10-12 reps',
          notes: 'Keep chest proud, core braced, and drive through mid-foot.'
        },
        {
          exercise: 'Push-Ups (standard or knee-supported)',
          sets: '3 sets',
          reps: isMuscle ? '8-12 reps' : '10-15 reps',
          notes: 'Maintain a straight line from neck to heels, elbows at a 45-degree angle.'
        },
        {
          exercise: 'Dumbbell Rows or Inverted Table Rows',
          sets: '3 sets',
          reps: '10-12 reps per side',
          notes: 'Squeeze shoulder blades at top of movement without shrugging.'
        },
        {
          exercise: isLoss ? 'Dumbbell Walking Lunges or Step-Ups' : 'Romanian Deadlifts (Dumbbell/Kettlebell)',
          sets: '3 sets',
          reps: '10 reps each leg',
          notes: 'Control the eccentric (lowering) phase for maximum muscular activation.'
        },
        {
          exercise: 'Plank Hold & Deadbug alternating core routine',
          sets: '3 sets',
          reps: '30-45 seconds hold / 12 deadbugs',
          notes: 'Press lower back firmly into the floor during deadbugs; keep core rigid during plank.'
        }
      ],
      coolDown: [
        '3-5 minutes of slow walking to safely lower resting heart rate',
        'Standing quad stretch (hold 25-30 seconds each leg)',
        'Hamstring forward fold stretch (hold 30 seconds with soft knees)',
        'Chest doorway stretch and child pose deep belly breathing (1-2 minutes)'
      ],
      recommendedFrequency: isMuscle ? '4 days per week (e.g., Upper/Lower split)' : isLoss ? '4-5 days per week with active recovery' : '3-4 days per week'
    },
    nutritionGuidance: {
      overview: `A nutrition strategy aligned with ${diet}, focusing on nutrient-dense whole foods, sufficient hydration, and appropriate caloric intake for ${goal.toLowerCase()}.`,
      proteinSources: [
        'Lean poultry (chicken breast, turkey)',
        'Eggs and egg whites',
        'Greek yogurt or low-fat cottage cheese',
        'Tofu, tempeh, lentils, chickpeas, and edamame (plant-based staples)',
        'Wild-caught fish (salmon, tuna, cod) or clean whey/pea protein powder'
      ],
      fruitsVegetables: [
        'Dark leafy greens (spinach, kale, arugula)',
        'Cruciferous vegetables (broccoli, cauliflower, Brussels sprouts)',
        'Antioxidant-rich berries (blueberries, strawberries, raspberries)',
        'Complex carbs: sweet potatoes, oats, quinoa, and brown rice',
        'Apples, bananas, and citrus fruits for natural electrolytes'
      ],
      hydrationTips: `Aim for 2.5 to 3.5 liters of clean water daily. Drink 500ml upon waking, and sip consistently before, during, and after your ${time} workouts.`,
      mealSuggestions: [
        {
          meal: 'Breakfast',
          items: 'Steel-cut oatmeal topped with mixed berries, a scoop of protein or Greek yogurt, and a sprinkle of chia seeds',
          notes: 'Provides sustained complex carbohydrates and fast-absorbing morning protein.'
        },
        {
          meal: 'Lunch',
          items: 'Grilled chicken or marinated baked tofu bowl with quinoa, avocado slices, and mixed steamed vegetables',
          notes: 'Balanced in healthy fats, amino acids, and micronutrients to prevent mid-day slumps.'
        },
        {
          meal: 'Dinner',
          items: 'Pan-seared salmon or hearty lentil stew paired with roasted sweet potatoes and asparagus',
          notes: 'Omega-3 fatty acids and zinc to support nighttime tissue repair and muscle recovery.'
        },
        {
          meal: 'Healthy Snack',
          items: 'Handful of raw almonds with an apple, or carrot sticks with hummus',
          notes: 'Quick, high-fiber, low-glycemic satiety booster between meals.'
        }
      ]
    },
    dailyActivities: [
      'Reach an achievable daily target of 7,500 to 10,000 steps through casual walking',
      'Take 5-minute movement or standing breaks every hour of sedentary desk work',
      'Perform morning neck and spine mobility stretches for 5 minutes',
      'Practice 5 minutes of mindful box breathing before bedtime to lower cortisol levels'
    ],
    weeklySchedule: [
      { day: 'Monday', focus: 'Full Body Strength & Core', activities: 'Main resistance workout focusing on compound pushes and pulls', duration: time },
      { day: 'Tuesday', focus: 'Low-Impact Cardio & Mobility', activities: '30-minute brisk outdoor walk, cycling, or yoga flow', duration: '30-40 mins' },
      { day: 'Wednesday', focus: 'Lower Body & Core Stability', activities: 'Squat and hinge variations, lunges, and plank variations', duration: time },
      { day: 'Thursday', focus: 'Active Recovery', activities: 'Light leisure walk, gentle stretching, and foam rolling', duration: '20-30 mins' },
      { day: 'Friday', focus: 'Upper Body & Conditioning', activities: 'Push-ups, rows, shoulder presses, and interval bursts', duration: time },
      { day: 'Saturday', focus: 'Recreational Activity / Cardio', activities: 'Hiking, swimming, playing a sport, or long nature walk', duration: '45-60 mins' },
      { day: 'Sunday', focus: 'Rest & Meal Prep Day', activities: 'Complete physical rest, hydration check, and grocery prep for the week ahead', duration: 'Rest' }
    ],
    fitnessTips: [
      'Consistency outperforms intensity: Showing up 4 times every week is 10x more effective than one exhausting day.',
      'Prioritize 7-8 hours of quality sleep; human growth hormone and muscle synthesis peak during deep sleep.',
      'Track your weights and repetitions in a simple notebook to apply progressive overload safely.',
      'Listen to your body: Persistent sharp pain is a warning signal to rest or modify the movement.'
    ],
    progressTracking: [
      { metric: 'Body Weight', method: 'Weigh in once a week in the morning after waking and using the restroom', frequency: 'Weekly' },
      { metric: 'Progress Photos', method: 'Take consistent front/side photos in identical lighting and posture', frequency: 'Every 2-4 weeks' },
      { metric: 'Workout Logbook', method: 'Record weights lifted, reps completed, and perceived difficulty', frequency: 'Every workout' },
      { metric: 'Energy & Sleep Quality', method: 'Rate your morning energy and overall mood on a scale of 1-10', frequency: 'Daily' }
    ],
    disclaimer: 'This AI-generated plan is for general fitness and educational purposes only. It is not medical advice. Consult a qualified healthcare professional before starting a new exercise or nutrition program, especially if you have a medical condition.'
  };
}

// AI Plan Generator using Gemini 3.8 Flash
async function generateGeminiPlan(input: PlanFormInput): Promise<{ plan: AIFitnessPlan; isAiGenerated: boolean; note?: string }> {
  if (!ai || !geminiApiKey) {
    console.log('Gemini API key not configured or client missing. Using built-in fitness planner engine.');
    return { plan: generateFallbackPlan(input), isAiGenerated: false, note: 'Generated with FitBuddy Smart Engine (Set GEMINI_API_KEY for live Gemini 3.8 Flash generation).' };
  }

  const prompt = `You are FitBuddy, an AI fitness planning assistant.

Create a simple, practical and personalized general fitness plan based on the following user information:

Name: ${input.name}
Age: ${input.age}
Gender: ${input.gender}
Height: ${input.height} cm
Weight: ${input.weight} kg
Fitness Goal: ${input.goal}
Activity Level: ${input.activity}
Workout Preference: ${input.workout_preference || 'Balanced bodyweight and gym workouts'}
Dietary Preference: ${input.dietary_preference || 'Nutritious balanced whole foods'}
Available Workout Time: ${input.available_time || '45 minutes'}

Provide:
1. Personalized Summary
2. Workout Plan (Warm-up, Main workout with exercises, sets, reps, and form notes, Cool-down, Recommended frequency)
3. Nutrition Guidance (General healthy food suggestions, Protein sources, Fruits and vegetables, Hydration tips, Meal suggestions for breakfast, lunch, dinner, snack)
4. Daily Activity Suggestions
5. Weekly Schedule for all 7 days (Monday through Sunday)
6. General Fitness Tips
7. Progress Tracking Suggestions

Use simple language.
Do not diagnose medical conditions.
Do not claim to treat medical conditions.
Do not prescribe medication.
Do not recommend unsafe extreme diets or exercise.

Include a reminder that the information is general fitness guidance and not medical advice.
Always include the exact mandatory disclaimer:
"This AI-generated plan is for general fitness and educational purposes only. It is not medical advice. Consult a qualified healthcare professional before starting a new exercise or nutrition program, especially if you have a medical condition."`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are FitBuddy, a supportive and knowledgeable fitness advisor. Return valid JSON matching the exact schema requested. Do not include markdown wraps like ```json in the raw string, or ensure it is valid parsable JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'Personalized friendly greeting and summary.' },
            workoutPlan: {
              type: Type.OBJECT,
              properties: {
                warmUp: { type: Type.ARRAY, items: { type: Type.STRING } },
                mainWorkout: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      exercise: { type: Type.STRING },
                      sets: { type: Type.STRING },
                      reps: { type: Type.STRING },
                      notes: { type: Type.STRING }
                    },
                    required: ['exercise', 'sets', 'reps', 'notes']
                  }
                },
                coolDown: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedFrequency: { type: Type.STRING }
              },
              required: ['warmUp', 'mainWorkout', 'coolDown', 'recommendedFrequency']
            },
            nutritionGuidance: {
              type: Type.OBJECT,
              properties: {
                overview: { type: Type.STRING },
                proteinSources: { type: Type.ARRAY, items: { type: Type.STRING } },
                fruitsVegetables: { type: Type.ARRAY, items: { type: Type.STRING } },
                hydrationTips: { type: Type.STRING },
                mealSuggestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      meal: { type: Type.STRING },
                      items: { type: Type.STRING },
                      notes: { type: Type.STRING }
                    },
                    required: ['meal', 'items', 'notes']
                  }
                }
              },
              required: ['overview', 'proteinSources', 'fruitsVegetables', 'hydrationTips', 'mealSuggestions']
            },
            dailyActivities: { type: Type.ARRAY, items: { type: Type.STRING } },
            weeklySchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  activities: { type: Type.STRING },
                  duration: { type: Type.STRING }
                },
                required: ['day', 'focus', 'activities', 'duration']
              }
            },
            fitnessTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            progressTracking: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metric: { type: Type.STRING },
                  method: { type: Type.STRING },
                  frequency: { type: Type.STRING }
                },
                required: ['metric', 'method', 'frequency']
              }
            },
            disclaimer: { type: Type.STRING }
          },
          required: [
            'summary',
            'workoutPlan',
            'nutritionGuidance',
            'dailyActivities',
            'weeklySchedule',
            'fitnessTips',
            'progressTracking',
            'disclaimer'
          ]
        }
      }
    });

    const text = response.text || '';
    const parsedPlan = JSON.parse(text) as AIFitnessPlan;
    // Add BMI data calculation
    parsedPlan.targetBmi = calculateBmi(Number(input.height), Number(input.weight));
    parsedPlan.disclaimer = 'This AI-generated plan is for general fitness and educational purposes only. It is not medical advice. Consult a qualified healthcare professional before starting a new exercise or nutrition program, especially if you have a medical condition.';

    return { plan: parsedPlan, isAiGenerated: true };
  } catch (err: any) {
    console.error('Gemini API call failed:', err?.message || err);
    // Graceful fallback according to requirements
    const fallback = generateFallbackPlan(input);
    return {
      plan: fallback,
      isAiGenerated: false,
      note: 'The AI service is temporarily busy. A tailored standard plan was generated for you. Please try again in a moment.'
    };
  }
}

// Database helper functions (syncing with Supabase if configured, and local JSON storage)
async function getAllUsers(): Promise<FitUser[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as FitUser[];
      }
      console.warn('Supabase query failed, using local storage:', error?.message);
    } catch (e) {
      console.warn('Supabase read error:', e);
    }
  }
  return getLocalUsers();
}

async function saveUser(user: FitUser): Promise<void> {
  // Always persist locally
  const current = getLocalUsers();
  const index = current.findIndex(u => u.id === user.id);
  if (index >= 0) {
    current[index] = user;
  } else {
    current.unshift(user);
  }
  saveLocalUsers(current);

  // Sync to Supabase if available
  if (supabase) {
    try {
      const { error } = await supabase.from('users').upsert({
        id: user.id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        activity: user.activity,
        workout_preference: user.workout_preference || null,
        dietary_preference: user.dietary_preference || null,
        available_time: user.available_time || null,
        plan: user.plan,
        is_demo: user.is_demo || false,
        created_at: user.created_at
      });
      if (error) {
        console.warn('Supabase write notice:', error.message);
      }
    } catch (err) {
      console.warn('Supabase upsert error:', err);
    }
  }
}

async function deleteUserById(id: string): Promise<boolean> {
  const current = getLocalUsers();
  const filtered = current.filter(u => u.id !== id);
  const deleted = filtered.length < current.length;
  saveLocalUsers(filtered);

  if (supabase) {
    try {
      await supabase.from('users').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete error:', err);
    }
  }

  return deleted;
}

// Initial Demo Users Generator
function createDemoUsers(): FitUser[] {
  const now = new Date();
  const demoProfiles: Array<PlanFormInput & { id: string; daysAgo: number }> = [
    {
      id: 'demo-sarah-101',
      name: 'Sarah Jenkins',
      age: 27,
      gender: 'Female',
      height: 168,
      weight: 64,
      goal: 'Weight Loss',
      activity: 'Moderate',
      workout_preference: 'Home Dumbbell & HIIT',
      dietary_preference: 'Mediterranean & High Fiber',
      available_time: '45 mins',
      daysAgo: 1
    },
    {
      id: 'demo-marcus-102',
      name: 'Marcus Chen',
      age: 23,
      gender: 'Male',
      height: 182,
      weight: 74,
      goal: 'Muscle Gain',
      activity: 'High',
      workout_preference: 'Gym Free Weights & Calisthenics',
      dietary_preference: 'High Protein (160g+)',
      available_time: '60 mins',
      daysAgo: 2
    },
    {
      id: 'demo-priya-103',
      name: 'Priya Sharma',
      age: 31,
      gender: 'Female',
      height: 162,
      weight: 58,
      goal: 'General Fitness',
      activity: 'Low',
      workout_preference: 'Yoga, Pilates & Daily Walking',
      dietary_preference: 'Vegetarian Balanced',
      available_time: '30 mins',
      daysAgo: 3
    },
    {
      id: 'demo-david-104',
      name: 'David Miller',
      age: 20,
      gender: 'Male',
      height: 175,
      weight: 61,
      goal: 'Weight Gain',
      activity: 'Moderate',
      workout_preference: 'Compound Strength & Hypertrophy',
      dietary_preference: 'Caloric Surplus & Whole Foods',
      available_time: '50 mins',
      daysAgo: 4
    }
  ];

  return demoProfiles.map(p => {
    const createdDate = new Date(now.getTime() - p.daysAgo * 86400000).toISOString();
    return {
      id: p.id,
      name: p.name,
      age: Number(p.age),
      gender: p.gender as any,
      height: Number(p.height),
      weight: Number(p.weight),
      goal: p.goal as any,
      activity: p.activity as any,
      workout_preference: p.workout_preference,
      dietary_preference: p.dietary_preference,
      available_time: p.available_time,
      plan: generateFallbackPlan(p),
      created_at: createdDate,
      is_demo: true
    };
  });
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Generate Plan & Save User
app.post('/api/plans/generate', async (req: Request, res: Response) => {
  try {
    const {
      name,
      age,
      gender,
      height,
      weight,
      goal,
      activity,
      workout_preference,
      dietary_preference,
      available_time
    } = req.body;

    // Strict validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    const numAge = Number(age);
    if (!numAge || numAge <= 0 || numAge > 120) {
      return res.status(400).json({ error: 'Please enter a valid age between 1 and 120.' });
    }
    if (!gender || !['Female', 'Male', 'Other'].includes(gender)) {
      return res.status(400).json({ error: 'Please select your gender.' });
    }
    const numHeight = Number(height);
    if (!numHeight || numHeight < 50 || numHeight > 260) {
      return res.status(400).json({ error: 'Please enter a valid height in centimeters (50 - 260 cm).' });
    }
    const numWeight = Number(weight);
    if (!numWeight || numWeight < 20 || numWeight > 400) {
      return res.status(400).json({ error: 'Please enter a valid weight in kilograms (20 - 400 kg).' });
    }
    if (!goal || !['Weight Loss', 'Weight Gain', 'Muscle Gain', 'General Fitness'].includes(goal)) {
      return res.status(400).json({ error: 'Please select a valid fitness goal.' });
    }
    if (!activity || !['Low', 'Moderate', 'High'].includes(activity)) {
      return res.status(400).json({ error: 'Please select your current activity level.' });
    }

    const inputData: PlanFormInput = {
      name: name.trim(),
      age: numAge,
      gender,
      height: numHeight,
      weight: numWeight,
      goal,
      activity,
      workout_preference: workout_preference?.trim() || 'Standard balanced training',
      dietary_preference: dietary_preference?.trim() || 'Balanced nutritious meals',
      available_time: available_time?.trim() || '45 mins'
    };

    // Generate AI Plan
    const result = await generateGeminiPlan(inputData);

    // Save to Database
    const userId = 'fit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newUser: FitUser = {
      id: userId,
      name: inputData.name,
      age: numAge,
      gender,
      height: numHeight,
      weight: numWeight,
      goal,
      activity,
      workout_preference: inputData.workout_preference,
      dietary_preference: inputData.dietary_preference,
      available_time: inputData.available_time,
      plan: result.plan,
      created_at: new Date().toISOString(),
      is_demo: false
    };

    await saveUser(newUser);

    return res.status(201).json({
      success: true,
      user: newUser,
      isAiGenerated: result.isAiGenerated,
      note: result.note
    });
  } catch (err: any) {
    console.error('Server error generating fitness plan:', err);
    return res.status(500).json({
      error: 'The AI service is temporarily busy. Please try again in a moment.'
    });
  }
});

// 2. Get All Users
app.get('/api/users', async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.json({ users });
  } catch (err: any) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// 3. Get Single User Details
app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const users = await getAllUsers();
    const user = users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (err: any) {
    console.error('Error fetching user detail:', err);
    return res.status(500).json({ error: 'Failed to retrieve user details' });
  }
});

// 4. Delete User
app.delete('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteUserById(id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found or already deleted' });
    }
    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
});

// 5. Seed Demo Users
app.post('/api/users/seed', async (_req: Request, res: Response) => {
  try {
    const current = await getAllUsers();
    // Only seed if no demo users exist or database is empty
    const nonDemo = current.filter(u => !u.is_demo);
    const demo = createDemoUsers();
    const updated = [...demo, ...nonDemo];
    saveLocalUsers(updated);
    if (supabase) {
      for (const d of demo) {
        await saveUser(d);
      }
    }
    return res.json({ success: true, message: 'Demo users added successfully', count: demo.length });
  } catch (err: any) {
    console.error('Error seeding demo users:', err);
    return res.status(500).json({ error: 'Failed to seed demo users' });
  }
});

// 6. Dashboard Statistics (Derived directly from stored database users)
app.get('/api/stats', async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    const totalUsers = users.length;

    let weightLossCount = 0;
    let weightGainCount = 0;
    let muscleGainCount = 0;
    let generalFitnessCount = 0;

    let totalAge = 0;
    let totalBmi = 0;

    const activityBreakdown = { low: 0, moderate: 0, high: 0 };
    const genderBreakdown = { female: 0, male: 0, other: 0 };

    for (const u of users) {
      if (u.goal === 'Weight Loss') weightLossCount++;
      else if (u.goal === 'Weight Gain') weightGainCount++;
      else if (u.goal === 'Muscle Gain') muscleGainCount++;
      else if (u.goal === 'General Fitness') generalFitnessCount++;

      totalAge += u.age || 0;
      if (u.height && u.weight) {
        const heightM = u.height / 100;
        totalBmi += u.weight / (heightM * heightM);
      }

      const act = (u.activity || '').toLowerCase();
      if (act === 'low') activityBreakdown.low++;
      else if (act === 'moderate') activityBreakdown.moderate++;
      else if (act === 'high') activityBreakdown.high++;

      const gen = (u.gender || '').toLowerCase();
      if (gen === 'female') genderBreakdown.female++;
      else if (gen === 'male') genderBreakdown.male++;
      else genderBreakdown.other++;
    }

    const averageAge = totalUsers > 0 ? Number((totalAge / totalUsers).toFixed(1)) : 0;
    const averageBmi = totalUsers > 0 ? Number((totalBmi / totalUsers).toFixed(1)) : 0;
    const recentUsers = users.slice(0, 5);

    const stats: DashboardStats = {
      totalUsers,
      weightLossCount,
      weightGainCount,
      muscleGainCount,
      generalFitnessCount,
      averageAge,
      averageBmi,
      activityBreakdown,
      genderBreakdown,
      recentUsers
    };

    return res.json({ stats });
  } catch (err: any) {
    console.error('Error computing dashboard statistics:', err);
    return res.status(500).json({ error: 'Failed to calculate stats' });
  }
});

// 7. System info and config check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!geminiApiKey,
    hasSupabase: !!supabase,
    timestamp: new Date().toISOString()
  });
});

// Seed demo users automatically if database is completely empty on start
(async function initDatabase() {
  const users = getLocalUsers();
  if (users.length === 0) {
    console.log('Database empty on start. Populating demo users for showcase...');
    const demo = createDemoUsers();
    saveLocalUsers(demo);
  }
})();

// Start server or Vite middleware
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`FitBuddy-AI server running on http://0.0.0.0:${port}`);
  });
}

startServer();
