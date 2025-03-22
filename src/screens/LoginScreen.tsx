import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import InputField from '../components/InputField';
import AuthButton from '../components/AuthButton';
import { loginUser } from '../services/authService';
import styles from '../styles/AuthStyles';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await loginUser(email, password);
      Alert.alert('Success', `Welcome back!`);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Invalid credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" />
      <InputField label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry />
      <AuthButton title="Login" onPress={handleLogin} />
      <AuthButton title="Register Instead" onPress={() => navigation.navigate('RegisterScreen')} />
    </View>
  );
};

export default LoginScreen;
