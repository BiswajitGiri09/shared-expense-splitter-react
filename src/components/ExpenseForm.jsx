import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import Modal from './Modal';

export default function ExpenseForm({ onClose }) {
  const { members, groups, currentUserId, addExpense } = useExpenses();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [participantIds, setParticipantIds] = useState(groups[0]?.memberIds || [currentUserId]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const chooseGroup = (id) => {
    setGroupId(id);
    const group = groups.find((item) => item.id === id);
    setParticipantIds(group?.memberIds || []);
  };

  const toggleParticipant = (id) => setParticipantIds((old) =>
    old.includes(id) ? old.filter((item) => item !== id) : [...old, id]
  );

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim() || Number(amount) <= 0 || participantIds.length === 0) return;
    addExpense({ title: title.trim(), amount: Number(amount), category, paidBy, groupId, participantIds, date });
    onClose();
  };

  return (
    <Modal title="Add an expense" subtitle="Record a shared payment and split it fairly." onClose={onClose}>
      <form className="form-stack" onSubmit={submit}>
        <label>Expense name<input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Dinner, groceries" /></label>
        <div className="form-grid">
          <label>Amount (₹)<input required type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" /></label>
          <label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}>{['Food','Travel','Stay','Shopping','Bills','Other'].map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
        <div className="form-grid">
          <label>Group<select value={groupId} onChange={(e) => chooseGroup(e.target.value)}>{groups.map((group) => <option key={group.id} value={group.id}>{group.emoji} {group.name}</option>)}</select></label>
          <label>Paid by<select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label>
        </div>
        <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <div>
          <div className="field-label">Split between</div>
          <div className="member-checks">{members.map((member) => <label className="check-row" key={member.id}><input type="checkbox" checked={participantIds.includes(member.id)} onChange={() => toggleParticipant(member.id)} />{member.name}</label>)}</div>
          <p className="field-hint">{participantIds.length ? `Each person pays ${amount && Number(amount) > 0 ? '₹' + (Number(amount) / participantIds.length).toFixed(2) : 'an equal share'}.` : 'Choose at least one member.'}</p>
        </div>
        <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" type="submit">Save expense</button></div>
      </form>
    </Modal>
  );
}
