import { useState } from 'react';
import { Plus, Users, ArrowRight } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import Modal from '../components/Modal';
import Avatar from '../components/Avatar';
import { money } from '../utils';

export default function Groups() {
  const { groups, members, expenses, addGroup } = useExpenses();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎉');
  const [memberIds, setMemberIds] = useState(members.map(m => m.id));
  const submit = (e) => { e.preventDefault(); if (!name.trim() || !memberIds.length) return; addGroup({ name: name.trim(), emoji, memberIds }); setName(''); setOpen(false); };
  return <>
    <div className="section-intro"><div><h2>All your circles</h2><p>Trips, home, dinners and everything in between.</p></div><button className="btn btn-primary" onClick={() => setOpen(true)}><Plus size={17}/> Create group</button></div>
    <div className="groups-grid">{groups.map((group,index) => { const groupExpenses = expenses.filter(e => e.groupId === group.id); const total = groupExpenses.reduce((s,e) => s + Number(e.amount),0); return <article className="group-detail-card" key={group.id}><div className={`group-card-top group-color-${index % 4}`}><span className="big-emoji">{group.emoji}</span><span className="group-status">ACTIVE</span></div><div className="group-detail-body"><h3>{group.name}</h3><p>{group.memberIds.length} members · {groupExpenses.length} expenses</p><div className="avatar-stack">{group.memberIds.slice(0,5).map(id => { const m = members.find(x => x.id === id); return m ? <Avatar key={id} member={m} size="sm"/> : null; })}</div><div className="group-card-footer"><div><small>TOTAL SPENT</small><strong>{money(total)}</strong></div><span className="round-arrow"><ArrowRight size={17}/></span></div></div></article>; })}{!groups.length && <div className="empty-state">Create your first group to start splitting expenses.</div>}</div>
    {open && <Modal title="Create a group" subtitle="Bring people together around shared spending." onClose={() => setOpen(false)}><form className="form-stack" onSubmit={submit}><label>Group name<input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Weekend trip" required/></label><label>Choose an icon<select value={emoji} onChange={e => setEmoji(e.target.value)}>{['🎉','🏖️','🏠','✈️','🍕','🎓','🚗','🛒'].map(x => <option key={x}>{x}</option>)}</select></label><div><div className="field-label">Add members</div><div className="member-checks">{members.map(m => <label className="check-row" key={m.id}><input type="checkbox" checked={memberIds.includes(m.id)} onChange={() => setMemberIds(old => old.includes(m.id) ? old.filter(x => x !== m.id) : [...old,m.id])}/>{m.name}</label>)}</div></div><div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary">Create group</button></div></form></Modal>}
  </>;
}
