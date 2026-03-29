import { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Others',
];

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    if (session) {
      loadExpenses();
    }
  };

  const loadExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })
      .limit(10);

    if (!error && data) {
      setExpenses(data);
    }
  };

  const handleAddExpense = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to track expenses');
      return;
    }

    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Please sign in to add expenses');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('expenses').insert({
      user_id: session.user.id,
      category,
      amount,
      description,
      date,
    });

    if (!error) {
      await loadExpenses();
      setAmount(0);
      setDescription('');
      setCategory(CATEGORIES[0]);
      setDate(new Date().toISOString().split('T')[0]);
    } else {
      alert('Failed to add expense');
    }

    setLoading(false);
  };

  const handleDeleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (!error) {
      await loadExpenses();
    } else {
      alert('Failed to delete expense');
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="w-6 h-6 text-orange-600" />
        <h2 className="text-2xl font-bold text-gray-800">Expense Tracker</h2>
      </div>

      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Sign in to track your expenses and view history
          </p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you spend on?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleAddExpense}
          disabled={loading}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </div>

      {isAuthenticated && expenses.length > 0 && (
        <>
          <div className="mb-6 p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600 mb-1">Total Expenses (Last 10)</p>
            <p className="text-3xl font-bold text-orange-600">
              ₹{totalExpenses.toLocaleString('en-IN')}
            </p>
          </div>

          {Object.keys(categoryTotals).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Category Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(categoryTotals).map(([cat, total]) => (
                  <div key={cat} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">{cat}</p>
                    <p className="text-lg font-bold text-gray-800">
                      ₹{total.toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Recent Expenses
            </h3>
            <div className="space-y-2">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-gray-800">
                        ₹{Number(expense.amount).toLocaleString('en-IN')}
                      </p>
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded">
                        {expense.category}
                      </span>
                    </div>
                    {expense.description && (
                      <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{expense.date}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {isAuthenticated && expenses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No expenses tracked yet. Add your first expense above!</p>
        </div>
      )}
    </div>
  );
}
