import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const DiaryScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diary</Text>
      <Text style={styles.subtitle}>Your meal and snack entries will appear here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});
