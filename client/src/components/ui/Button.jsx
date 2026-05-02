export default function Button({
  children,
  onClick,
  type     = 'button',
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  className = '',
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:   'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500',
    danger:    'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost:     'bg-transparent hover:bg-slate-800 text-slate-300 border border-slate-700',
    success:   'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}