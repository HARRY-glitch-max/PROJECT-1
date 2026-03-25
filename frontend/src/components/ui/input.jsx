// src/components/ui/Input.jsx
import React from "react";

const Input = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  className = "",
  required = false,
}) => {
  return (
    <input
      type={type}
      id={name}          // ✅ unique id for accessibility & autofill
      name={name}        // ✅ ensures formData updates correctly
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoComplete={name} // ✅ helps browser autofill (optional but recommended)
      className={`w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300 focus:outline-none ${className}`}
    />
  );
};

export default Input;
