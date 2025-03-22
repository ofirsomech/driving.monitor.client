import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen'; // Replace with your actual HomeScreen path
import LoginScreen from '../screens/LoginScreen'; // Replace with your actual LoginScreen path
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={({ route, navigation }) => ({
          headerLeft: () => null,
          gestureEnabled: false
        })}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
