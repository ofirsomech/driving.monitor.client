import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
      <HomeScreen />
    </SafeAreaView>
  );
};

export default App;
