import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { calculateFIRE, type FIREResult } from '../lib/calculations';

export function FIREPlanner() {
  const [age, setAge] = useState<number>(25);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(30000);
  const [result, setResult] = useState<FIREResult | null>(null);

  const handleCalculate = () => {
    const fireResult = calculateFIRE(age, monthlyIncome, monthlyExpenses);
    setResult(fireResult);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">FIRE Planner</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Calculate when you can achieve Financial Independence and Retire Early
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Age
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            min="18"
            max="60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Income (₹)
          </label>
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            min="0"
            step="1000"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Calculate FIRE Plan
        </button>
      </div>

      {result && (
        <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your FIRE Plan</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Retirement Age</p>
              <p className="text-2xl font-bold text-green-600">{result.retirementAge}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Years to Go</p>
              <p className="text-2xl font-bold text-blue-600">{result.yearsToRetirement}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Corpus Needed</p>
              <p className="text-xl font-bold text-orange-600">
                ₹{(result.corpusNeeded / 10000000).toFixed(2)}Cr
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">Monthly Investment</p>
              <p className="text-xl font-bold text-purple-600">
                ₹{Math.round(result.monthlyInvestment).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${result.canAchieveFIRE ? 'bg-green-100' : 'bg-orange-100'}`}>
            <p className="text-sm font-medium text-gray-800">{result.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
