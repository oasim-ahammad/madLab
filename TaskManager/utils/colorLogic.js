export const getTaskColor = (startDate, requiredTime, status) => {
  if (status === 'Completed') {
    return 'rgb(0, 255, 0)'; // Full Green
  }

  if (!startDate || !requiredTime) {
    return 'rgb(128, 128, 128)'; // Default gray
  }

  const start = new Date(startDate).getTime();
  const now = new Date().getTime();
  const requiredMs = requiredTime * 60 * 60 * 1000; // assuming requiredTime is in hours

  const passedTime = Math.max(0, now - start);
  const initialTime = requiredMs;

  let progress = passedTime / initialTime;
  if (progress > 1) progress = 1; // Cap at 100%

  // Rg = 255 - ((255 / InitialTime) * PassedTime)
  // Rr = (255 / InitialTime) * PassedTime
  const Rg = Math.max(0, Math.min(255, 255 - (255 * progress)));
  const Rr = Math.max(0, Math.min(255, 255 * progress));

  return `rgb(${Math.round(Rr)}, ${Math.round(Rg)}, 0)`;
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'red';
    case 'Medium':
      return 'orange';
    case 'Low':
      return 'blue';
    default:
      return 'transparent';
  }
};
