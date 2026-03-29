import { useState, useEffect } from 'react';
import { Target, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { calculateGoalSavings } from '../lib/calculations';

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  monthly_contribution: number;
}

export function GoalPlanner() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCalculation, setShowCalculation] = useState(false);
  const [calculation, setCalculation] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    if (session) {
      loadGoals();
    }
  };

  const loadGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('deadline', { ascending: true });

    if (!error && data) {
      setGoals(data);
    }
  };

  const handleCalculate = () => {
    if (targetAmount <= 0 || !deadline) {
      alert('Please enter valid target amount and deadline');
      return;
    }

    const result = calculateGoalSavings(targetAmount, currentAmount, deadline);
    setCalculation(result);
    setShowCalculation(true);
  };

  const handleAddGoal = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to add goals');
      return;
    }

    if (!title || targetAmount <= 0 || !deadline) {
      alert('Please fill all fields with valid values');
      return;
    }

    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Please sign in to add goals');
      setLoading(false);
      return;
    }

    const result = calculateGoalSavings(targetAmount, currentAmount, deadline);

    const { error } = await supabase.from('goals').insert({
      user_id: session.user.id,
      title,
      target_amount: targetAmount,
      current_amount: currentAmount,
      deadline,
      monthly_contribution: result.monthlyRequired,
    });

    if (!error) {
      await loadGoals();
      setTitle('');
      setTargetAmount(0);
      setCurrentAmount(0);
      setDeadline('');
      setShowCalculation(false);
    } else {
      alert('Failed to add goal');
    }

    setLoading(false);
  };

  const handleDeleteGoal = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);

    if (!error) {
      await loadGoals();
    } else {
      alert('Failed to delete goal');
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Goal Planner</h2>
      </div>

      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Sign in to save your financial goals and track progress
          </p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goal Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Buy a car, House down payment, Vacation"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Amount (₹)
            </label>
            <input
              type="number"
              value={targetAmount || ''}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Savings (₹)
            </label>
            <input
              type="number"
              value={currentAmount || ''}
              onChange={(e) => setCurrentAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Date
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Calculate Monthly Investment
        </button>

        {showCalculation && calculation && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">{calculation.message}</p>
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={handleAddGoal}
                disabled={loading || !isAuthenticated}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save This Goal'}
              </button>
            </div>
          </div>
        )}
      </div>

      {isAuthenticated && goals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Goals</h3>
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = getProgressPercentage(goal.current_amount, goal.target_amount);
              return (
                <div
                  key={goal.id}
                  className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{goal.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Target by {new Date(goal.deadline).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-700 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-600">Target</p>
                      <p className="text-sm font-bold text-gray-800">
                        ₹{goal.target_amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-600">Current</p>
                      <p className="text-sm font-bold text-green-600">
                        ₹{goal.current_amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-600">Monthly SIP</p>
                      <p className="text-sm font-bold text-blue-600">
                        ₹{Math.round(goal.monthly_contribution).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isAuthenticated && goals.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No goals set yet. Add your first financial goal above!</p>
        </div>
      )}
    </div>
  );
}
