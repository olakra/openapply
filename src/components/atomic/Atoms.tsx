import React from 'react';

/**
 * Props schema for Button component.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Button component atom.
 * @param props - ButtonProps object
 * @returns React element
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles =
    'font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 focus:outline-none';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs',
    outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const sizes = {
    sm: 'px-2 py-1 text-[11px]',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm'
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

/**
 * Badge component atom for status tag rendering.
 * @param props - Component props
 * @returns React element
 */
export const Badge: React.FC<{
  children: React.ReactNode;
  color?: 'emerald' | 'amber' | 'blue' | 'indigo' | 'red';
}> = ({ children, color = 'emerald' }) => {
  const styles = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    red: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${styles[color]}`}>{children}</span>
  );
};

/**
 * Toggle switch component atom.
 * @param props - Component props
 * @returns React element
 */
export const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}> = ({ checked, onChange, label, disabled = false }) => (
  <label className="flex items-center justify-between cursor-pointer group">
    <span className="text-xs text-slate-700 group-hover:text-slate-900 transition font-medium">{label}</span>
    <input
      type="checkbox"
      disabled={disabled}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer disabled:opacity-40"
    />
  </label>
);
