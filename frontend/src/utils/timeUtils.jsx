// src/utils/timeUtils.jsx
export const getTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now - date;
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHours = Math.floor(diffInMin / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMin < 1) return "az önce";
  if (diffInMin < 60) return `${diffInMin} dakika önce`;
  if (diffInHours < 24) return `${diffInHours} saat önce`;
  if (diffInDays < 7) return `${diffInDays} gün önce`;

  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};
