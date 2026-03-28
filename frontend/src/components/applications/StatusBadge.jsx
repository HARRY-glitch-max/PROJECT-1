// src/components/common/StatusBadge.jsx
import React from "react";

const StatusBadge = ({ status }) => {
  const baseClasses =
    "px-2 py-1 rounded text-xs font-semibold capitalize inline-block";

  const getClasses = () => {
    switch (status) {
      case "submitted":
        return `${baseClasses} bg-slate-200 text-slate-700`;
      case "shortlisted":
      case "scheduled": // ✅ interview scheduled
        return `${baseClasses} bg-green-200 text-green-700`;
      case "rejected":
      case "cancelled": // ✅ interview cancelled
        return `${baseClasses} bg-red-200 text-red-700`;
      case "interview":
      case "completed": // ✅ interview completed
        return `${baseClasses} bg-blue-200 text-blue-700`;
      default:
        return `${baseClasses} bg-slate-100 text-slate-500`;
    }
  };

  return <span className={getClasses()}>{status}</span>;
};

export default StatusBadge;
