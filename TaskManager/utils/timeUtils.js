export const getRemainingTime = (deadline) => {
  if (!deadline) return 'No deadline';

  const now = new Date();
  const end = new Date(deadline);
  
  const diffMs = end - now;
  if (diffMs <= 0) return 'Overdue';

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h remaining`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m remaining`;
  }
  return `${diffMinutes}m remaining`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};
