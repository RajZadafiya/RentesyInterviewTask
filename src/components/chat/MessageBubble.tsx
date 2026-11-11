import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { ChatMessage } from '@/types/chat';
import { ThinkingIndicator } from './ThinkingIndicator';
import { StreamingText } from './StreamingText';
import { ActionCard } from './ActionCard';

interface MessageBubbleProps {
  message: ChatMessage;
  onActionComplete?: (id: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onActionComplete,
}) => {
  const isUser = message.role === 'user';

  return (
    <Animated.View
      layout={Layout.springify().damping(16).stiffness(170)}
      entering={FadeInDown.duration(280).springify()}
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      {/* Assistant Avatar for non-user messages */}
      {!isUser && (
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarBadge}>
            <Ionicons name="sparkles" size={14} color={Palette.textPrimary} />
          </View>
        </View>
      )}

      {/* Bubble Content Body */}
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        {/* Thinking Indicator (if present) */}
        {!isUser && message.thinkingSteps && message.thinkingSteps.length > 0 && (
          <ThinkingIndicator
            steps={message.thinkingSteps}
            isActivelyThinking={message.isStreaming && !message.content}
          />
        )}

        {/* Text Message with Streaming support */}
        {message.content ? (
          <StreamingText
            content={message.content}
            isStreaming={message.isStreaming}
          />
        ) : null}

        {/* Action Card (e.g. Maintenance Dispatch) */}
        {!isUser && message.actionCard && (
          <ActionCard
            data={message.actionCard}
            onActionComplete={onActionComplete}
          />
        )}

        {/* Timestamp & Delivery Status */}
        <View style={styles.metaRow}>
          <Text style={styles.timestamp}>{message.timestamp}</Text>
          {isUser && (
            <Ionicons
              name="checkmark-done"
              size={13}
              color={Palette.secondaryLight}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  avatarWrapper: {
    marginBottom: 4,
  },
  avatarBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  bubble: {
    maxWidth: '84%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: Palette.userBubble,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: Palette.userBubbleBorder,
    shadowColor: Palette.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  assistantBubble: {
    backgroundColor: Palette.assistantBubble,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Palette.assistantBubbleBorder,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 6,
  },
  timestamp: {
    fontSize: 10,
    color: Palette.textMuted,
    fontWeight: '500',
  },
});

