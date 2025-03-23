import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f7fa',
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  averageScore: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  submitButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2980b9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
map: {
    flex: 1,
},
metricsContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
},
metricsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
},
locationButton: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
},
locationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
},
button: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
},
startButton: {
    backgroundColor: '#3498db',
},
stopButton: {
    backgroundColor: '#e74c3c',
},
buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
},

// For the fake ride button
fakeRideButton: {
  backgroundColor: '#9c27b0', // Purple color for distinction
  marginTop: 10,
},

// For the car marker
marker: {
  width: 40,
  height: 40,
  transform: [{ rotate: '0deg' }], // Initial rotation, will be dynamically updated
},
// For the result modal
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},

modalContent: {
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  width: '80%',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},

modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 15,
},

modalScore: {
  fontSize: 36,
  fontWeight: 'bold',
  color: '#4CAF50',
  marginVertical: 10,
},

modalStatus: {
  fontSize: 18,
  marginBottom: 20,
  color: '#333',
},

modalButton: {
  backgroundColor: '#2196F3',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
  marginTop: 10,
},

modalButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
}
});

export default styles;
