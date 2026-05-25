import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const setupNotifications = async () => {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
};

export const scheduleTaskDeadlines = async (task) => {
  if (!task.deadline) return;

  const deadlineTime = new Date(task.deadline).getTime();
  const now = new Date().getTime();

  // Cancel any existing notifications for this task
  await cancelTaskNotifications(task.id);

  if (task.status === 'Completed') return;

  const trigger1Day = new Date(deadlineTime - 24 * 60 * 60 * 1000);
  const trigger1Hour = new Date(deadlineTime - 60 * 60 * 1000);
  const triggerDeadline = new Date(deadlineTime);

  if (trigger1Day.getTime() > now) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Deadline Approaching',
        body: `${task.name} is due in 1 day.`,
        data: { taskId: task.id },
      },
      trigger: trigger1Day,
      identifier: `${task.id}-1day`
    });
  }

  if (trigger1Hour.getTime() > now) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Deadline Imminent',
        body: `${task.name} is due in 1 hour!`,
        data: { taskId: task.id },
      },
      trigger: trigger1Hour,
      identifier: `${task.id}-1hour`
    });
  }

  if (triggerDeadline.getTime() > now) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Deadline Reached',
        body: `${task.name} has reached its deadline.`,
        data: { taskId: task.id },
      },
      trigger: triggerDeadline,
      identifier: `${task.id}-deadline`
    });
  }
};

export const cancelTaskNotifications = async (taskId) => {
    await Notifications.cancelScheduledNotificationAsync(`${taskId}-1day`);
    await Notifications.cancelScheduledNotificationAsync(`${taskId}-1hour`);
    await Notifications.cancelScheduledNotificationAsync(`${taskId}-deadline`);
}
