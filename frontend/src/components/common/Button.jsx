import React from 'react';

const Button = ({ children, variant = 'primary', loading, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} disabled={loading} {...props}>
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : children}
    </button>
  );
};

export default Button;