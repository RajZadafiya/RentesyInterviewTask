import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Palette } from '@/constants/colors';

interface StreamingTextProps {
  content: string;
  isStreaming?: boolean;
}

export const StreamingText: React.FC<StreamingTextProps> = ({
  content,
  isStreaming = false,
}) => {
  const cursorOpacity = useSharedValue(1);

  useEffect(() => {
    if (isStreaming) {
      cursorOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 350 }),
          withTiming(1, { duration: 350 })
        ),
        -1,
        true
      );
    } else {
      cursorOpacity.value = 0;
    }
  }, [isStreaming, cursorOpacity]);

  const animatedCursorStyle = useAnimatedStyle(() => {
    return {
      opacity: cursorOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.textContent}>
        {content}
        {isStreaming && (
          <Animated.Text style={[styles.cursor, animatedCursorStyle]}>
            {' ▍'}
          </Animated.Text>
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textContent: {
    fontSize: 15,
    lineHeight: 23,
    color: Palette.textPrimary,
    letterSpacing: 0.15,
  },
  cursor: {
    color: Palette.secondaryLight,
    fontWeight: 'bold',
  },
});

