export interface FIREResult {
  retirementAge: number;
  yearsToRetirement: number;
  corpusNeeded: number;
  monthlyInvestment: number;
  canAchieveFIRE: boolean;
  message: string;
}

export interface HealthScoreResult {
  score: number;
  rating: string;
  suggestions: string[];
  breakdown: {
    savingsRate: number;
    emergencyFund: number;
    debtRatio: number;
  };
}

export function calculateFIRE(
  age: number,
  monthlyIncome: number,
  monthlyExpenses: number
): FIREResult {
  const annualExpenses = monthlyExpenses * 12;
  const corpusNeeded = annualExpenses * 25;
  const targetRetirementAge = 60;
  const yearsToRetirement = targetRetirementAge - age;

  const monthlySavings = monthlyIncome - monthlyExpenses;
  const annualReturn = 0.12;
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;

  let futureValue = 0;
  if (monthlySavings > 0 && yearsToRetirement > 0) {
    const months = yearsToRetirement * 12;
    futureValue = monthlySavings * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
  }

  const monthlyInvestmentNeeded = corpusNeeded / ((Math.pow(1 + monthlyReturn, yearsToRetirement * 12) - 1) / monthlyReturn);

  const canAchieveFIRE = monthlySavings >= monthlyInvestmentNeeded && yearsToRetirement > 0;

  let message = '';
  if (canAchieveFIRE) {
    message = `Great news! You can achieve FIRE by age ${targetRetirementAge}. Keep investing ₹${Math.round(monthlySavings).toLocaleString('en-IN')} monthly.`;
  } else {
    message = `To achieve FIRE by ${targetRetirementAge}, you need to invest ₹${Math.round(monthlyInvestmentNeeded).toLocaleString('en-IN')} monthly. Consider increasing income or reducing expenses.`;
  }

  return {
    retirementAge: targetRetirementAge,
    yearsToRetirement,
    corpusNeeded,
    monthlyInvestment: monthlyInvestmentNeeded,
    canAchieveFIRE,
    message,
  };
}

export function calculateHealthScore(
  monthlyIncome: number,
  monthlyExpenses: number,
  currentSavings: number
): HealthScoreResult {
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;
  const emergencyFundMonths = monthlyExpenses > 0 ? currentSavings / monthlyExpenses : 0;

  let score = 0;
  const suggestions: string[] = [];

  if (savingsRate >= 30) {
    score += 40;
  } else if (savingsRate >= 20) {
    score += 30;
    suggestions.push('Try to increase savings rate to 30% for better financial health');
  } else if (savingsRate >= 10) {
    score += 20;
    suggestions.push('Your savings rate is low. Aim for at least 20-30% of income');
  } else {
    score += 10;
    suggestions.push('Critical: Increase your savings immediately. Start with 10% and gradually increase');
  }

  if (emergencyFundMonths >= 6) {
    score += 30;
  } else if (emergencyFundMonths >= 3) {
    score += 20;
    suggestions.push('Build your emergency fund to cover 6 months of expenses');
  } else {
    score += 10;
    suggestions.push('Critical: Build emergency fund covering at least 3-6 months of expenses');
  }

  const expenseRatio = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 100;
  if (expenseRatio <= 50) {
    score += 30;
  } else if (expenseRatio <= 70) {
    score += 20;
    suggestions.push('Try to reduce expenses to below 50% of income');
  } else {
    score += 10;
    suggestions.push('Your expenses are too high. Look for areas to cut costs');
  }

  let rating = '';
  if (score >= 80) {
    rating = 'Excellent';
    suggestions.push('Keep up the great work! Consider increasing investments for wealth building');
  } else if (score >= 60) {
    rating = 'Good';
  } else if (score >= 40) {
    rating = 'Fair';
  } else {
    rating = 'Needs Improvement';
  }

  return {
    score,
    rating,
    suggestions,
    breakdown: {
      savingsRate: Math.round(savingsRate),
      emergencyFund: Math.round(emergencyFundMonths * 10) / 10,
      debtRatio: Math.round(expenseRatio),
    },
  };
}

