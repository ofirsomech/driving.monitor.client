import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { loadToken } from './src/services/authService';
import DrivingMonitor from './src/screens/DrivingMonitorScreen';


const App = () => {
  useEffect(() => {
    // Load token when app starts
    const initializeAuth = async () => {
      await loadToken();
    };

    initializeAuth();
  }, []);
  return (
    <>

      <AppNavigator />
      {/* <DrivingMonitor /> */}
    </>
  );
}



export default App;
