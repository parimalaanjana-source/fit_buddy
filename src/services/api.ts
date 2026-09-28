import { FitUser, PlanFormInput, DashboardStats } from '../types';

export const api = {
  // Generate fitness plan and save user
  async generatePlan(formData: PlanFormInput): Promise<{ user: FitUser; isAiGenerated: boolean; note?: string }> {
    const res = await fetch('/api/plans/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate fitness plan.');
    }
    return data;
  },

  // Get all registered users
  async getUsers(): Promise<FitUser[]> {
    const res = await fetch('/api/users');
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load users.');
    }
    return data.users || [];
  },

  // Get single user details
  async getUserById(id: string): Promise<FitUser> {
    const res = await fetch(`/api/users/${encodeURIComponent(id)}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'User not found.');
    }
    return data.user;
  },

  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    const res = await fetch(`/api/users/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to delete user.');
    }
    return data.success;
  },

  // Seed demo users
  async seedDemoUsers(): Promise<number> {
    const res = await fetch('/api/users/seed', {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to seed demo users.');
    }
    return data.count || 0;
  },

  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    const res = await fetch('/api/stats');
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch statistics.');
    }
    return data.stats;
  },

  // Health check
  async getHealth(): Promise<{ status: string; hasGeminiKey: boolean; hasSupabase: boolean }> {
    const res = await fetch('/api/health');
    return res.json();
  },
};
