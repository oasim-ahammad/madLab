import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { View, Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import BoardScreen from '../screens/BoardScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TaskListScreen from '../screens/TaskListScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Simple custom tab icons using text/shapes to avoid external icon library dependencies
const TabIcon = ({ name, color }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color, fontSize: 18, fontWeight: 'bold' }}>{name}</Text>
  </View>
);

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1E1E1E', borderTopColor: '#333' },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ 
          title: 'Boards',
          tabBarIcon: ({ color }) => <TabIcon name="☰" color={color} /> 
        }} 
      />
      <Tab.Screen 
        name="TaskList" 
        component={TaskListScreen} 
        options={{ 
          title: 'Tasks',
          tabBarIcon: ({ color }) => <TabIcon name="📝" color={color} /> 
        }} 
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationScreen} 
        options={{ 
          title: 'Alerts',
          tabBarIcon: ({ color }) => <TabIcon name="🔔" color={color} /> 
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon name="👤" color={color} /> 
        }} 
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Board" component={BoardScreen} />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
