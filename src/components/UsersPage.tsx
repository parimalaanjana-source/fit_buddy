import React, { useState, useEffect } from 'react';
import { FitUser, FitnessGoal } from '../types';
import { api } from '../services/api';
import { UserDetailsModal } from './UserDetailsModal';
import {
  Users,
  Search,
  Trash2,
  Eye,
  Filter,
  UserPlus,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface UsersPageProps {
  onNavigateToGenerate: () => void;
}

export const UsersPage: React.FC<UsersPageProps> = ({ onNavigateToGenerate }) => {
  const [users, setUsers] = useState<FitUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [goalFilter, setGoalFilter] = useState<string>('All');
  const [activityFilter, setActivityFilter] = useState<string>('All');

  // Selected User Modal
  const [selectedUser, setSelectedUser] = useState<FitUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }
      setUserToDelete(null);
      showToast('User deleted successfully.');
    } catch (err: any) {
      console.error('Error deleting user:', err);
      showToast('Failed to delete user.');
    }
  };

  const handleSeedDemoUsers = async () => {
    setIsLoading(true);
    try {
      await api.seedDemoUsers();
      await fetchUsers();
      showToast('Demo users loaded successfully.');
    } catch (err: any) {
      console.error('Error seeding demo users:', err);
      showToast('Failed to seed demo users.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered Users Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.goal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGoal = goalFilter === 'All' || user.goal === goalFilter;
    const matchesActivity = activityFilter === 'All' || user.activity === activityFilter;

    return matchesSearch && matchesGoal && matchesActivity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            Community Directory
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            FitBuddy Users
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse stored user profiles and view their personalized AI fitness plans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            title="Refresh user list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <button
            onClick={handleSeedDemoUsers}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Populate demo users for testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            <span>Load Demo Users</span>
          </button>

          <button
            onClick={onNavigateToGenerate}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Plan</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs mb-6 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search input */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by user name, goal, or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Goal Filter */}
        <div className="sm:col-span-3">
          <select
            value={goalFilter}
            onChange={e => setGoalFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="All">All Goals</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Weight Gain">Weight Gain</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="General Fitness">General Fitness</option>
          </select>
        </div>

        {/* Activity Filter */}
        <div className="sm:col-span-3">
          <select
            value={activityFilter}
            onChange={e => setActivityFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="All">All Activities</option>
            <option value="Low">Low Activity</option>
            <option value="Moderate">Moderate Activity</option>
            <option value="High">High Activity</option>
          </select>
        </div>
      </div>

      {/* Main Content: Users List or Empty State */}
      {isLoading && users.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">Loading users database...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No users found</h3>
            <p className="text-sm text-slate-500 mt-1">
              {searchTerm || goalFilter !== 'All' || activityFilter !== 'All'
                ? 'Try adjusting your search criteria or resetting filters.'
                : 'No users have generated a plan yet. Create your first fitness plan or load demo users.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {(searchTerm || goalFilter !== 'All' || activityFilter !== 'All') ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setGoalFilter('All');
                  setActivityFilter('All');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Clear Filters
              </button>
            ) : (
              <>
                <button
                  onClick={onNavigateToGenerate}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Generate First Plan
                </button>
                <button
                  onClick={handleSeedDemoUsers}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Add Demo Users
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-4 py-4">Age / Gender</th>
                  <th className="px-4 py-4">Height & Weight</th>
                  <th className="px-4 py-4">Fitness Goal</th>
                  <th className="px-4 py-4">Activity</th>
                  <th className="px-4 py-4">Created Date</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">
                      {user.id.slice(0, 8)}...
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{user.name}</span>
                        {user.is_demo && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                            Demo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700 text-xs">
                      {user.age} yrs • {user.gender}
                    </td>
                    <td className="px-4 py-4 text-slate-700 text-xs">
                      {user.height} cm / {user.weight} kg
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
                        {user.goal}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                        {user.activity}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                          title="View complete plan"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Plan</span>
                        </button>
                        <button
                          onClick={() => setUserToDelete(user.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{user.name}</h3>
                      {user.is_demo && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                          Demo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Registered {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {user.goal}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 text-slate-600">
                  <div>
                    <span className="text-slate-400">Age/Gender:</span> {user.age} yrs, {user.gender}
                  </div>
                  <div>
                    <span className="text-slate-400">Activity:</span> {user.activity}
                  </div>
                  <div>
                    <span className="text-slate-400">Height:</span> {user.height} cm
                  </div>
                  <div>
                    <span className="text-slate-400">Weight:</span> {user.weight} kg
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-400">ID: {user.id.slice(0, 10)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => setUserToDelete(user.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Confirmation Modal for Delete */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Delete User Profile?</h3>
              <p className="text-xs text-slate-500 mt-1">
                This action permanently removes the user and their associated AI fitness plan from the database.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(userToDelete)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Detailed Plan Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={(id) => handleDeleteUser(id)}
        />
      )}
    </div>
  );
};
