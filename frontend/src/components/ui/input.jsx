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
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300 focus:outline-none ${className}`}
    />
  );
};

export default Input;
