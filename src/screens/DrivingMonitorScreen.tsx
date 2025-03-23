import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Image } from 'react-native';
import MapView, { Polyline, Marker, AnimatedRegion } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { accelerometer } from 'react-native-sensors';
import { submitDrivingData, getAverageScore } from '../services/apiService';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/HomeScreenStyles';
import ResultModal from '../components/ResultModal';
import { DrivingResult } from '../types';

// Define navigation types
type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    // Add other screens as needed
};

type Props = {
    navigation: any;
};

const DrivingMonitor: React.FC<Props> = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [result, setResult] = useState<DrivingResult | null>(null);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [isFakeRide, setIsFakeRide] = useState(false);
    const [routeCoordinates, setRouteCoordinates] = useState<Array<{ latitude: number, longitude: number, timestamp: number }>>([]);
    const [currentPosition, setCurrentPosition] = useState(null as any);
    const [accelerationData, setAccelerationData] = useState<Array<{ x: number, y: number, z: number, magnitude: number, timestamp: number }>>([]);
    const [maxAcceleration, setMaxAcceleration] = useState(0);
    const [maxBraking, setMaxBraking] = useState(0);
    const [maxTurn, setMaxTurn] = useState(0);
    const [userName, setUserName] = useState<string>('User');
    const [user, setUser] = useState<any>();
    const [averageScore, setAverageScore] = useState<number | null>(null);
    const [greeting, setGreeting] = useState<string>('');
    const [heading, setHeading] = useState(0);
    const [coordinate, setCoordinate] = useState(
        new AnimatedRegion({
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        })
    );

    const watchId = useRef(0);
    const subscription = useRef(null as any);
    const mapRef = useRef(null as any);
    const fakeRideInterval = useRef<any>(null);

    // Get current location on component mount
    useEffect(() => {
        getCurrentLocation();

        // Clean up on unmount
        return () => {
            if (watchId.current) Geolocation.clearWatch(watchId.current);
            if (subscription.current) subscription.current.unsubscribe();
            if (fakeRideInterval.current) clearInterval(fakeRideInterval.current);
        };
    }, []);

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
                debugger;
                if (token) {
                    // Decode the JWT token
                    const decoded = jwtDecode<any>(token);

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

        getUserInfoFromToken();
    }, []);

    // Fetch average score when user is available
    useEffect(() => {
        const fetchAverageScore = async () => {
            try {
                if (user?.id) {
                    const score = await getAverageScore(user.id);
                    setAverageScore(score);
                }
            } catch (error) {
                console.error('Error fetching average score:', error);
            }
        };

        if (user) {
            fetchAverageScore();
        }
    }, [user]);

    const calculateAngle = (prevCoord: any, newCoord: any) => {
        if (!prevCoord) return 0;

        const dx = newCoord.longitude - prevCoord.longitude;
        const dy = newCoord.latitude - prevCoord.latitude;

        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        return angle;
    };

    const animateMarker = (newCoordinate: any) => {
        const { latitude, longitude } = newCoordinate;
        
        coordinate.timing({
            latitude,
            longitude,
            duration: 1000,
            useNativeDriver: false
        }).start();
    };

    // Function to get current location
    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const initialPosition = { latitude, longitude, timestamp: position.timestamp };

                setCurrentPosition(initialPosition);
                animateMarker(initialPosition);

                // Center map on current position
                mapRef.current?.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            },
            error => Alert.alert('Error', error.message),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    // Start fake ride
    const startFakeRide = () => {
        setIsMonitoring(true);
        setIsFakeRide(true);
        setRouteCoordinates([]);
        setAccelerationData([]);
        setMaxAcceleration(0);
        setMaxBraking(0);
        setMaxTurn(0);
        
        // Start with current position as the base
        const startPosition = currentPosition || {
            latitude: 37.78825,
            longitude: -122.4324,
            timestamp: Date.now()
        };
        
        // Set initial position
        setCurrentPosition(startPosition);
        setRouteCoordinates([startPosition]);
        
        // Store the last known position in a ref to avoid state timing issues
        const lastPositionRef = { current: startPosition };
        
        // Generate fake route over time
        fakeRideInterval.current = setInterval(() => {
            // Use the ref instead of accessing state directly
            const lastCoord = lastPositionRef.current;
            
            // Create small random changes to latitude and longitude
            const newCoordinate = {
                latitude: lastCoord.latitude + (Math.random() * 0.002 - 0.001),
                longitude: lastCoord.longitude + (Math.random() * 0.002 - 0.001),
                timestamp: Date.now()
            };
            
            // Update the ref with the new position
            lastPositionRef.current = newCoordinate;
            
            // Calculate heading based on previous position
            const angle = calculateAngle(lastCoord, newCoordinate);
            setHeading(angle);
            
            // Generate random acceleration data
            const acceleration = {
                x: Math.random() * 2 - 1,
                y: Math.random() * 4 - 1,
                z: Math.random() * 2 - 1,
                magnitude: Math.random() * 3,
                timestamp: Date.now()
            };
            
            // Update state with new data
            setCurrentPosition(newCoordinate);
            setRouteCoordinates(prev => [...prev, newCoordinate]);
            setAccelerationData(prev => [...prev, acceleration]);
            updateMaxValues(acceleration);
            
            // Animate marker to new position
            animateMarker(newCoordinate);
            
            // Center map on current position
            mapRef.current?.animateToRegion({
                latitude: newCoordinate.latitude,
                longitude: newCoordinate.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }, 1000);
    };
    // Start monitoring
    const startMonitoring = () => {
        setIsMonitoring(true);
        setIsFakeRide(false);
        setRouteCoordinates([]);
        setAccelerationData([]);
        setMaxAcceleration(0);
        setMaxBraking(0);
        setMaxTurn(0);

        // Start tracking location
        watchId.current = Geolocation.watchPosition(
            position => {
                const { latitude, longitude, heading } = position.coords;
                const newCoordinate = { latitude, longitude, timestamp: position.timestamp };

                // Update heading if available
                if (heading !== null) {
                    setHeading(heading);
                } else if (routeCoordinates.length > 0) {
                    // Calculate heading based on previous position if GPS heading not available
                    const prevCoord = routeCoordinates[routeCoordinates.length - 1];
                    const angle = calculateAngle(prevCoord, newCoordinate);
                    setHeading(angle);
                }

                setCurrentPosition(newCoordinate);
                setRouteCoordinates(prevCoordinates => [...prevCoordinates, newCoordinate]);
                animateMarker(newCoordinate);

                // Center map on current position
                mapRef.current?.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            },
            error => Alert.alert('Error', error.message),
            {
                enableHighAccuracy: true,
                distanceFilter: 5, // minimum distance (meters) between updates
                interval: 1000 // minimum time (ms) between updates
            }
        );

        // Start tracking acceleration
        subscription.current = accelerometer.subscribe(({ x, y, z }) => {
            // Calculate magnitude of acceleration
            const magnitude = Math.sqrt(x * x + y * y + z * z);

            // Store acceleration data
            setAccelerationData(prevData => [...prevData, { x, y, z, magnitude, timestamp: Date.now() }]);

            // Update max values in real-time
            updateMaxValues({ x, y, z, magnitude });
        });
    };

    // Stop monitoring and analyze data
    const stopMonitoring = () => {
        setIsMonitoring(false);
        setIsFakeRide(false);

        // Stop tracking
        if (watchId.current) {
            if (typeof watchId.current === 'number') {
                Geolocation.clearWatch(watchId.current);
            }
        }
        
        if (fakeRideInterval.current) {
            clearInterval(fakeRideInterval.current);
            fakeRideInterval.current = null;
        }
        
        if (subscription.current) {
            subscription.current.unsubscribe();
        }

        // Calculate final metrics
        calculateDrivingMetrics();
    };

    // Update maximum values
    const updateMaxValues = (data: any) => {
        // Simple example - in a real app you'd use more sophisticated algorithms
        // to detect acceleration, braking, and turns

        // Acceleration (positive change in speed)
        if (data.y > maxAcceleration) setMaxAcceleration(data.y);

        // Braking (negative change in speed)
        if (-data.y > maxBraking) setMaxBraking(-data.y);

        // Turn (lateral acceleration)
        if (Math.abs(data.x) > maxTurn) setMaxTurn(Math.abs(data.x));
    };

    // Calculate final metrics
    const calculateDrivingMetrics = async () => {
        // Calculate averages instead of using max values
        let totalAcceleration = 0;
        let totalBraking = 0;
        let totalTurn = 0;
        let accelerationCount = 0;
        let brakingCount = 0;
        let turnCount = 0;
        
        // Process all acceleration data to calculate averages
        accelerationData.forEach(data => {
            // Positive y values represent acceleration
            if (data.y > 0) {
                totalAcceleration += data.y;
                accelerationCount++;
            }
            
            // Negative y values represent braking
            if (data.y < 0) {
                totalBraking += -data.y; // Convert to positive value
                brakingCount++;
            }
            
            // Absolute x values represent turning
            totalTurn += Math.abs(data.x);
            turnCount++;
        });
        
        // Calculate averages, default to 0 if no data
        const avgAcceleration = accelerationCount > 0 ? totalAcceleration / accelerationCount : 0;
        const avgBraking = brakingCount > 0 ? totalBraking / brakingCount : 0;
        const avgTurn = turnCount > 0 ? totalTurn / turnCount : 0;
        
        // For demo purposes, we'll use the average values we calculated
        const drivingData = {
            driverId: user?.id || 'driver123',
            acceleration: avgAcceleration,
            braking: avgBraking,
            turn: avgTurn,
            timestamp: new Date().toISOString(),
            route: routeCoordinates,
            isFakeRide: isFakeRide
        };
        
        // Send data to your API
        const response = await submitDrivingData(drivingData);
        
        setResult(response);
        setModalVisible(true);
        
        // Refresh average score after submission
        if (user?.id) {
            const score = await getAverageScore(user.id);
            setAverageScore(score);
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
        <>
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
            <View style={styles.container}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {routeCoordinates.length > 0 && (
                        <Polyline
                            coordinates={routeCoordinates}
                            strokeColor="#3498db"
                            strokeWidth={4}
                        />
                    )}
                    {currentPosition && (
                        <Marker.Animated
                            coordinate={coordinate}
                            title="Current Position"
                        >
                            <Image
                                source={require('../../assets/car-icon.png')}
                                style={{
                                    width: 40,
                                    height: 40,
                                    transform: [{ rotate: `${heading}deg` }]
                                }}
                                resizeMode="contain"
                            />
                        </Marker.Animated>
                    )}
                </MapView>
                <View style={styles.metricsContainer}>
                    <Text style={styles.metricsTitle}>Driving Metrics</Text>
                    <Text>Acceleration: {maxAcceleration.toFixed(2)} m/s²</Text>
                    <Text>Braking: {maxBraking.toFixed(2)} m/s²</Text>
                    <Text>Turn: {maxTurn.toFixed(2)} m/s²</Text>
                </View>

                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={getCurrentLocation}
                >
                    <Text style={styles.locationButtonText}>Get Current Location</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        isMonitoring ? styles.stopButton : styles.startButton
                    ]}
                    onPress={isMonitoring ? stopMonitoring : startMonitoring}
                >
                    <Text style={styles.buttonText}>
                        {isMonitoring ? 'Stop & Analyze' : 'Start Driving'}
                    </Text>
                </TouchableOpacity>
                
                {!isMonitoring && (
                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.fakeRideButton
                        ]}
                        onPress={startFakeRide}
                    >
                        <Text style={styles.buttonText}>
                            Start Fake Ride
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <ResultModal visible={modalVisible} onClose={() => setModalVisible(false)} result={result} />
        </>
    );
};

export default DrivingMonitor;
