import { useState, useCallback, useRef } from 'react';
import { ChatMessage, QuickSuggestion } from '@/types/chat';
import { INITIAL_MESSAGES } from '@/constants/mockData';
import { AIService } from '@/services/aiService';
import { triggerHaptic } from '@/utils/haptics';

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceOverlayVisible, setVoiceOverlayVisible] = useState(false);
  const currentAssistantMsgIdRef = useRef<string | null>(null);

  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend || inputText).trim();
      if (!text || isProcessing) return;

      setInputText('');
      setIsProcessing(true);
      triggerHaptic('medium');

      const userTimestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: userTimestamp,
      };

      const assistantMsgId = `assistant-${Date.now() + 1}`;
      currentAssistantMsgIdRef.current = assistantMsgId;

      const placeholderAssistantMessage: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: userTimestamp,
        isStreaming: true,
        thinkingSteps: [],
      };

      setMessages((prev) => [...prev, userMessage, placeholderAssistantMessage]);

      await AIService.processPrompt(text, {
        onThinkingStart: () => {
          // Keep placeholder waiting
        },
        onThinkingStep: (steps) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, thinkingSteps: steps }
                : msg
            )
          );
        },
        onStreamingStart: () => {
          // Ready to stream tokens
        },
        onToken: (_token, fullText) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: fullText, isStreaming: true }
                : msg
            )
          );
        },
        onActionReady: (action) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, actionCard: action } : msg
            )
          );
        },
        onComplete: (fullText, action) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: fullText,
                    isStreaming: false,
                    actionCard: action || msg.actionCard,
                  }
                : msg
            )
          );
          setIsProcessing(false);
          triggerHaptic('success');
        },
      });
    },
    [inputText, isProcessing]
  );

  const handleSelectSuggestion = useCallback(
    (suggestion: QuickSuggestion) => {
      sendMessage(suggestion.prompt);
    },
    [sendMessage]
  );

  const handleActionComplete = useCallback((actionId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.actionCard && msg.actionCard.id === actionId) {
          return {
            ...msg,
            actionCard: {
              ...msg.actionCard,
              status: 'completed',
            },
          };
        }
        return msg;
      })
    );
  }, []);

  const handleResetChat = useCallback(() => {
    AIService.abortCurrentStream();
    setMessages(INITIAL_MESSAGES);
    setInputText('');
    setIsProcessing(false);
    triggerHaptic('medium');
  }, []);

  return {
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
  };
}

