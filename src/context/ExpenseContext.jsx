import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ExpenseContext = createContext(null);
const STORAGE_KEY = 'splitwise-demo-v1';

const starterData = {
  currentUserId: 'm1',
  members: [
    { id: 'm1', name: 'Biswajit Giri', email: 'biswajit@example.com', color: 'blue' },
    { id: 'm2', name: 'Aarav Sharma', email: 'aarav@example.com', color: 'purple' },
    { id: 'm3', name: 'Priya Das', email: 'priya@example.com', color: 'orange' },
    { id: 'm4', name: 'Rohan Sen', email: 'rohan@example.com', color: 'green' }
  ],
  groups: [
    { id: 'g1', name: 'Goa Trip', emoji: '🏖️', memberIds: ['m1', 'm2', 'm3', 'm4'] },
    { id: 'g2', name: 'Flat Expenses', emoji: '🏠', memberIds: ['m1', 'm2', 'm4'] }
  ],
  expenses: [
    { id: 'e1', title: 'Beach resort booking', amount: 8400, category: 'Stay', paidBy: 'm2', groupId: 'g1', participantIds: ['m1','m2','m3','m4'], date: '2026-10-28' },
    { id: 'e2', title: 'Dinner at Fisherman’s Wharf', amount: 3200, category: 'Food', paidBy: 'm1', groupId: 'g1', participantIds: ['m1','m2','m3','m4'], date: '2026-10-29' },
    { id: 'e3', title: 'Taxi to airport', amount: 1600, category: 'Travel', paidBy: 'm3', groupId: 'g1', participantIds: ['m1','m2','m3','m4'], date: '2026-10-30' },
    { id: 'e4', title: 'Monthly groceries', amount: 2400, category: 'Shopping', paidBy: 'm4', groupId: 'g2', participantIds: ['m1','m2','m4'], date: '2026-10-30' }
  ],
  settlements: []
};

function readData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...starterData, ...JSON.parse(saved) } : starterData;
  } catch {
    return starterData;
  }
}

export function ExpenseProvider({ children }) {
  const [data, setData] = useState(readData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addExpense = (expense) => setData((old) => ({
    ...old,
    expenses: [{ ...expense, id: crypto.randomUUID(), date: expense.date || new Date().toISOString().slice(0, 10) }, ...old.expenses]
  }));

  const deleteExpense = (id) => setData((old) => ({ ...old, expenses: old.expenses.filter((item) => item.id !== id) }));

  const addMember = (member) => setData((old) => ({
    ...old,
    members: [...old.members, { ...member, id: crypto.randomUUID(), color: ['blue','purple','orange','green'][old.members.length % 4] }]
  }));

  const addGroup = (group) => setData((old) => ({
    ...old,
    groups: [...old.groups, { ...group, id: crypto.randomUUID() }]
  }));

  const addSettlement = (settlement) => setData((old) => ({
    ...old,
    settlements: [...old.settlements, { ...settlement, id: crypto.randomUUID(), date: new Date().toISOString() }]
  }));

  const resetDemo = () => setData(starterData);

  const value = useMemo(() => ({
    ...data, addExpense, deleteExpense, addMember, addGroup, addSettlement, resetDemo
  }), [data]);

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses must be used inside ExpenseProvider');
  return context;
};

export function getBalances({ members, expenses, settlements }) {
  const balances = Object.fromEntries(members.map((member) => [member.id, 0]));
  expenses.forEach((expense) => {
    const participants = expense.participantIds || [];
    if (!participants.length) return;
    const share = Number(expense.amount) / participants.length;
    participants.forEach((id) => { balances[id] = (balances[id] || 0) - share; });
    balances[expense.paidBy] = (balances[expense.paidBy] || 0) + Number(expense.amount);
  });
  settlements.forEach((item) => {
    balances[item.from] = (balances[item.from] || 0) + Number(item.amount);
    balances[item.to] = (balances[item.to] || 0) - Number(item.amount);
  });
  return balances;
}

export function getSuggestedPayments(balances, members) {
  const creditors = members.map((m) => ({ ...m, balance: balances[m.id] || 0 })).filter((m) => m.balance > 0.5).sort((a,b) => b.balance-a.balance);
  const debtors = members.map((m) => ({ ...m, balance: balances[m.id] || 0 })).filter((m) => m.balance < -0.5).sort((a,b) => a.balance-b.balance);
  const payments = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(-debtors[i].balance, creditors[j].balance);
    if (amount > 0.5) payments.push({ from: debtors[i], to: creditors[j], amount: Math.round(amount * 100) / 100 });
    debtors[i].balance += amount;
    creditors[j].balance -= amount;
    if (Math.abs(debtors[i].balance) < 0.5) i++;
    if (Math.abs(creditors[j].balance) < 0.5) j++;
  }
  return payments;
}
