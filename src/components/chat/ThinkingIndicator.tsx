import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette } from '@/constants/colors';
import { ThinkingStep } from '@/types/chat';
import { triggerHaptic } from '@/utils/haptics';

interface ThinkingIndicatorProps {
  steps?: ThinkingStep[];
  isActivelyThinking?: boolean;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  steps = [],
  isActivelyThinking = false,
}) => {
  const [expanded, setExpanded] = useState(isActivelyThinking);
  const pulseOpacity = useSharedValue(0.4);

  React.useEffect(() => {
    if (isActivelyThinking) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
    } else {
      pulseOpacity.value = 1;
    }
  }, [isActivelyThinking, pulseOpacity]);

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: pulseOpacity.value,
    };
  });

  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length || 3;

  const toggleExpand = () => {
    triggerHaptic('selection');
    setExpanded((prev) => !prev);
  };

  return (
    <Animated.View
      layout={Layout.springify().damping(16).stiffness(160)}
      entering={FadeInDown.duration(260)}
      style={styles.container}
    >
      {/* Header Pill */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleExpand}
        style={styles.headerPill}
      >
        <Animated.View style={[styles.shimmerBorder, animatedGlowStyle]}>
          <LinearGradient
            colors={[Palette.primaryLight, Palette.secondary, Palette.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmerGradient}
          />
        </Animated.View>

        <View style={styles.headerContent}>
          <View style={styles.leftGroup}>
            <View
              style={[
                styles.iconBubble,
                isActivelyThinking && { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
              ]}
            >
              <Ionicons
                name={isActivelyThinking ? 'sparkles' : 'checkmark-done'}
                size={13}
                color={isActivelyThinking ? Palette.secondaryLight : Palette.success}
              />
            </View>
            <Text style={styles.titleText}>
              {isActivelyThinking
                ? 'Thinking & Cross-Referencing...'
                : `Verified Reasoning (${completedCount}/${totalCount} completed)`}
            </Text>
          </View>

          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={Palette.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Reasoning Chain */}
      {expanded && (
        <Animated.View
          layout={Layout.springify().damping(18).stiffness(180)}
          entering={FadeIn.duration(200)}
          style={styles.stepsList}
        >
          {steps.map((step, idx) => (
            <View key={step.id || idx} style={styles.stepItem}>
              <View
                style={[
                  styles.stepBullet,
                  step.completed ? styles.stepBulletDone : styles.stepBulletPending,
                ]}
              >
                {step.completed ? (
                  <Ionicons name="checkmark" size={10} color={Palette.textPrimary} />
                ) : (
                  <View style={styles.activeDot} />
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  step.completed ? styles.stepLabelDone : styles.stepLabelPending,
                ]}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    borderRadius: 14,
    backgroundColor: Palette.surfaceElevated,
    borderWidth: 1,
    borderColor: Palette.glassBorder,
    overflow: 'hidden',
  },
  headerPill: {
    position: 'relative',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  shimmerBorder: {
    ...StyleSheet.absoluteFill,
    opacity: 0.7,
  },
  shimmerGradient: {
    ...StyleSheet.absoluteFill,
    opacity: 0.15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBubble: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: 0.2,
  },
  stepsList: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 4,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBullet: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBulletDone: {
    backgroundColor: Palette.success,
  },
  stepBulletPending: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.secondary,
  },
  stepLabel: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  stepLabelDone: {
    color: Palette.textSecondary,
  },
  stepLabelPending: {
    color: Palette.textMuted,
    fontStyle: 'italic',
  },
});

