// src/components/ui/Button.jsx
import React from "react";

const VARIANT_STYLES = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200",
};

const Button = ({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
  variant = "primary",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded font-semibold transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${VARIANT_STYLES[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
