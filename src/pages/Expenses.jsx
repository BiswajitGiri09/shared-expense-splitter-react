import { Search, Trash2, ReceiptText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { money, dateLabel } from '../utils';
import Avatar from '../components/Avatar';

export default function Expenses() {
  const { expenses, members, groups, deleteExpense } = useExpenses();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const filtered = useMemo(() => expenses.filter((item) => {
    const matches = item.title.toLowerCase().includes(query.toLowerCase());
    return matches && (category === 'All' || item.category === category);
  }), [expenses, query, category]);
  const member = (id) => members.find(m => m.id === id);
  return <section className="panel page-panel"><div className="toolbar"><div className="search-box"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search expenses..." /></div><select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>{['All','Food','Travel','Stay','Shopping','Bills','Other'].map(x => <option key={x}>{x}</option>)}</select></div>
    <div className="table-wrap"><table><thead><tr><th>EXPENSE</th><th>GROUP</th><th>PAID BY</th><th>DATE</th><th>AMOUNT</th><th></th></tr></thead><tbody>{filtered.map(item => { const payer = member(item.paidBy); const group = groups.find(g => g.id === item.groupId); return <tr key={item.id}><td><div className="table-title"><span className={`category-icon category-${item.category.toLowerCase()}`}>{item.category === 'Food' ? '🍜' : item.category === 'Travel' ? '🚕' : item.category === 'Stay' ? '🏨' : '🛍️'}</span><span><strong>{item.title}</strong><small>{item.category}</small></span></div></td><td>{group?.name || 'Personal'}</td><td><div className="payer-cell"><Avatar member={payer} size="sm"/>{payer?.name || 'Unknown'}</div></td><td>{dateLabel(item.date)}</td><td className="amount-cell">{money(item.amount)}</td><td><button className="icon-button danger-hover" title="Delete expense" onClick={() => { if (window.confirm('Delete this expense?')) deleteExpense(item.id); }}><Trash2 size={16}/></button></td></tr>; })}</tbody></table>{!filtered.length && <div className="empty-state"><ReceiptText size={28}/><strong>No expenses found</strong><span>Try another search or add a new expense.</span></div>}</div><div className="table-foot">Showing {filtered.length} of {expenses.length} expenses</div>
  </section>;
}
