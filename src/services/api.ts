import axios from 'axios';
import { DrivingData, DrivingResult } from '../types';

const API_URL = 'http://localhost:5002/api'; // Use `10.0.2.2` for Android emulator, `localhost` for iOS simulator

export const submitDrivingData = async (data: DrivingData): Promise<DrivingResult> => {
  try {
    const response = await axios.post<DrivingResult>(`${API_URL}/monitor-behavior`, data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to submit driving data');
  }
};
