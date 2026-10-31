import { useState } from 'react';
import { Plus, Mail, Users } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { getBalances } from '../context/ExpenseContext';
import { money, initials } from '../utils';
import Modal from '../components/Modal';
import Avatar from '../components/Avatar';

export default function Members() {
  const { members, expenses, settlements, addMember } = useExpenses();
  const balances = getBalances({ members, expenses, settlements });
  const [open,setOpen] = useState(false);
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const submit = (e) => { e.preventDefault(); if (!name.trim()) return; addMember({name:name.trim(),email:email.trim()}); setName('');setEmail('');setOpen(false); };
  return <>
    <div className="section-intro"><div><h2>Your expense circle</h2><p>People who make every plan a little more fun.</p></div><button className="btn btn-primary" onClick={() => setOpen(true)}><Plus size={17}/> Add member</button></div>
    <div className="members-grid">{members.map(member => <article className="member-card" key={member.id}><Avatar member={member} size="xl"/><h3>{member.name}</h3><p><Mail size={14}/>{member.email || 'No email added'}</p><div className="member-balance"><span>Net balance</span><strong className={(balances[member.id] || 0) >= 0 ? 'text-green' : 'text-orange'}>{(balances[member.id] || 0) >= 0 ? '+' : '−'}{money(Math.abs(balances[member.id] || 0))}</strong></div></article>)}</div>
    {open && <Modal title="Add a member" subtitle="Add someone to your expense circle." onClose={() => setOpen(false)}><form className="form-stack" onSubmit={submit}><label>Full name<input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ananya Roy"/></label><label>Email address <span className="optional">(optional)</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com"/></label><div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary">Add member</button></div></form></Modal>}
  </>;
}
