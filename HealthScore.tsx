import { useState } from 'react';
import { Activity } from 'lucide-react';
import { calculateHealthScore, type HealthScoreResult } from '../lib/calculations';

export function HealthScore() {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(30000);
  const [currentSavings, setCurrentSavings] = useState<number>(100000);
  const [result, setResult] = useState<HealthScoreResult | null>(null);

  const handleCalculate = () => {
    const scoreResult = calculateHealthScore(monthlyIncome, monthlyExpenses, currentSavings);
    setResult(scoreResult);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-blue-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Financial Health Score</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Get a comprehensive assessment of your financial wellbeing
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Income (₹)
          </label>
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Expenses (₹)
          </label>
          <input
            type="number"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Savings (₹)
          </label>
          <input
            type="number"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="10000"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Calculate Health Score
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className={`p-6 rounded-lg ${getScoreBgColor(result.score)}`}>
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-2">Your Score</p>
              <p className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}/100
              </p>
              <p className={`text-xl font-semibold mt-2 ${getScoreColor(result.score)}`}>
                {result.rating}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600">Savings Rate</p>
                <p className="text-lg font-bold text-gray-800">{result.breakdown.savingsRate}%</p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600">Emergency Fund</p>
                <p className="text-lg font-bold text-gray-800">{result.breakdown.emergencyFund}m</p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600">Expense Ratio</p>
                <p className="text-lg font-bold text-gray-800">{result.breakdown.debtRatio}%</p>
              </div>
            </div>
          </div>

          {result.suggestions.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
