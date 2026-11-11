import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { VoiceOrb } from './VoiceOrb';
import { WaveformBars } from './WaveformBars';
import { VoiceTranscript } from './VoiceTranscript';
import { VoiceModeState } from '@/types/chat';
import { triggerHaptic } from '@/utils/haptics';

interface VoiceAssistantOverlayProps {
  visible: boolean;
  onClose: () => void;
  onSubmitVoiceQuery: (query: string) => void;
}

const SAMPLE_VOICE_QUERIES = [
  'Prepare 24h entry notice for Unit 402 AC repair',
  'Check lease renewal status for Michael Chen',
  'Summarize late November rent payments',
];

export const VoiceAssistantOverlay: React.FC<VoiceAssistantOverlayProps> = ({
  visible,
  onClose,
  onSubmitVoiceQuery,
}) => {
  const [state, setState] = useState<VoiceModeState>('idle');
  const [transcript, setTranscript] = useState('');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const startListeningCycle = useCallback(
    (overrideQuery?: string) => {
      clearAllTimers();
      setState('listening');
      setTranscript('');

      const targetQuery =
        overrideQuery ||
        SAMPLE_VOICE_QUERIES[Math.floor(Math.random() * SAMPLE_VOICE_QUERIES.length)];
      const words = targetQuery.split(' ');
      let currentWords = '';

      // Simulate real-time word-by-word speech recognition
      words.forEach((word, index) => {
        const timer1 = setTimeout(() => {
          currentWords += (index === 0 ? '' : ' ') + word;
          setTranscript(currentWords);
          triggerHaptic('light');

          if (index === words.length - 1) {
            // Finished speech, switch to thinking state
            const timer2 = setTimeout(() => {
              setState('thinking');
              triggerHaptic('medium');

              // Then speaking state
              const timer3 = setTimeout(() => {
                setState('speaking');
                triggerHaptic('success');

                // Automatically complete and send query to chat
                const timer4 = setTimeout(() => {
                  onSubmitVoiceQuery(targetQuery);
                  onClose();
                }, 1200);
                timersRef.current.push(timer4);
              }, 1400);
              timersRef.current.push(timer3);
            }, 800);
            timersRef.current.push(timer2);
          }
        }, (index + 1) * 260);
        timersRef.current.push(timer1);
      });
    },
    [clearAllTimers, onClose, onSubmitVoiceQuery]
  );

  useEffect(() => {
    if (!visible) {
      clearAllTimers();
      return;
    }

    triggerHaptic('medium');
    const initTimer = setTimeout(() => {
      startListeningCycle();
    }, 100);
    timersRef.current.push(initTimer);

    return () => {
      clearAllTimers();
    };
  }, [visible, startListeningCycle, clearAllTimers]);

  const handleToggleState = () => {
    triggerHaptic('selection');
    if (state === 'listening') {
      clearAllTimers();
      setState('idle');
    } else {
      startListeningCycle();
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      style={styles.backdrop}
    >
      <Animated.View
        entering={SlideInDown.springify().damping(18).stiffness(160)}
        exiting={SlideOutDown.duration(220)}
        style={styles.sheet}
      >
        {/* Header with dismiss button */}
        <View style={styles.topBar}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.liveIndicator} />
            <Text style={styles.headerTitle}>Rentesy Voice Assistant</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              triggerHaptic('light');
              onClose();
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={20} color={Palette.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Centerpiece: Glowing Luminescent Voice Orb */}
        <View style={styles.orbContainer}>
          <VoiceOrb state={state} size={150} />
        </View>

        {/* Waveform reactive bars */}
        <View style={styles.waveformContainer}>
          <WaveformBars state={state} barCount={24} height={42} />
        </View>

        {/* Live Transcript & Status */}
        <VoiceTranscript state={state} transcript={transcript} />

        {/* Quick prompt suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionTitle}>Or tap a property voice command:</Text>
          <View style={styles.suggestionPills}>
            {SAMPLE_VOICE_QUERIES.map((query, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestionPill}
                onPress={() => {
                  triggerHaptic('light');
                  startListeningCycle(query);
                }}
              >
                <Ionicons name="mic-outline" size={13} color={Palette.secondaryLight} />
                <Text style={styles.suggestionPillText} numberOfLines={1}>
                  {query}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Interactive Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[
              styles.micButton,
              state === 'listening' && styles.micButtonActive,
            ]}
            onPress={handleToggleState}
            activeOpacity={0.8}
          >
            <Ionicons
              name={state === 'listening' ? 'pause' : 'mic'}
              size={28}
              color={Palette.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(5, 7, 12, 0.88)',
    justifyContent: 'flex-end',
    zIndex: 9999,
  },
  sheet: {
    backgroundColor: Palette.surface,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 1,
    borderColor: Palette.glassBorder,
    paddingTop: 20,
    paddingBottom: 36,
    alignItems: 'center',
    gap: 16,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.secondary,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveformContainer: {
    marginVertical: 4,
  },
  suggestionsContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 6,
    gap: 8,
  },
  suggestionTitle: {
    fontSize: 11,
    color: Palette.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  suggestionPills: {
    flexDirection: 'column',
    gap: 6,
  },
  suggestionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.glassBorder,
  },
  suggestionPillText: {
    fontSize: 12,
    color: Palette.textSecondary,
    flex: 1,
  },
  controlsRow: {
    marginTop: 8,
    alignItems: 'center',
  },
  micButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  micButtonActive: {
    backgroundColor: Palette.secondary,
    shadowColor: Palette.secondary,
  },
});

