export const formatSalary = (amount) =>
  amount ? `$${Number(amount).toLocaleString()}` : "Not specified";

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const truncateText = (text, length = 120) =>
  text && text.length > length ? `${text.slice(0, length)}...` : text;
