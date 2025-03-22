import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5002/api/auth';
const TOKEN_KEY = 'auth_token';

// Set axios default header with token
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

// Register a new user
export const registerUser = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { name, email, password });
  
  // Save token to AsyncStorage
  if (response.data.token) {
    await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
    setAuthToken(response.data.token);
  }
  
  return response.data;
};

// Login an existing user
export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  
  // Save token to AsyncStorage
  if (response.data.token) {
    await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
    setAuthToken(response.data.token);
  }
  
  return response.data;
};

// Load token from storage
export const loadToken = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    setAuthToken(token);
    return token;
  }
  return null;
};

// Logout user
export const logoutUser = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  setAuthToken(null);
};
