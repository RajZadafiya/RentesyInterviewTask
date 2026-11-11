import React, { useRef, useEffect } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Palette } from '@/constants/colors';
import { useAIChat } from '@/hooks/useAIChat';
import { ChatHeader } from '@/components/ui/ChatHeader';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { QuickSuggestions } from '@/components/chat/QuickSuggestions';
import { InputBar } from '@/components/ui/InputBar';
import { VoiceAssistantOverlay } from '@/components/voice/VoiceAssistantOverlay';

export const AIChatScreen: React.FC = () => {
  const {
    messages,
    inputText,
    setInputText,
    isProcessing,
    voiceOverlayVisible,
    setVoiceOverlayVisible,
    sendMessage,
    handleSelectSuggestion,
    handleActionComplete,
    handleResetChat,
  } = useAIChat();

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom on new messages
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 120);
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />

      {/* Top Header */}
      <ChatHeader
        onOpenVoiceMode={() => setVoiceOverlayVisible(true)}
        onResetChat={handleResetChat}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              onActionComplete={handleActionComplete}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Quick Suggestion Chips */}
        <View style={styles.suggestionsWrapper}>
          <QuickSuggestions onSelectSuggestion={handleSelectSuggestion} />
        </View>

        {/* Input Bar */}
        <InputBar
          value={inputText}
          onChangeText={setInputText}
          onSend={() => sendMessage()}
          onVoicePress={() => setVoiceOverlayVisible(true)}
          disabled={isProcessing}
        />
      </KeyboardAvoidingView>

      {/* Ambient Voice Assistant Overlay */}
      <VoiceAssistantOverlay
        visible={voiceOverlayVisible}
        onClose={() => setVoiceOverlayVisible(false)}
        onSubmitVoiceQuery={(query) => sendMessage(query)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  listContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  suggestionsWrapper: {
    backgroundColor: Palette.surface,
  },
});

