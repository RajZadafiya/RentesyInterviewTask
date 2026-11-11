import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { triggerHaptic } from '@/utils/haptics';

interface ChatHeaderProps {
  onOpenVoiceMode: () => void;
  onResetChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onOpenVoiceMode,
  onResetChat,
}) => {
  return (
    <View style={styles.header}>
      {/* Property Context */}
      <View style={styles.leftInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.mainTitle}>Rentesy AI</Text>
          <View style={styles.liveBadge}>
            <View style={styles.pulsingDot} />
            <Text style={styles.liveText}>Ready</Text>
          </View>
        </View>
        <Text style={styles.subtitleText}>
          Skyline Residences • Manager Assistant
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsGroup}>
        {/* Reset conversation button */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            triggerHaptic('light');
            onResetChat();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="refresh-outline" size={18} color={Palette.textSecondary} />
        </TouchableOpacity>

        {/* Ambient Voice Assistant Trigger */}
        <TouchableOpacity
          style={styles.voiceTriggerBtn}
          onPress={() => {
            triggerHaptic('medium');
            onOpenVoiceMode();
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="mic" size={16} color={Palette.textPrimary} />
          <Text style={styles.voiceBtnText}>Voice Mode</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.glassBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftInfo: {
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: 0.2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.success,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.success,
    textTransform: 'uppercase',
  },
  subtitleText: {
    fontSize: 11,
    color: Palette.textMuted,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.glassBorder,
  },
  voiceTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  voiceBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
});

