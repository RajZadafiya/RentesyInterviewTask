import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Palette } from '@/constants/colors';
import { VoiceModeState } from '@/types/chat';

interface WaveformBarsProps {
  state: VoiceModeState;
  barCount?: number;
  height?: number;
}

const SingleBar: React.FC<{
  index: number;
  total: number;
  state: VoiceModeState;
  maxHeight: number;
}> = ({ index, total, state, maxHeight }) => {
  const barHeight = useSharedValue(6);

  useEffect(() => {
    // Generate organic pseudo-frequency variations
    const centerFactor = 1 - Math.abs(index - total / 2) / (total / 2);
    const targetHeight = Math.max(12, maxHeight * (0.3 + 0.7 * centerFactor));
    const randomDuration = 320 + (index % 5) * 80;
    const delay = (index % 4) * 60;

    if (state === 'listening' || state === 'speaking') {
      const scaleMultiplier = state === 'speaking' ? 1.0 : 0.75;
      barHeight.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(targetHeight * scaleMultiplier, {
              duration: randomDuration,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            }),
            withTiming(8 + (index % 3) * 4, {
              duration: randomDuration * 1.1,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            }),
            withTiming(targetHeight * 0.5 * scaleMultiplier, {
              duration: randomDuration * 0.9,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            })
          ),
          -1,
          true
        )
      );
    } else if (state === 'thinking') {
      // Traveling wave effect when AI is thinking
      const waveDelay = index * 70;
      barHeight.value = withDelay(
        waveDelay,
        withRepeat(
          withSequence(
            withTiming(maxHeight * 0.6, { duration: 300, easing: Easing.inOut(Easing.quad) }),
            withTiming(8, { duration: 300, easing: Easing.inOut(Easing.quad) })
          ),
          -1,
          true
        )
      );
    } else {
      // Idle gentle resting state
      barHeight.value = withTiming(6, { duration: 400 });
    }
  }, [state, index, total, maxHeight, barHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: barHeight.value,
    };
  });

  return (
    <View style={styles.barWrapper}>
      <Animated.View style={[styles.bar, animatedStyle]} />
    </View>
  );
};

export const WaveformBars: React.FC<WaveformBarsProps> = ({
  state,
  barCount = 18,
  height = 56,
}) => {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <View style={[styles.container, { height }]}>
      {bars.map((index) => (
        <SingleBar
          key={index}
          index={index}
          total={barCount}
          state={state}
          maxHeight={height}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  barWrapper: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    width: 3.5,
    borderRadius: 2,
    backgroundColor: Palette.secondaryLight,
    shadowColor: Palette.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
});

