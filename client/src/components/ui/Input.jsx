export default function Input({
  label,
  name,
  type      = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled  = false,
  required  = false,
  icon,
  className = '',
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm text-slate-400">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-slate-800 border rounded-lg py-2.5 text-slate-100 placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed transition
            ${icon ? 'pl-9 pr-4' : 'px-4'}
            ${error ? 'border-red-500' : 'border-slate-700'}`}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}