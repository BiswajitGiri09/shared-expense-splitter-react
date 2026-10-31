import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, Users, Wallet, ArrowLeftRight, Plus, Bell, Search, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import Avatar from './Avatar';
import ExpenseForm from './ExpenseForm';

const links = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/expenses', label: 'Expenses', icon: ReceiptText },
  { to: '/groups', label: 'Groups', icon: Users },
  { to: '/members', label: 'Members', icon: Wallet },
  { to: '/settlements', label: 'Settlements', icon: ArrowLeftRight }
];

const titles = { '/': ['Good afternoon, Biswajit 👋', 'Here’s what’s happening with your shared expenses.'], '/expenses': ['Expenses', 'Keep track of every shared payment.'], '/groups': ['Your groups', 'Organise expenses with the people around you.'], '/members': ['Members', 'Everyone involved in your shared expenses.'], '/settlements': ['Settlements', 'See who owes whom and settle up easily.'] };

export default function Layout() {
  const [showForm, setShowForm] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { members, currentUserId } = useExpenses();
  const currentUser = members.find((m) => m.id === currentUserId) || members[0];
  const heading = titles[location.pathname] || titles['/'];

  return (
    <div className="app-shell">
      {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><span className="brand-mark"><ArrowLeftRight size={21}/></span><span>split<span className="brand-accent">wise</span><small>EXPENSE MANAGER</small></span><button className="mobile-close icon-button" onClick={() => setMobileOpen(false)}><X/></button></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list">{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={19}/><span>{label}</span>{label === 'Expenses' && <span className="nav-count">4</span>}</NavLink>)}</nav>
        <div className="sidebar-bottom"><div className="tip-card"><span className="tip-icon"><Sparkles size={17}/></span><strong>Split smarter</strong><p>Keep every shared moment simple and fair.</p><button onClick={() => setShowForm(true)}>Add an expense <Plus size={14}/></button></div><div className="profile-row"><Avatar member={currentUser}/><div><strong>{currentUser?.name || 'Your profile'}</strong><span>Personal account</span></div><span className="online-dot"/></div></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)}><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{heading[0].replace(' 👋','')}</strong></div><div className="top-actions"><button className="search-trigger"><Search size={17}/> <span>Search anything</span><kbd>⌘ K</kbd></button><button className="icon-button notification"><Bell size={19}/><i/></button><Avatar member={currentUser}/></div></header>
        <div className="page-content"><div className="page-heading"><div><h1>{heading[0]}</h1><p>{heading[1]}</p></div><button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={17}/> Add expense</button></div><Outlet context={{ openExpenseForm: () => setShowForm(true) }}/><footer className="footer">Made for better shared moments <span>•</span> Splitwise demo</footer></div>
      </main>
      {showForm && <ExpenseForm onClose={() => setShowForm(false)}/>}
    </div>
  );
}
