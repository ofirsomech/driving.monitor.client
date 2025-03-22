import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import InputField from '../components/InputField';
import AuthButton from '../components/AuthButton';
import { registerUser } from '../services/authService';
import styles from '../styles/AuthStyles';

const RegisterScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await registerUser(fullName, email, password);
      Alert.alert('Success', `Account created!`);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to register.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <InputField label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Enter your name" />
      <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" />
      <InputField label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry />
      <AuthButton title="Register" onPress={handleRegister} />
      <AuthButton title="Login Instead" onPress={() => navigation.navigate('LoginScreen')} />
    </View>
  );
};

export default RegisterScreen;
