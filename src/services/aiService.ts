import { ActionCardData, ThinkingStep } from '@/types/chat';

export interface StreamCallbacks {
  onThinkingStart?: () => void;
  onThinkingStep?: (steps: ThinkingStep[]) => void;
  onStreamingStart?: () => void;
  onToken?: (token: string, fullText: string) => void;
  onActionReady?: (action: ActionCardData) => void;
  onComplete?: (fullText: string, action?: ActionCardData) => void;
}

export class AIService {
  private static cancelRequested = false;

  public static abortCurrentStream() {
    this.cancelRequested = true;
  }

  public static async processPrompt(
    prompt: string,
    callbacks: StreamCallbacks
  ): Promise<void> {
    this.cancelRequested = false;

    // Phase 1: Thinking / Reasoning
    callbacks.onThinkingStart?.();

    const lower = prompt.toLowerCase();
    let thinkingSteps: ThinkingStep[];
    let fullResponse: string;
    let actionCard: ActionCardData | undefined;

    if (lower.includes('lease') || lower.includes('renewal')) {
      thinkingSteps = [
        { id: 't1', label: 'Querying current lease terms for Unit 204', completed: false },
        { id: 't2', label: 'Checking municipal rent escalation guidelines (3.8% limit)', completed: false },
        { id: 't3', label: 'Generating electronic renewal addendum packet', completed: false },
      ];
      fullResponse =
        "I've drafted the 12-month renewal notice for Unit 204. The calculated escalation is 3.8% based on local tenancy guidelines, setting the new rent to $2,540/mo. All documentation is prepared for electronic signature.";
      actionCard = {
        id: `action-${Date.now()}`,
        type: 'lease_renewal',
        title: 'Lease Renewal Agreement',
        subtitle: 'Grand Central Lofts • Unit 204',
        property: 'Grand Central Lofts',
        unit: 'Unit 204 (Tenant: Michael Chen)',
        details: [
          { label: 'Current Rent', value: '$2,445 / month' },
          { label: 'Proposed Rent', value: '$2,540 / month (+3.8%)' },
          { label: 'Term Length', value: '12 Months (Dec 1, 2026 - Nov 30, 2027)' },
          { label: 'Signing Window', value: 'Due in 14 days' },
        ],
        primaryActionLabel: 'Send Renewal to Tenant',
        secondaryActionLabel: 'Edit Terms',
        status: 'pending',
      };
    } else if (lower.includes('late') || lower.includes('rent') || lower.includes('payment')) {
      thinkingSteps = [
        { id: 't1', label: 'Fetching November rent ledger and outstanding balances', completed: false },
        { id: 't2', label: 'Filtering 3+ day delinquent accounts (Grace period expired)', completed: false },
        { id: 't3', label: 'Formatting courteous automated payment reminders', completed: false },
      ];
      fullResponse =
        'There are currently 2 accounts with pending balances for November: Unit 108 ($1,850) and Unit 312 ($2,100). Both have passed the 5-day grace period. I have drafted personalized courtesy SMS notifications.';
      actionCard = {
        id: `action-${Date.now()}`,
        type: 'rent_notice',
        title: 'Delinquency Reminder Batch',
        subtitle: 'Skyline Residences • 2 Units',
        property: 'Skyline Residences',
        unit: 'Units 108 & 312',
        details: [
          { label: 'Total Outstanding', value: '$3,950.00' },
          { label: 'Grace Period', value: 'Expired Nov 5' },
          { label: 'Channels', value: 'SMS & In-App Portal Push' },
        ],
        primaryActionLabel: 'Dispatch Courtesy Reminders',
        secondaryActionLabel: 'Review Accounts',
        status: 'pending',
      };
    } else {
      thinkingSteps = [
        { id: 't1', label: `Analyzing request: "${prompt.slice(0, 30)}..."`, completed: false },
        { id: 't2', label: 'Cross-referencing building management database', completed: false },
        { id: 't3', label: 'Synthesizing verified actionable response', completed: false },
      ];
      fullResponse = `Understood. I have verified the records and updated the tenant registry for this request. The corresponding dispatch and compliance logs have been filed in your property dashboard.`;
    }

    // Step-by-step thinking progression with slight delay
    for (let i = 0; i < thinkingSteps.length; i++) {
      if (this.cancelRequested) return;
      await new Promise((res) => setTimeout(res, 450));
      thinkingSteps[i].completed = true;
      callbacks.onThinkingStep?.([...thinkingSteps]);
    }

    // Short pause before streaming text begins
    await new Promise((res) => setTimeout(res, 200));
    callbacks.onStreamingStart?.();

    // Stream tokens
    const words = fullResponse.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      if (this.cancelRequested) return;
      const word = words[i];
      currentText += (i === 0 ? '' : ' ') + word;
      callbacks.onToken?.(word, currentText);

      // Random natural delay between words (20-40ms)
      const delay = Math.floor(Math.random() * 25) + 20;
      await new Promise((res) => setTimeout(res, delay));
    }

    if (actionCard) {
      callbacks.onActionReady?.(actionCard);
    }

    callbacks.onComplete?.(fullResponse, actionCard);
  }
}

