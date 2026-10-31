import { initials } from '../utils';

export default function Avatar({ member, size = 'md' }) {
  return <span className={`avatar avatar-${member?.color || 'blue'} avatar-${size}`}>{initials(member?.name || 'Member')}</span>;
}
