// src/components/common/ReloadButton.jsx
import React from "react";

const ReloadButton = ({ onReload }) => {
  return (
    <button
      onClick={onReload || (() => window.location.reload())}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Reload
    </button>
  );
};

export default ReloadButton;
