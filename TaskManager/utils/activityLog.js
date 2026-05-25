import { saveActivityLog } from '../storage/storageService';

export const logActivity = async (taskId, owner, action, taskName, column = null) => {
  const time = new Date().toISOString();
  let message = '';

  switch (action) {
    case 'added':
      message = `[${owner}] added [${taskName}] at [${time}]`;
      break;
    case 'updated':
      message = `[${owner}] updated [${taskName}] at [${time}]`;
      break;
    case 'deleted':
      message = `[${owner}] deleted [${taskName}] at [${time}]`;
      break;
    case 'moved':
      message = `[${owner}] moved [${taskName}] to [${column}] at [${time}]`;
      break;
    case 'completed':
      message = `[${owner}] completed [${taskName}] at [${time}]`;
      break;
    default:
      message = `[${owner}] performed [${action}] on [${taskName}] at [${time}]`;
  }

  const log = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    taskId,
    owner,
    action,
    taskName,
    message,
    timestamp: time,
  };

  await saveActivityLog(log);
};
