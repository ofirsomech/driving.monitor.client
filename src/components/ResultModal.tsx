import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DrivingResult } from '../types';
import styles from '../styles/ResultModalStyles';

interface ResultModalProps {
  visible: boolean;
  onClose: () => void;
  result?: DrivingResult | null;
}

const ResultModal: React.FC<ResultModalProps> = ({ visible, onClose, result }) => {
  if (!result) return null;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Driving Analysis</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.scoreSection}>
              <Text style={styles.scoreLabel}>Sustainability Score</Text>
              <View style={[styles.scoreCircle, {
                backgroundColor: result.sustainabilityScore > 0.7
                  ? '#4CAF50'
                  : result.sustainabilityScore > 0.4
                    ? '#FFC107'
                    : '#F44336'
              }]}>
                <Text style={styles.scoreValue}>{(result.sustainabilityScore * 100).toFixed(0)}</Text>
              </View>
              <Text style={[styles.status, result.isFlagged ? styles.flagged : styles.safe]}>
                {result.isFlagged ? '⚠️ Flagged' : '✓ Safe Driving'}
              </Text>
            </View>

            <View style={styles.detailsSection}>
              <Text style={styles.detailsTitle}>Driving Details</Text>
              {/* <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Driver ID:</Text>
                <Text style={styles.detailValue}>{result.driverId}</Text>
              </View> */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Acceleration:</Text>
                <Text style={styles.detailValue}>{result.acceleration.toFixed(2)} m/s²</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Braking:</Text>
                <Text style={styles.detailValue}>{result.braking.toFixed(2)} m/s²</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Turn:</Text>
                <Text style={styles.detailValue}>{result.turn.toFixed(2)} m/s²</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Timestamp:</Text>
                <Text style={styles.detailValue}>{new Date(result.timestamp).toLocaleString()}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.actionButton} onPress={onClose}>
              <Text style={styles.actionButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ResultModal;
