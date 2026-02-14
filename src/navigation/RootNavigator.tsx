import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { LoadingScreen } from '../shared/components/LoadingScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator with auth gate pattern
 * - Shows LoadingScreen while checking auth state
 * - Routes to AuthNavigator if unauthenticated
 * - Routes to AppNavigator if authenticated
 * 
 * For now, uses a fake boolean to simulate auth state.
 * This will be replaced with real Firebase Auth logic later.
 */
export const RootNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate auth check (will be replaced with Firebase Auth later)
    const checkAuth = async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Fake auth state - set to false to show auth screens, true to show app
      setIsAuthenticated(false);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
