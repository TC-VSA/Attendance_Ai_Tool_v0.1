import { AiModelOption, AiModelSettings, HrmsSyncSettings, LiveKitSettings, MetaWhatsAppSettings } from '../types';

export const AI_MODEL_CATALOGUE: AiModelOption[] = [
  // Google Gemini Models
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'gemini',
    contextWindow: '1M tokens',
    description: 'Ultra-fast, state-of-the-art multilingual speed for real-time voice & chat punch regularizations.',
    recommended: true,
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'gemini',
    contextWindow: '2M tokens',
    description: 'Deep reasoning for complex attendance policy discrepancies and multi-punch audit analysis.',
    recommended: false,
  },
  {
    id: 'gemini-flash-latest',
    name: 'Gemini Flash (Latest)',
    provider: 'gemini',
    contextWindow: '1M tokens',
    description: 'Always routes to latest low-latency multimodal model for automated agent workflows.',
    recommended: false,
  },
  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    provider: 'openai',
    contextWindow: '128k tokens',
    description: 'Omni model with high conversational tone for employee missed punch follow-ups.',
    recommended: false,
  },
  {
    id: 'gpt-4o-mini',
    name: 'OpenAI GPT-4o Mini',
    provider: 'openai',
    contextWindow: '128k tokens',
    description: 'Lightweight & cost-efficient model for automated WhatsApp responses.',
    recommended: false,
  },
  // Anthropic Claude
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    contextWindow: '200k tokens',
    description: 'High emotional intelligence & nuanced HR communications for escalation calls.',
    recommended: false,
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    contextWindow: '200k tokens',
    description: 'Instant sub-second reasoning for fast automated dialer responses.',
    recommended: false,
  },
  // DeepSeek
  {
    id: 'deepseek-chat-v3',
    name: 'DeepSeek Chat V3',
    provider: 'deepseek',
    contextWindow: '64k tokens',
    description: 'High-speed reasoning model specialized for structured enterprise tasks.',
    recommended: false,
  },
  // Meta Llama
  {
    id: 'llama-3.3-70b-instruct',
    name: 'Meta Llama 3.3 70B',
    provider: 'llama',
    contextWindow: '128k tokens',
    description: 'Open-weight high-intelligence model for on-premise / private HR deployments.',
    recommended: false,
  },
];

export const DEFAULT_AI_MODEL_SETTINGS: AiModelSettings = {
  activeProvider: 'gemini',
  activeModelId: 'gemini-2.5-flash',
  apiKey: '',
  temperature: 0.3,
  maxTokens: 1024,
  systemPersona:
    'You are the Senior HR Shared Services Autonomous Attendance AI Agent at Talent Carriage. Your objective is to proactively identify missed biometric punches and pending attendance regularizations (AR). During voice calls and WhatsApp chats, communicate politely and professionally (in Hindi or English based on employee preference). When an employee explains their punch discrepancy, formulate the exact punch-in and punch-out timestamps, log justification, and autonomously mark the attendance regularized in the HRMS system on behalf of the employee, then immediately alert their reporting manager for 1-click authorization.',
  autoRegularizePermission: 'auto_regularize_up_to_3',
  testStatus: 'idle',
};

export const DEFAULT_HRMS_SYNC_SETTINGS: HrmsSyncSettings = {
  apiBaseUrl: 'https://hrms.talentcarriage.com/api/v2',
  apiToken: 'tc_hrms_live_token_77a91b2c4e',
  companyCode: 'TC-CORP-IND',
  autoSyncEnabled: true,
  syncFrequency: 'twice_daily',
  syncTimes: ['10:00', '17:30'],
  lastSyncTime: 'Today at 10:00 AM IST',
  lastSyncStatus: 'success',
  lastSyncMessage: 'Fetched 142 biometric punch logs. Flagged 6 missed punches, 4 not-done ARs, and 2 manager approvals pending.',
  stats: {
    totalFetched: 142,
    missedPunches: 6,
    notDoneAr: 4,
    pendingManagerAr: 2,
  },
};

export const DEFAULT_LIVEKIT_SETTINGS: LiveKitSettings = {
  livekitUrl: 'wss://voice-agent.talentcarriage.livekit.cloud',
  apiKey: 'API9xK2mP8Lq4vW',
  apiSecret: 'sec_7b89d412e0f249c1',
  roomPrefix: 'hrss-voice-room',
  enabled: true,
  status: 'connected',
};

export const DEFAULT_META_WHATSAPP_SETTINGS: MetaWhatsAppSettings = {
  wabaId: '394820184920491',
  phoneNumberId: '104829582910492',
  accessToken: 'EAAO...[System User Permanent Access Token Active]',
  webhookVerifyToken: 'talent_carriage_wa_verify_2026',
  templateName: 'attendance_missed_punch_ar_v1',
  templateStatus: 'approved',
  enabled: true,
};
