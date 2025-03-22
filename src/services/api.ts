// In src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrivingData, DrivingResult } from '../types';

const API_URL = 'http://localhost:5002/api';

// Create axios instance with auth token interceptor
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const submitDrivingData = async (data: DrivingData): Promise<DrivingResult> => {
  const response = await api.post<DrivingResult>('/monitor-behavior', data);
  return response.data;
};

export const getAverageScore = async (userId: string): Promise<number> => {
  try {
    const response = await api.post('/average-score', {
      userId: userId
    });

    return response.data.averageScore;
  } catch (error) {
    console.error('Error fetching average score:', error);
    throw error;
  }
};