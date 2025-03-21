import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Import for gradient styling
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import for icons
import { DrivingResult } from '../types'; // Import the type for driving results
import styles from '../styles/ResultModalStyles'; // Import styles

interface ResultModalProps {
  visible: boolean;
  onClose(): void;
  result?: DrivingResult | null;
}

const ResultModal: React.FC<ResultModalProps> = ({ visible, onClose, result }) => {
  if (!result) return null;

  const getScoreColor = (score: number) => {
    if (score > 0.7) return ['#43A047', '#2E7D32']; // Green for excellent
    if (score > 0.4) return ['#FFA000', '#F57F17']; // Orange for moderate
    return ['#E53935', '#C62828']; // Red for poor
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <LinearGradient colors={['#3498db', '#2980b9']} style={styles.header}>
            <Text style={styles.title}>Driving Analysis</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Content */}
          <ScrollView contentContainerStyle={styles.content}>
            {/* Sustainability Score */}
            <View style={styles.scoreSection}>
              <Text style={styles.scoreLabel}>Sustainability Score</Text>
              <LinearGradient colors={getScoreColor(result.sustainabilityScore)} style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>{(result.sustainabilityScore * 100).toFixed(0)}</Text>
              </LinearGradient>
              <Text style={[styles.status, result.isFlagged ? styles.flagged : styles.safe]}>
                {result.isFlagged ? '⚠️ Flagged' : '✓ Safe Driving'}
              </Text>
            </View>

            {/* Driving Details */}
            <View style={styles.detailsSection}>
              <Text style={styles.detailsTitle}>Driving Details</Text>
              {[
                { label: 'Driver ID', value: result.driverId },
                { label: 'Acceleration', value: `${result.acceleration} m/s²` },
                { label: 'Braking', value: `${result.braking} m/s²` },
                { label: 'Turn Rate', value: `${result.turn} m/s²` },
                { label: 'Timestamp', value: new Date(result.timestamp).toLocaleString() },
              ].map((item, index) => (
                <View key={index} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{item.label}</Text>
                  <Text style={styles.detailValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ResultModal;
