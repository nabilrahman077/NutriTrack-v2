import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface ConfigErrorScreenProps {
  missingKeys: string[];
}

export const ConfigErrorScreen: React.FC<ConfigErrorScreenProps> = ({ missingKeys }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Configuration Error</Text>
        <Text style={styles.message}>
          The app is missing required environment variables. Please configure them to continue.
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Missing Variables:</Text>
          {missingKeys.length > 0 ? (
            <View style={styles.keysList}>
              {missingKeys.map((key) => (
                <Text key={key} style={styles.keyItem}>
                  • {key}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.noKeys}>No missing keys detected</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Fix:</Text>
          <Text style={styles.instructions}>
            1. Create a .env file in the project root{'\n'}
            2. Add the missing environment variables{'\n'}
            3. Restart the Expo development server{'\n'}
            4. Rebuild the app if using a custom dev client
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Example .env file:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {missingKeys.map((key) => `${key}=your_value_here`).join('\n')}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  content: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 24,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  keysList: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  keyItem: {
    fontSize: 14,
    color: '#FF3B30',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  noKeys: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  instructions: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  codeBlock: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333333',
  },
});
