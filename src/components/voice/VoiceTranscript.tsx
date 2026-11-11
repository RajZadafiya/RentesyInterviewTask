import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Palette } from '@/constants/colors';
import { VoiceModeState } from '@/types/chat';

interface VoiceTranscriptProps {
  state: VoiceModeState;
  transcript: string;
}

export const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({ state, transcript }) => {
  const getStatusLabel = () => {
    switch (state) {
      case 'listening':
        return 'Listening to you...';
      case 'thinking':
        return 'Rentesy AI is analyzing...';
      case 'speaking':
        return 'Responding to tenant query...';
      default:
        return 'Tap microphone to speak';
    }
  };

  const getStatusColor = () => {
    switch (state) {
      case 'listening':
        return Palette.secondary;
      case 'thinking':
        return Palette.accent;
      case 'speaking':
        return Palette.primaryLight;
      default:
        return Palette.textMuted;
    }
  };

  return (
    <View style={styles.container}>
      {/* Dynamic Status Badge */}
      <View style={[styles.statusBadge, { borderColor: getStatusColor() }]}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusLabel()}
        </Text>
      </View>

      {/* Spoken Text Display */}
      <View style={styles.transcriptBox}>
        {transcript ? (
          <Animated.Text
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.transcriptText}
          >
            {`"${transcript}"`}
          </Animated.Text>
        ) : (
          <Text style={styles.placeholderText}>
            {'Try: "Draft an urgent HVAC maintenance dispatch for Unit 402"'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  transcriptBox: {
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transcriptText: {
    fontSize: 18,
    lineHeight: 26,
    color: Palette.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 14,
    lineHeight: 22,
    color: Palette.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

