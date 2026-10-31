export const money = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));

export const initials = (name = '') =>
  name.trim().split(/\\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || '?';

export const dateLabel = (date) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
