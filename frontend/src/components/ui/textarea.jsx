import React from "react";

const Textarea = ({
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  className = "",
  required = false,
}) => {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className={`w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300 focus:outline-none ${className}`}
    />
  );
};

export default Textarea;
