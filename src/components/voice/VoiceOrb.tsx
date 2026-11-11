import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette } from '@/constants/colors';
import { VoiceModeState } from '@/types/chat';

interface VoiceOrbProps {
  state: VoiceModeState;
  size?: number;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ state, size = 180 }) => {
  // Shared values for continuous organic breathing & reactivity
  const pulse1 = useSharedValue(1);
  const pulse2 = useSharedValue(1);
  const pulse3 = useSharedValue(1);
  const rotation = useSharedValue(0);
  const coreScale = useSharedValue(1);

  useEffect(() => {
    // Layer 1 - Outer slow breath
    pulse1.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 2200, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(1.0, { duration: 2200, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      true
    );

    // Layer 2 - Mid harmonic pulse
    pulse2.value = withRepeat(
      withSequence(
        withTiming(1.22, { duration: 1700, easing: Easing.bezier(0.45, 0, 0.25, 1) }),
        withTiming(0.95, { duration: 1700, easing: Easing.bezier(0.45, 0, 0.25, 1) })
      ),
      -1,
      true
    );

    // Layer 3 - Subtle fast shimmer
    pulse3.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1300, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.0, { duration: 1300, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Continuous slow rotational drift
    rotation.value = withRepeat(
      withTiming(360, { duration: 24000, easing: Easing.linear }),
      -1,
      false
    );
  }, [pulse1, pulse2, pulse3, rotation]);

  // Adjust core scale based on active voice state
  useEffect(() => {
    switch (state) {
      case 'listening':
        coreScale.value = withSpring(1.15, { damping: 12, stiffness: 140 });
        break;
      case 'thinking':
        coreScale.value = withSpring(0.9, { damping: 14, stiffness: 180 });
        break;
      case 'speaking':
        coreScale.value = withSpring(1.22, { damping: 10, stiffness: 160 });
        break;
      default:
        coreScale.value = withSpring(1.0, { damping: 16, stiffness: 140 });
        break;
    }
  }, [state, coreScale]);

  const outerRingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse1.value }],
      opacity: interpolate(pulse1.value, [1, 1.35], [0.35, 0.1]),
    };
  });

  const middleRingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse2.value }],
      opacity: interpolate(pulse2.value, [0.95, 1.22], [0.55, 0.2]),
    };
  });

  const innerRingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse3.value }],
      opacity: interpolate(pulse3.value, [1.0, 1.15], [0.75, 0.4]),
    };
  });

  const coreStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: coreScale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  return (
    <View style={[styles.container, { width: size * 1.6, height: size * 1.6 }]}>
      {/* Outermost Aura Ring */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: (size * 1.5) / 2,
            backgroundColor: Palette.auraOuter,
          },
          outerRingStyle,
        ]}
      />

      {/* Middle Harmonic Aura */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: size * 1.25,
            height: size * 1.25,
            borderRadius: (size * 1.25) / 2,
            backgroundColor: Palette.auraMiddle,
          },
          middleRingStyle,
        ]}
      />

      {/* Inner Glowing Ring */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: size * 1.05,
            height: size * 1.05,
            borderRadius: (size * 1.05) / 2,
            borderColor: Palette.secondaryLight,
            borderWidth: 1.5,
          },
          innerRingStyle,
        ]}
      />

      {/* Core Glowing Orb */}
      <Animated.View
        style={[
          styles.coreContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          coreStyle,
        ]}
      >
        <LinearGradient
          colors={[
            Palette.primaryLight,
            Palette.primary,
            Palette.secondary,
            Palette.accent,
          ]}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={[styles.gradientCore, { borderRadius: size / 2 }]}
        />
        {/* Specular Highlight for 3D depth */}
        <View
          style={[
            styles.specularHighlight,
            {
              width: size * 0.45,
              height: size * 0.3,
              borderRadius: (size * 0.45) / 2,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
  },
  coreContainer: {
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 28,
    elevation: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradientCore: {
    ...StyleSheet.absoluteFill,
  },
  specularHighlight: {
    position: 'absolute',
    top: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    transform: [{ rotate: '-25deg' }],
  },
});

