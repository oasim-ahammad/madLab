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

export const parseRequiredTime = (timeStr) => {
  if (!timeStr) return 0;
  
  // if it's just a number, assume hours for backwards compatibility
  if (!isNaN(timeStr)) {
    return parseFloat(timeStr) * 60 * 60 * 1000;
  }
  
  const lowerStr = timeStr.toString().toLowerCase().trim();
  const match = lowerStr.match(/^([\d.]+)\s*(hour|hours|h|day|days|d|week|weeks|w|month|months|m)$/);
  
  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[2];
    
    if (unit.startsWith('h')) return value * 60 * 60 * 1000;
    if (unit.startsWith('d')) return value * 24 * 60 * 60 * 1000;
    if (unit.startsWith('w')) return value * 7 * 24 * 60 * 60 * 1000;
    if (unit.startsWith('m')) return value * 30 * 24 * 60 * 60 * 1000;
  }
  
  return 0; // fallback
};
