import { ArrowDownLeft, ArrowUpRight, CreditCard, Wallet, Plus, ArrowRight, MoreHorizontal, TrendingUp } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { getBalances, useExpenses } from '../context/ExpenseContext';
import { money, dateLabel } from '../utils';
import Avatar from '../components/Avatar';

function StatCard({ label, value, note, icon: Icon, tone }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon size={19}/></span></div><strong className="stat-value">{value}</strong><div className="stat-note"><span className="trend"><TrendingUp size={13}/>{note}</span><span>vs last month</span></div></div>;
}

export default function Dashboard() {
  const { members, expenses, groups, settlements, currentUserId } = useExpenses();
  const { openExpenseForm } = useOutletContext();
  const balances = getBalances({ members, expenses, settlements });
  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const myBalance = balances[currentUserId] || 0;
  const owed = members.filter((m) => (balances[m.id] || 0) < 0).reduce((sum,m) => sum + Math.abs(balances[m.id]), 0);
  const receive = members.filter((m) => (balances[m.id] || 0) > 0).reduce((sum,m) => sum + balances[m.id], 0);
  const recent = expenses.slice(0, 5);
  const getMember = (id) => members.find((m) => m.id === id);

  return <>
    <section className="welcome-banner"><div><span className="eyebrow">YOUR MONEY, IN GOOD COMPANY</span><h2>Good things are better <em>shared.</em></h2><p>All your group spending, organised in one happy place.</p><button className="banner-button" onClick={openExpenseForm}>Add a new expense <ArrowRight size={16}/></button></div><div className="banner-art"><div className="art-circle circle-one"/><div className="art-circle circle-two"/><div className="art-card"><span>GROUP TOTAL</span><strong>{money(total)}</strong><div className="art-avatars">{members.slice(0,4).map(m => <Avatar key={m.id} member={m} size="sm"/>)}</div></div><span className="floating-coin coin-one">₹</span><span className="floating-coin coin-two">✦</span></div></section>
    <div className="stats-grid"><StatCard label="Total expenses" value={money(total)} note="+12.8%" icon={CreditCard} tone="blue"/><StatCard label="You are owed" value={money(Math.max(myBalance,0))} note="Looking good" icon={ArrowDownLeft} tone="green"/><StatCard label="You owe" value={money(Math.max(-myBalance,0))} note="Stay on track" icon={ArrowUpRight} tone="orange"/><StatCard label="Active groups" value={groups.length} note={`${members.length} members`} icon={Wallet} tone="purple"/></div>
    <div className="dashboard-grid"><section className="panel transactions-panel"><div className="panel-heading"><div><h3>Recent expenses</h3><p>Your latest group activity</p></div><Link to="/expenses" className="text-link">View all <ArrowRight size={15}/></Link></div><div className="transaction-list">{recent.map((expense) => { const payer = getMember(expense.paidBy); const group = groups.find(g => g.id === expense.groupId); return <div className="transaction-row" key={expense.id}><div className={`category-icon category-${expense.category.toLowerCase()}`}>{expense.category === 'Food' ? '🍜' : expense.category === 'Travel' ? '🚕' : expense.category === 'Stay' ? '🏨' : '🛍️'}</div><div className="transaction-info"><strong>{expense.title}</strong><span>{group?.name || 'Personal'} · Paid by {payer?.name || 'Unknown'}</span></div><div className="transaction-amount"><strong>{money(expense.amount)}</strong><span>{dateLabel(expense.date)}</span></div><button className="icon-button subtle"><MoreHorizontal size={18}/></button></div>; })}{!recent.length && <div className="empty-state">No expenses yet. Add your first shared expense.</div>}</div></section>
      <section className="panel balance-panel"><div className="panel-heading"><div><h3>Your balances</h3><p>Where you stand right now</p></div><Link to="/settlements" className="icon-link"><ArrowRight size={17}/></Link></div><div className={`balance-highlight ${myBalance >= 0 ? 'positive' : 'negative'}`}><span>YOUR NET BALANCE</span><strong>{myBalance >= 0 ? '+' : '−'}{money(Math.abs(myBalance))}</strong><small>{myBalance >= 0 ? 'You are owed overall' : 'You owe overall'}</small></div><div className="balance-breakdown"><div><span><i className="dot dot-green"/>You are owed</span><strong>{money(Math.max(myBalance,0))}</strong></div><div><span><i className="dot dot-orange"/>You owe</span><strong>{money(Math.max(-myBalance,0))}</strong></div></div><Link to="/settlements" className="btn btn-soft btn-full">Settle balances <ArrowRight size={16}/></Link></section>
    </div>
    <section className="panel groups-panel"><div className="panel-heading"><div><h3>Your groups</h3><p>Shared spaces for shared expenses</p></div><Link to="/groups" className="text-link">All groups <ArrowRight size={15}/></Link></div><div className="group-cards">{groups.slice(0,3).map((group,index) => <Link to="/groups" className="group-card" key={group.id}><div className={`group-emoji group-color-${index}`}>{group.emoji}</div><div><strong>{group.name}</strong><span>{group.memberIds.length} members · {expenses.filter(e => e.groupId === group.id).length} expenses</span></div><ArrowRight size={16}/></Link>)}</div></section>
  </>;
}
