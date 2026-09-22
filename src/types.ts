export type WorkMode = 'office' | 'remote' | 'client_site' | 'on_duty' | 'business_trip';

export type AttendanceStatus =
  | 'checked_in'
  | 'on_break'
  | 'checked_out'
  | 'not_checked_in';

export type RegularityStatus =
  | 'compliant'
  | 'irregular'
  | 'regularized'
  | 'review_required';

export type RegularizationReason =
  | 'client_meeting'
  | 'travel_delay'
  | 'wfh_approved'
  | 'biometric_issue'
  | 'personal_emergency'
  | 'onsite_duty';

export type CalendarEventType =
  | 'client_meeting'
  | 'internal_meeting'
  | 'offsite'
  | 'interview'
  | 'travel'
  | 'focus_work';

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  isManager?: boolean;
  shiftStart: string; // "09:00"
  shiftEnd: string;   // "18:00"
  graceMinutes: number; // 15
  regularizationsUsedThisMonth: number;
  regularizationQuota: number;
}

export interface BreakRecord {
  id: string;
  type: 'lunch' | 'coffee' | 'personal';
  startTime: string; // "HH:mm:ss" or ISO
  endTime?: string;
  durationMinutes: number;
}

export interface CheckInRecord {
  id: string;
  employeeId: string;
  date: string; // "YYYY-MM-DD"
  checkInTime: string; // "HH:mm:ss"
  checkOutTime?: string;
  workMode: WorkMode;
  locationName: string;
  coordinates?: { lat: number; lng: number };
  breaks: BreakRecord[];
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  regularityStatus: RegularityStatus;
  flags: string[];
  notes?: string;
  regularizationId?: string;
}

export interface CalendarEvent {
  id: string;
  employeeId: string;
  title: string;
  description?: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  date: string;      // "YYYY-MM-DD"
  type: CalendarEventType;
  location?: string;
  isExternal: boolean;
  attendees?: string[];
  source: 'google_calendar' | 'outlook' | 'synced_feed' | 'manual';
}

export interface RegularizationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  date: string;
  originalCheckIn?: string;
  originalCheckOut?: string;
  requestedCheckIn: string;
  requestedCheckOut: string;
  reasonCategory: RegularizationReason;
  explanation: string;
  linkedCalendarEventId?: string;
  linkedCalendarEventTitle?: string;
  calendarProofSnippet?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewerNotes?: string;
  autoRegularized?: boolean;
}

export interface AttendancePolicy {
  standardShiftStart: string;
  standardShiftEnd: string;
  gracePeriodMinutes: number;
  minFullDayHours: number;
  minHalfDayHours: number;
  monthlyRegularizationLimit: number;
  autoApproveVerifiedCalendarMeetings: boolean;
}

export interface LiveActivityFeedItem {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  action: 'check_in' | 'check_out' | 'start_break' | 'end_break' | 'regularize_submitted' | 'regularize_approved';
  timestamp: string;
  workMode?: WorkMode;
  details?: string;
}

export type FollowUpStatus =
  | 'waiting'
  | 'pending-leave'
  | 'pending-regularization'
  | 'call-required'
  | 'verification'
  | 'sent'
  | 'call-logged'
  | 'verified'
  | 'hr-escalated';

export type FollowUpStage =
  | 'stage_1_initial'
  | 'stage_2_followup'
  | 'stage_3_call'
  | 'resolved';

export interface ChatMessage {
  id: string;
  sender: 'system' | 'employee';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  buttons?: string[];
  isTemplate?: boolean;
}

export interface FollowUpCase {
  id: string;
  employeeId?: string;
  employeeName: string;
  employeeCode?: string;
  department: string;
  reportingManager: string;
  mobileNumber: string;
  date: string; // e.g. "01-Aug-2026" or "2026-08-01"
  code: string; // "A|A", "P|A", "A|P"
  reply: string; // e.g. "Waiting", "1 · Yes, I was absent", "2 · No, I was working", etc.
  replyOption?: 1 | 2 | 3 | 4;
  replyType?: 'button' | 'free_text';
  action: string; // "Pending response", "Apply leave", "Apply regularization", etc.
  status: FollowUpStatus;
  stage: FollowUpStage;
  firstMessageSentAt?: string;
  firstReplyReceivedAt?: string;
  twoDayReminderSentAt?: string;
  twoDayReply?: 'done' | 'not_done' | 'need_help' | 'no_reply';
  callTriggeredAt?: string;
  callOutcome?: 'completed' | 'not_completed' | 'needs_help' | 'no_answer';
  callNotes?: string;
  hrEscalationReason?: string;
  messages: ChatMessage[];
  language?: 'hindi' | 'english';
  aiClassification?: {
    option: number;
    confidence: number;
    explanation?: string;
  };
  // Plivo & Manager Escalation Tracking
  plivoCallUuid?: string;
  plivoCallStatus?: 'initiated' | 'in-progress' | 'completed' | 'failed' | 'simulated';
  callerNumber?: string;
  managerNotifiedAt?: string;
  managerNotificationMethod?: 'whatsapp' | 'call' | 'both';
  managerApprovalStatus?: 'pending' | 'approved' | 'rejected';
  managerApprovalNotes?: string;
  managerApprovedAt?: string;
  managerPhone?: string;
  // HR Shared Services Autonomous Punch & AR Action
  discrepancyType?: 'missed_in' | 'missed_out' | 'missing_both' | 'half_day' | 'not_done_ar' | 'pending_manager_approval';
  inTime?: string;
  outTime?: string;
  regularizedByAgent?: boolean;
  regularizedByAgentAt?: string;
  agentRegularizeNotes?: string;
  hrmsPunchId?: string;
  livekitRoomName?: string;
  // Multi-step Interactive Dialogue & Autonomous Agent Tracking
  activeFlowId?: string;
  selectedLeaveType?: string;
  selectedLeaveDuration?: string;
  selectedShiftTiming?: string;
  selectedPunchReason?: string;
  autonomousActionTaken?: string;
}

