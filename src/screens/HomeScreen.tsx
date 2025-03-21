import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import InputField from '../components/InputField';
import ResultModal from '../components/ResultModal';
import { submitDrivingData } from '../services/api';
import { DrivingResult } from '../types';
import styles from '../styles/HomeScreenStyles';

const HomeScreen: React.FC = () => {
  const [acceleration, setAcceleration] = useState<string>('');
  const [braking, setBraking] = useState<string>('');
  const [turn, setTurn] = useState<string>('');
  const [result, setResult] = useState<DrivingResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!acceleration || !braking || !turn) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const data = {
        driverId: 'driver123',
        acceleration: parseFloat(acceleration),
        braking: parseFloat(braking),
        turn: parseFloat(turn),
        timestamp: new Date().toISOString(),
      };
      const response = await submitDrivingData(data);
      setResult(response);
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Driving Behavior Monitor</Text>
        <Text style={styles.subtitle}>Track and analyze your driving patterns</Text>
      </View>

      <InputField
        label="Acceleration (m/s²)"
        value={acceleration}
        onChangeText={setAcceleration}
        placeholder="e.g., 2.5"
      />

      <InputField
        label="Braking (m/s²)"
        value={braking}
        onChangeText={setBraking}
        placeholder="e.g., 3.0"
      />

      <InputField
        label="Turn Rate (m/s²)"
        value={turn}
        onChangeText={setTurn}
        placeholder="e.g., 1.5"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Analyze Driving</Text>
        )}
      </TouchableOpacity>

      <ResultModal visible={modalVisible} onClose={() => setModalVisible(false)} result={result} />
    </ScrollView>
  );
};

export default HomeScreen;
