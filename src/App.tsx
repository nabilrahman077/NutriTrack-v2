import React, { useState, useEffect } from 'react';
import { RootNavigator } from './navigation/RootNavigator';
import { ConfigErrorScreen } from './shared/components/ConfigErrorScreen';
import { LoadingScreen } from './shared/components/LoadingScreen';
import { validateEnv } from './config/env';

/**
 * Root App component
 * - Validates environment variables at startup
 * - Shows ConfigErrorScreen if config is missing
 * - Shows RootNavigator if config is valid
 */
export default function App() {
  const [isCheckingConfig, setIsCheckingConfig] = useState(true);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);

  useEffect(() => {
    // Validate environment variables
    const missing = validateEnv();
    setMissingKeys(missing);
    setIsCheckingConfig(false);
  }, []);

  if (isCheckingConfig) {
    return <LoadingScreen />;
  }

  if (missingKeys.length > 0) {
    return <ConfigErrorScreen missingKeys={missingKeys} />;
  }

  return <RootNavigator />;
}
