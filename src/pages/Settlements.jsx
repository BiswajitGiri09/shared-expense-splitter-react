import { ArrowRight, CheckCircle2, ArrowLeftRight, Wallet } from 'lucide-react';
import { getBalances, getSuggestedPayments, useExpenses } from '../context/ExpenseContext';
import { money } from '../utils';
import Avatar from '../components/Avatar';

export default function Settlements() {
  const { members, expenses, settlements, addSettlement } = useExpenses();
  const balances = getBalances({ members, expenses, settlements });
  const payments = getSuggestedPayments(balances, members);
  const totalOwed = payments.reduce((sum,p) => sum + p.amount,0);
  const settle = (payment) => {
    if (window.confirm(`${payment.from.name} paid ${money(payment.amount)} to ${payment.to.name}?`)) {
      addSettlement({ from: payment.from.id, to: payment.to.id, amount: payment.amount });
    }
  };
  return <>
    <section className="settlement-summary"><div className="settle-summary-icon"><ArrowLeftRight size={22}/></div><div><span>REMAINING TO SETTLE</span><strong>{money(totalOwed)}</strong><p>{payments.length} suggested {payments.length === 1 ? 'payment' : 'payments'} to clear all balances.</p></div></section>
    <div className="section-intro"><div><h2>Suggested payments</h2><p>The simplest way to settle everyone up.</p></div></div>
    <section className="panel settlements-panel">{payments.map((payment,index) => <div className="settlement-row" key={`${payment.from.id}-${payment.to.id}-${index}`}><div className="settlement-person"><Avatar member={payment.from}/><div><strong>{payment.from.name}</strong><span>owes</span></div></div><div className="settlement-middle"><strong>{money(payment.amount)}</strong><ArrowRight size={18}/></div><div className="settlement-person receiver"><Avatar member={payment.to}/><div><strong>{payment.to.name}</strong><span>receives</span></div></div><button className="btn btn-soft settle-button" onClick={() => settle(payment)}><CheckCircle2 size={16}/> Settle up</button></div>)}{!payments.length && <div className="settled-empty"><span><CheckCircle2 size={28}/></span><h3>You're all settled up!</h3><p>There are no outstanding balances between your members.</p></div>}</section>
    <div className="section-intro balance-title"><div><h2>Member balances</h2><p>Positive means they are owed. Negative means they owe.</p></div></div>
    <section className="panel member-balance-list">{members.map(member => <div className="member-balance-row" key={member.id}><div className="payer-cell"><Avatar member={member}/><strong>{member.name}</strong></div><strong className={(balances[member.id] || 0) >= 0 ? 'text-green' : 'text-orange'}>{(balances[member.id] || 0) >= 0 ? '+' : '−'}{money(Math.abs(balances[member.id] || 0))}</strong></div>)}</section>
  </>;
}
