import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { triggerHaptic } from '@/utils/haptics';

interface InputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onVoicePress: () => void;
  disabled?: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({
  value,
  onChangeText,
  onSend,
  onVoicePress,
  disabled = false,
}) => {
  const buttonScale = useSharedValue(1);
  const hasText = value.trim().length > 0;

  const handlePressAction = () => {
    if (disabled) return;

    buttonScale.value = withSpring(0.85, {}, () => {
      buttonScale.value = withSpring(1);
    });

    if (hasText) {
      triggerHaptic('medium');
      onSend();
    } else {
      triggerHaptic('light');
      onVoicePress();
    }
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Attachment Button */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => triggerHaptic('selection')}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={22} color={Palette.textSecondary} />
      </TouchableOpacity>

      {/* Text Input Container */}
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Ask Rentesy AI or speak..."
          placeholderTextColor={Palette.textMuted}
          style={styles.textInput}
          multiline
          maxLength={500}
          editable={!disabled}
        />
      </View>

      {/* Dynamic Voice / Send Action Button */}
      <Animated.View style={animatedButtonStyle}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            hasText ? styles.sendButton : styles.micButton,
          ]}
          onPress={handlePressAction}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <Ionicons
            name={hasText ? 'arrow-up' : 'mic'}
            size={20}
            color={Palette.textPrimary}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Palette.surface,
    borderTopWidth: 1,
    borderTopColor: Palette.glassBorder,
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Palette.surfaceElevated,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
    maxHeight: 100,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.glassBorder,
  },
  textInput: {
    color: Palette.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: Palette.primary,
  },
  micButton: {
    backgroundColor: Palette.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
});

