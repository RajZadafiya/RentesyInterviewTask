import { ChatMessage, QuickSuggestion } from '@/types/chat';

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content:
      'Hello Raj! I am your Rentesy Property AI Assistant. I can help you draft tenant notices, verify lease agreements, and dispatch contractor work orders across your properties.',
    timestamp: '10:41 AM',
  },
  {
    id: 'msg-2',
    role: 'user',
    content:
      'Unit 402 reported an AC cooling issue this morning. Please check licensed HVAC contractor availability and prepare an emergency inspection dispatch.',
    timestamp: '10:42 AM',
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content:
      'I inspected the tenant report for Unit 402 and verified warranty coverage under Apex Property Management. I found an available priority slot with CoolAir Solutions tomorrow morning and drafted the entry notice for tenant approval.',
    timestamp: '10:42 AM',
    thinkingSteps: [
      { id: 'step-1', label: 'Retrieved maintenance record & warranty for Unit 402', completed: true },
      { id: 'step-2', label: 'Queried approved HVAC vendor schedules (Apex / CoolAir)', completed: true },
      { id: 'step-3', label: 'Generated compliant 24-hour tenant notice of entry', completed: true },
    ],
    actionCard: {
      id: 'action-101',
      type: 'maintenance_dispatch',
      title: 'HVAC Emergency Dispatch Notice',
      subtitle: 'Skyline Luxury Residences • Building B',
      property: 'Skyline Residences',
      unit: 'Unit 402 (Tenant: Sarah Jenkins)',
      details: [
        { label: 'Issue', value: 'Compressor cycling & condensate leak' },
        { label: 'Contractor', value: 'CoolAir Solutions (Licensed #HV-892)' },
        { label: 'Proposed Time', value: 'Tomorrow, Nov 12 • 10:00 AM - 11:30 AM' },
        { label: 'Notice Status', value: '24-hour statutory advance notice ready' },
      ],
      primaryActionLabel: 'Confirm & Dispatch Notice',
      secondaryActionLabel: 'Modify Schedule',
      status: 'pending',
    },
  },
];

export const QUICK_SUGGESTIONS: QuickSuggestion[] = [
  {
    id: 'sug-1',
    label: 'Inspect Unit 3B Plumbing',
    prompt: 'Check plumbing status for Unit 3B and draft contractor schedule',
    iconName: 'construct-outline',
  },
  {
    id: 'sug-2',
    label: 'Draft Lease Renewal',
    prompt: 'Generate 12-month lease renewal proposal for Unit 204 with 4% adjustment',
    iconName: 'document-text-outline',
  },
  {
    id: 'sug-3',
    label: 'Late Rent Summary',
    prompt: 'Summarize pending rental payments and send polite balance reminders',
    iconName: 'cash-outline',
  },
  {
    id: 'sug-4',
    label: 'Elevator Maintenance Notice',
    prompt: 'Broadcast routine elevator maintenance window for Building A',
    iconName: 'notifications-outline',
  },
];

export const SIMULATED_STREAMING_RESPONSES = [
  {
    text: "I've drafted the 12-month renewal notice for Unit 204. The calculated escalation is 3.8% based on local tenancy guidelines, setting the new rent to $2,540/mo. All documentation is prepared for electronic signature.",
    thinkingSteps: [
      { id: 'step-a', label: 'Accessed current lease terms for Unit 204', completed: true },
      { id: 'step-b', label: 'Calculated municipality CPI cap (max 4.0%)', completed: true },
      { id: 'step-c', label: 'Compiled addendum agreement PDF package', completed: true },
    ],
    actionCard: {
      id: 'action-102',
      type: 'lease_renewal' as const,
      title: 'Lease Renewal Agreement',
      subtitle: 'Grand Central Lofts • Unit 204',
      property: 'Grand Central Lofts',
      unit: 'Unit 204 (Tenant: Michael Chen)',
      details: [
        { label: 'Current Rent', value: '$2,445 / month' },
        { label: 'Proposed Rent', value: '$2,540 / month (+3.8%)' },
        { label: 'Term Length', value: '12 Months (Dec 1, 2026 - Nov 30, 2027)' },
        { label: 'Signing Deadline', value: 'November 25, 2026' },
      ],
      primaryActionLabel: 'Send Renewal to Tenant',
      secondaryActionLabel: 'Edit Terms',
      status: 'pending' as const,
    },
  },
  {
    text: "Unit 3B's plumbing contractor has confirmed the dispatch window. The master shut-off valve inspection is scheduled for Thursday at 2:00 PM. A push notification and email alert have been prepared for the resident.",
    thinkingSteps: [
      { id: 'step-x', label: 'Contacted Metro Plumbing emergency desk', completed: true },
      { id: 'step-y', label: 'Allocated job #PL-4982 with certified technician', completed: true },
    ],
  },
];