export interface ManagerNotificationItem {
  id: string;
  caseId: string;
  employeeName: string;
  employeeCode?: string;
  managerName: string;
  managerPhone: string;
  date: string;
  reason: string;
  type: 'whatsapp' | 'call' | 'both';
  status: 'pending' | 'approved' | 'rejected' | 'delivered';
  timestamp: string;
  callDurationSeconds?: number;
  approvalNotes?: string;
  reviewedAt?: string;
  lastResponse?: string;
  autoAgentEscalated?: boolean;
}

export interface AutoTriggerLog {
  id: string;
  timestamp: string;
  triggerType: 'stage_1_whatsapp' | 'stage_2_reminder' | 'stage_3_plivo_call' | 'manager_notification' | 'daily_sweep' | 'hrms_sync_2x' | 'agent_auto_regularize';
  caseId: string;
  employeeName: string;
  status: 'success' | 'skipped' | 'queued' | 'escalated';
  details: string;
}

// AI Model Configuration for Admin Panel
export type AiProvider = 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'llama';

export interface AiModelOption {
  id: string;
  name: string;
  provider: AiProvider;
  contextWindow: string;
  description: string;
  recommended: boolean;
}

export interface AiModelSettings {
  activeProvider: AiProvider;
  activeModelId: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  systemPersona: string;
  autoRegularizePermission: 'always_ask' | 'auto_regularize_up_to_3' | 'full_autonomous';
  testStatus?: 'idle' | 'testing' | 'connected' | 'error';
  lastTestMessage?: string;
}

// HRMS 2x Daily Live API Synchronization
export interface HrmsSyncSettings {
  apiBaseUrl: string;
  apiToken: string;
  companyCode: string;
  autoSyncEnabled: boolean;
  syncFrequency: 'twice_daily';
  syncTimes: string[]; // e.g. ["10:00", "17:30"]
  lastSyncTime?: string;
  lastSyncStatus: 'idle' | 'syncing' | 'success' | 'failed';
  lastSyncMessage?: string;
  stats?: {
    totalFetched: number;
    missedPunches: number;
    notDoneAr: number;
    pendingManagerAr: number;
  };
}

// LiveKit Real-time Voice Agent Configuration
export interface LiveKitSettings {
  livekitUrl: string;
  apiKey: string;
  apiSecret: string;
  roomPrefix: string;
  enabled: boolean;
  status: 'connected' | 'disconnected' | 'standby';
  lastCallRoom?: string;
}

// Meta Official WhatsApp Cloud API
export interface MetaWhatsAppSettings {
  wabaId: string;
  phoneNumberId: string;
  accessToken: string;
  webhookVerifyToken: string;
  templateName: string;
  templateStatus: 'approved' | 'pending' | 'draft';
  enabled: boolean;
}

// Biometric / Punch Record from HRMS
export interface HrmsPunchRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  date: string;
  shift: string;
  inTime?: string;
  outTime?: string;
  status: 'P' | 'A' | 'PR' | 'M' | 'H'; // Present, Absent, Partial, Missed, Half
  discrepancy: 'none' | 'missed_in' | 'missed_out' | 'missing_both' | 'half_day';
  arStatus: 'not_required' | 'not_done_ar' | 'pending_manager' | 'approved' | 'rejected' | 'agent_regularized';
  reportingManager: string;
  managerPhone: string;
  employeePhone: string;
  notes?: string;
}

export interface AppSettings {
  dailyCheckTime: string; // "10:00"
  schedulerEnabled: boolean;
  autoTriggerEnabled: boolean;
  autoTriggerIntervalMinutes: number; // e.g. 15 or 30 or 60
  dryRun: boolean;
  aiClassifierEnabled: boolean;
  waPhoneNumberId: string;
  waTemplateName: string;
  waTemplateButtons: number;
  timeZone: string;
  testPhoneNumber: string;
  remoteAccess: boolean;
  defaultCallLanguage: 'hindi' | 'english';
  defaultVoiceId: string;
  defaultWhatsAppLanguage: 'hindi' | 'english';
  // Plivo Settings
  plivoAuthId: string;
  plivoAuthToken: string;
  plivoPhoneNumber: string;
  plivoEnabled: boolean;
  // Manager Escalation Preferences
  autoNotifyManagerOnApplied: boolean;
  autoCallManagerOnApplied: boolean;
  // Admin AI Model Selection
  aiModelSettings: AiModelSettings;
  // HRMS 2x Daily Live API
  hrmsSyncSettings: HrmsSyncSettings;
  // LiveKit Voice Agent
  livekitSettings: LiveKitSettings;
  // Meta Approved WhatsApp Cloud API
  metaWhatsAppSettings: MetaWhatsAppSettings;
}
