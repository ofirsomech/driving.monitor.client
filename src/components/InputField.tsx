import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import styles from '../styles/InputFieldStyle';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChangeText, placeholder, secureTextEntry }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#a0a0a0"
    />
  </View>
);

export default InputField;
