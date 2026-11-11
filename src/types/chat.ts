export type MessageRole = 'user' | 'assistant' | 'system';

export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface ActionCardData {
  id: string;
  type: 'maintenance_dispatch' | 'lease_renewal' | 'rent_notice';
  title: string;
  subtitle: string;
  property: string;
  unit: string;
  details: { label: string; value: string }[];
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  status: ActionStatus;
}

export interface ThinkingStep {
  id: string;
  label: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  thinkingSteps?: ThinkingStep[];
  actionCard?: ActionCardData;
  audioDuration?: string;
}

export type VoiceModeState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface QuickSuggestion {
  id: string;
  label: string;
  prompt: string;
  iconName: string;
}

