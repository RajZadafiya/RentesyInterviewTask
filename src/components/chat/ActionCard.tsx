import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInDown,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette } from '@/constants/colors';
import { ActionCardData } from '@/types/chat';
import { triggerHaptic } from '@/utils/haptics';

interface ActionCardProps {
  data: ActionCardData;
  onActionComplete?: (id: string) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  data,
  onActionComplete,
}) => {
  const [status, setStatus] = useState(data.status);
  const buttonScale = useSharedValue(1);

  const handlePrimaryPress = () => {
    if (status === 'completed') return;

    triggerHaptic('success');
    buttonScale.value = withSpring(0.94, {}, () => {
      buttonScale.value = withSpring(1);
    });

    setStatus('completed');
    onActionComplete?.(data.id);
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return {
          label: 'Dispatched & Synced',
          color: Palette.success,
          bg: Palette.successSurface,
          icon: 'checkmark-circle' as const,
        };
      case 'in_progress':
        return {
          label: 'Processing',
          color: Palette.warning,
          bg: Palette.warningSurface,
          icon: 'time-outline' as const,
        };
      default:
        return {
          label: 'Pending Approval',
          color: Palette.secondaryLight,
          bg: 'rgba(6, 182, 212, 0.12)',
          icon: 'alert-circle-outline' as const,
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <Animated.View
      layout={Layout.springify().damping(16).stiffness(150)}
      entering={FadeInDown.duration(320).springify()}
      style={styles.card}
    >
      {/* Top Header with Status */}
      <View style={styles.cardHeader}>
        <View style={styles.titleArea}>
          <Text style={styles.cardTitle}>{data.title}</Text>
          <Text style={styles.cardSubtitle}>{data.subtitle}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Ionicons name={badge.icon} size={12} color={badge.color} />
          <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
        </View>
      </View>

      {/* Property Unit Pill */}
      <View style={styles.unitPill}>
        <Ionicons name="business-outline" size={13} color={Palette.textSecondary} />
        <Text style={styles.unitText}>{data.unit}</Text>
      </View>

      {/* Details Key-Value Rows */}
      <View style={styles.detailsContainer}>
        {data.details.map((detail, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{detail.label}</Text>
            <Text style={styles.detailValue}>{detail.value}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <Animated.View style={[{ flex: 1 }, animatedButtonStyle]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePrimaryPress}
            style={[
              styles.primaryButton,
              status === 'completed' && styles.primaryButtonCompleted,
            ]}
          >
            {status === 'completed' ? (
              <View style={styles.buttonContent}>
                <Ionicons name="checkmark-done" size={16} color={Palette.textPrimary} />
                <Text style={styles.buttonText}>Confirmed & Filed</Text>
              </View>
            ) : (
              <LinearGradient
                colors={[Palette.primary, Palette.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Ionicons name="send" size={14} color={Palette.textPrimary} />
                <Text style={styles.buttonText}>{data.primaryActionLabel}</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </Animated.View>

        {data.secondaryActionLabel && status !== 'completed' && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => triggerHaptic('light')}
          >
            <Text style={styles.secondaryButtonText}>{data.secondaryActionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.surfaceElevated,
    borderRadius: 18,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.22)',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleArea: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  unitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
  },
  unitText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  detailsContainer: {
    marginTop: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  detailValue: {
    fontSize: 12,
    color: Palette.textPrimary,
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButtonCompleted: {
    backgroundColor: Palette.success,
    paddingVertical: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonText: {
    color: Palette.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.glassBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  secondaryButtonText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
});

