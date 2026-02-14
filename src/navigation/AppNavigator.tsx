import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DiaryScreen } from '../features/diary/screens/DiaryScreen';
import { WorkoutsScreen } from '../features/workouts/screens/WorkoutsScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import type { AppTabParamList } from './types';

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Diary"
        component={DiaryScreen}
        options={{
          title: 'Diary',
          tabBarLabel: 'Diary',
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          title: 'Workouts',
          tabBarLabel: 'Workouts',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};
