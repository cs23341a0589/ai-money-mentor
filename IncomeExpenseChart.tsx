import { BarChart3 } from 'lucide-react';

interface ChartProps {
  income: number;
  expenses: number;
}

export function IncomeExpenseChart({ income, expenses }: ChartProps) {
  const maxValue = Math.max(income, expenses);
  const incomeHeight = maxValue > 0 ? (income / maxValue) * 200 : 0;
  const expensesHeight = maxValue > 0 ? (expenses / maxValue) * 200 : 0;
  const savings = income - expenses;
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
      </div>

      <div className="flex items-end justify-around h-64 mb-6 bg-gradient-to-b from-gray-50 to-white rounded-lg p-4">
        <div className="flex flex-col items-center">
          <div
            className="w-24 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500 flex items-end justify-center pb-2"
            style={{ height: `${incomeHeight}px`, minHeight: '30px' }}
          >
            <span className="text-white text-xs font-bold">
              {incomeHeight > 40 && '₹' + (income / 1000).toFixed(0) + 'K'}
            </span>
          </div>
          <p className="mt-3 font-semibold text-gray-700">Income</p>
          <p className="text-lg font-bold text-green-600">
            ₹{income.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="w-24 bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg transition-all duration-500 flex items-end justify-center pb-2"
            style={{ height: `${expensesHeight}px`, minHeight: '30px' }}
          >
            <span className="text-white text-xs font-bold">
              {expensesHeight > 40 && '₹' + (expenses / 1000).toFixed(0) + 'K'}
            </span>
          </div>
          <p className="mt-3 font-semibold text-gray-700">Expenses</p>
          <p className="text-lg font-bold text-red-600">
            ₹{expenses.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="w-24 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 flex items-end justify-center pb-2"
            style={{
              height: `${Math.max(0, (savings / maxValue) * 200)}px`,
              minHeight: '30px',
            }}
          >
            <span className="text-white text-xs font-bold">
              {savings > 0 && Math.max(0, (savings / maxValue) * 200) > 40 && '₹' + (savings / 1000).toFixed(0) + 'K'}
            </span>
          </div>
          <p className="mt-3 font-semibold text-gray-700">Savings</p>
          <p className={`text-lg font-bold ${savings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ₹{savings.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Monthly Income</p>
          <p className="text-xl font-bold text-green-600">
            ₹{income.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-gray-600 mb-1">Monthly Expenses</p>
          <p className="text-xl font-bold text-red-600">
            ₹{expenses.toLocaleString('en-IN')}
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${savings >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
          <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
          <p className={`text-xl font-bold ${savings >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {savingsRate}%
          </p>
        </div>
      </div>

      {savings < 0 && (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800 font-medium">
            Your expenses exceed your income. Consider reducing expenses or increasing income to build savings.
          </p>
        </div>
      )}

      {savings >= 0 && Number(savingsRate) < 20 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">
            Your savings rate is {savingsRate}%. Try to aim for at least 20-30% to build wealth faster.
          </p>
        </div>
      )}

      {Number(savingsRate) >= 30 && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            Excellent! Your savings rate of {savingsRate}% is great. Keep it up!
          </p>
        </div>
      )}
    </div>
  );
}
