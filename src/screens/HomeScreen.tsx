import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import InputField from '../components/InputField';
import ResultModal from '../components/ResultModal';
import { submitDrivingData, getAverageScore } from '../services/api';
import { DrivingResult } from '../types';
import styles from '../styles/HomeScreenStyles';

// Define the JWT payload type
interface JwtPayload {
  user: {
    id: string;
    fullName?: string;
    email?: string;
  };
  iat: number;
  exp: number;
}

const HomeScreen: React.FC = ({ navigation }: any) => {
  const [acceleration, setAcceleration] = useState<string>('');
  const [braking, setBraking] = useState<string>('');
  const [turn, setTurn] = useState<string>('');
  const [result, setResult] = useState<DrivingResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('User');
  const [user, setUser] = useState<any>();
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [greeting, setGreeting] = useState<string>('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    // Get user info from JWT token
    const getUserInfoFromToken = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          // Decode the JWT token
          const decoded = jwtDecode<JwtPayload>(token);

          // Extract user info from the decoded token
          if (decoded.user) {
            setUserName(decoded.user.fullName || 'User');
            setUser(decoded.user);
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };

    // Fetch average score
    const fetchAverageScore = async () => {
      try {
        const score = await getAverageScore(user.id);
        setAverageScore(score);
      } catch (error) {
        console.error('Error fetching average score:', error);
      }
    };

    getUserInfoFromToken();
    fetchAverageScore();
  }, []);

  const handleSubmit = async () => {
    if (!acceleration || !braking || !turn) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // Get user ID from JWT token
      const token = await AsyncStorage.getItem('auth_token');
      let driverId = user.id; // Default value

      if (token) {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.user && decoded.user.id) {
          driverId = decoded.user.id;
        }
      }

      const data = {
        driverId,
        acceleration: parseFloat(acceleration),
        braking: parseFloat(braking),
        turn: parseFloat(turn),
        timestamp: new Date().toISOString(),
      };

      const response = await submitDrivingData(data);
      setResult(response);
      setModalVisible(true);

      // Refresh average score after submission
      const score = await getAverageScore(user.id);
      setAverageScore(score);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>{greeting}, {userName}!</Text>
          {averageScore !== null && (
            <Text style={styles.averageScore}>
              Average Score: {(averageScore * 100).toFixed(0)}
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

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
