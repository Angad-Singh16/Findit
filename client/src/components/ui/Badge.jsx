export default function Badge({ children, color = 'blue', className = '' }) {
  const colors = {
    blue:   'bg-blue-500/20   text-blue-400   border-blue-500/30',
    green:  'bg-green-500/20  text-green-400  border-green-500/30',
    red:    'bg-red-500/20    text-red-400    border-red-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    slate:  'bg-slate-500/20  text-slate-400  border-slate-500/30',
  };

  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colors[color] || colors.blue} ${className}`}>
      {children}
    </span>
  );
}