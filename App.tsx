import { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, Sparkles } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { FIREPlanner } from './components/FIREPlanner';
import { HealthScore } from './components/HealthScore';
import { AIChat } from './components/AIChat';
import { ExpenseTracker } from './components/ExpenseTracker';
import { GoalPlanner } from './components/GoalPlanner';
import { IncomeExpenseChart } from './components/IncomeExpenseChart';

type Section = 'overview' | 'fire' | 'health' | 'chat' | 'expenses' | 'goals';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [income, setIncome] = useState(50000);
  const [expenses, setExpenses] = useState(30000);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const navItems = [
    { id: 'overview' as Section, label: 'Overview', icon: '📊' },
    { id: 'fire' as Section, label: 'FIRE Planner', icon: '🔥' },
    { id: 'health' as Section, label: 'Health Score', icon: '💪' },
    { id: 'chat' as Section, label: 'AI Mentor', icon: '🤖' },
    { id: 'expenses' as Section, label: 'Expenses', icon: '💰' },
    { id: 'goals' as Section, label: 'Goals', icon: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AI Money Mentor
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Sign In
                </button>
              )}
            </div>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-800"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`${showMobileMenu ? 'block' : 'hidden'} md:flex md:items-center md:gap-2 py-2`}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full md:w-auto px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 p-4">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowAuth(true);
                  setShowMobileMenu(false);
                }}
                className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {navItems.find((item) => item.id === activeSection)?.label}
          </h2>
          <p className="text-gray-600">
            Your personal AI-powered financial companion
          </p>
        </div>

        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Welcome to AI Money Mentor</h3>
              <p className="text-green-50 mb-4">
                Your affordable, AI-powered personal finance companion. Get expert financial advice
                without the ₹25,000+ yearly fee.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-3xl font-bold">95%</p>
                  <p className="text-green-50 text-sm">Indians lack financial planning</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-3xl font-bold">₹25K+</p>
                  <p className="text-green-50 text-sm">Avg. financial advisor cost/year</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-3xl font-bold">FREE</p>
                  <p className="text-green-50 text-sm">AI-powered advice for all</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Financial Setup</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Expenses (₹)
                  </label>
                  <input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <IncomeExpenseChart income={income} expenses={expenses} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {navItems.slice(1).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.label}</h3>
                  <p className="text-gray-600 text-sm">
                    {item.id === 'fire' && 'Plan your Financial Independence & Early Retirement'}
                    {item.id === 'health' && 'Assess your overall financial wellness'}
                    {item.id === 'chat' && 'Get personalized AI financial advice'}
                    {item.id === 'expenses' && 'Track and analyze your spending'}
                    {item.id === 'goals' && 'Set and achieve financial milestones'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'fire' && <FIREPlanner />}
        {activeSection === 'health' && <HealthScore />}
        {activeSection === 'chat' && <AIChat />}
        {activeSection === 'expenses' && <ExpenseTracker />}
        {activeSection === 'goals' && <GoalPlanner />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            AI Money Mentor - Making financial planning accessible to all Indians
          </p>
        </div>
      </footer>

      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default App;
