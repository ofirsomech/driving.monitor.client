import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import InputField from '../components/InputField';
import AuthButton from '../components/AuthButton';
import { registerUser } from '../services/authService';
import styles from '../styles/AuthStyles';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await registerUser(name, email, password);
      Alert.alert('Success', `Account created!`);
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to register.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <InputField label="Name" value={name} onChangeText={setName} placeholder="Enter your name" />
      <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" />
      <InputField label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry />
      <AuthButton title="Register" onPress={handleRegister} />
      <AuthButton title="Login Instead" onPress={() => navigation.navigate('LoginScreen')} />
    </View>
  );
};

export default RegisterScreen;