export function calculateGoalSavings(
  targetAmount: number,
  currentAmount: number,
  deadline: string
): { monthlyRequired: number; canAchieve: boolean; message: string } {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const monthsRemaining = Math.max(
    0,
    (deadlineDate.getFullYear() - today.getFullYear()) * 12 +
      (deadlineDate.getMonth() - today.getMonth())
  );

  const amountNeeded = targetAmount - currentAmount;

  if (monthsRemaining === 0) {
    return {
      monthlyRequired: amountNeeded,
      canAchieve: currentAmount >= targetAmount,
      message: 'Deadline has passed or is this month',
    };
  }

  const annualReturn = 0.12;
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;

  const monthlyRequired =
    (amountNeeded * monthlyReturn) / (Math.pow(1 + monthlyReturn, monthsRemaining) - 1);

  const message = `Invest ₹${Math.round(monthlyRequired).toLocaleString('en-IN')} monthly to reach your goal of ₹${targetAmount.toLocaleString('en-IN')} by ${deadline}`;

  return {
    monthlyRequired: isFinite(monthlyRequired) ? monthlyRequired : amountNeeded / monthsRemaining,
    canAchieve: true,
    message,
  };
}

export function generateAIAdvice(
  monthlyIncome: number,
  monthlyExpenses: number,
  currentSavings: number,
  age: number,
  query?: string
): string {
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
  const emergencyFundMonths = monthlyExpenses > 0 ? currentSavings / monthlyExpenses : 0;

  if (query && query.toLowerCase().includes('tax')) {
    return `💡 Tax Saving Tips:\n\n1. Invest in ELSS (Equity Linked Savings Scheme) - Save up to ₹46,800 in taxes under Section 80C\n2. Use PPF (Public Provident Fund) for long-term tax-free returns\n3. Claim HRA if you're paying rent\n4. Invest in NPS (National Pension System) for additional ₹50,000 deduction under Section 80CCD(1B)\n5. Keep health insurance for Section 80D benefits\n\nBased on your income of ₹${monthlyIncome.toLocaleString('en-IN')}/month, you can save significant taxes through smart investments.`;
  }

  if (query && query.toLowerCase().includes('sip')) {
    return `💡 SIP Investment Guide:\n\n1. Start with ₹${Math.min(5000, monthlyIncome * 0.2).toLocaleString('en-IN')}/month\n2. Choose diversified equity mutual funds for long-term (5+ years)\n3. Consider index funds like Nifty 50 for low-cost investing\n4. Increase SIP by 10% annually (Step-up SIP)\n5. Don't stop SIPs during market falls - that's when you get more units!\n\nWith ₹${(monthlyIncome - monthlyExpenses).toLocaleString('en-IN')} monthly savings, you can build significant wealth through SIPs.`;
  }

  const advice: string[] = [];

  advice.push(`📊 Financial Overview:\nAge: ${age} | Income: ₹${monthlyIncome.toLocaleString('en-IN')}/month | Expenses: ₹${monthlyExpenses.toLocaleString('en-IN')}/month | Savings Rate: ${Math.round(savingsRate)}%\n`);

  if (savingsRate < 20) {
    advice.push(`⚠️ Low Savings Alert!\nYour savings rate is ${Math.round(savingsRate)}%. Aim for at least 20-30%. Try the 50-30-20 rule:\n- 50% for needs\n- 30% for wants\n- 20% for savings & investments`);
  }

  if (emergencyFundMonths < 6) {
    advice.push(`🛡️ Emergency Fund Priority!\nYou have ${emergencyFundMonths.toFixed(1)} months of expenses saved. Build this to 6 months (₹${(monthlyExpenses * 6).toLocaleString('en-IN')}) before aggressive investing.`);
  }

  if (age < 30) {
    advice.push(`🚀 Youth Advantage!\nYou have time on your side. Invest 60-70% in equity mutual funds for maximum growth. Start SIPs now to benefit from compounding!`);
  } else if (age < 45) {
    advice.push(`💼 Prime Earning Years!\nBalance growth with stability. Consider 50-60% equity, 30% debt, 10% gold. Focus on retirement planning and children's education if applicable.`);
  } else {
    advice.push(`🎯 Pre-Retirement Focus!\nPreserve wealth while growing. Shift to 40% equity, 50% debt, 10% gold. Review retirement corpus and healthcare coverage.`);
  }

  advice.push(`\n💰 Action Items:\n1. Set up auto-debit for SIPs on salary day\n2. Review and cut 2-3 unnecessary subscriptions\n3. Invest tax refunds and bonuses\n4. Track expenses weekly using this app\n5. Learn about one new investment option monthly`);

  return advice.join('\n\n');
}
