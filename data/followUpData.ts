import { FollowUpCase, AppSettings } from '../types';
import {
  DEFAULT_AI_MODEL_SETTINGS,
  DEFAULT_HRMS_SYNC_SETTINGS,
  DEFAULT_LIVEKIT_SETTINGS,
  DEFAULT_META_WHATSAPP_SETTINGS,
} from './aiModels';

export const INITIAL_APP_SETTINGS: AppSettings = {
  dailyCheckTime: '10:00',
  schedulerEnabled: true,
  autoTriggerEnabled: true,
  autoTriggerIntervalMinutes: 30,
  dryRun: false,
  aiClassifierEnabled: true,
  waPhoneNumberId: '104829582910492',
  waTemplateName: 'attendance_missed_punch_ar_v1',
  waTemplateButtons: 4,
  timeZone: 'Asia/Kolkata',
  testPhoneNumber: '919876543210',
  remoteAccess: false,
  defaultCallLanguage: 'hindi',
  defaultVoiceId: 'g5CIjZEefAph4nQFvHAz', // Kabir (Hindi Male - Default)
  defaultWhatsAppLanguage: 'english',
  plivoAuthId: 'MAMJAZYJMYZDFMZDHMOG',
  plivoAuthToken: 'ZGM3MzU2NWFiNTEyNzcyYTU1OTVjNzM3ODVhYzk4',
  plivoPhoneNumber: '+919876543210',
  plivoEnabled: true,
  autoNotifyManagerOnApplied: true,
  autoCallManagerOnApplied: true,
  // Admin AI Model Selection
  aiModelSettings: DEFAULT_AI_MODEL_SETTINGS,
  // HRMS 2x Daily Live API
  hrmsSyncSettings: DEFAULT_HRMS_SYNC_SETTINGS,
  // LiveKit Voice Agent
  livekitSettings: DEFAULT_LIVEKIT_SETTINGS,
  // Meta Approved WhatsApp Cloud API
  metaWhatsAppSettings: DEFAULT_META_WHATSAPP_SETTINGS,
};

export const LANGUAGE_TOGGLE_BUTTON = '🌐 Change Language / भाषा बदलें';

export const WORKFLOW_TEMPLATES = {
  firstMessage: (name: string, date: string, code: string, lang: 'hindi' | 'english' = 'english') => {
    const halfNote =
      code === 'P|A'
        ? ' (second half)'
        : code === 'A|P'
        ? ' (first half)'
        : '';

    if (lang === 'hindi') {
      const halfHindi =
        code === 'P|A' ? ' (दूसरे हाफ में)' : code === 'A|P' ? ' (पहले हाफ में)' : '';
      return `नमस्ते ${name.split(' ')[0]}, हमारी उपस्थिति रिकॉर्ड के अनुसार आप ${date}${halfHindi} को अनुपस्थित दर्ज हैं। कृपया नीचे दिए गए विकल्पों में से एक चुनकर कारण की पुष्टि करें।`;
    }

    return `Hi ${name.split(' ')[0]}, our attendance record shows you are marked absent on ${date}${halfNote}. Please confirm the reason by choosing one option below.`;
  },

  options: [
    '1. Yes, I was absent',
    '2. No, I was working',
    '3. I have already applied leave',
    '4. I have already sent regularization request',
    LANGUAGE_TOGGLE_BUTTON,
  ],

  optionsHindi: [
    '1. हाँ, मैं अनुपस्थित था',
    '2. नहीं, मैं काम कर रहा था',
    '3. मैंने छुट्टी के लिए आवेदन कर दिया है',
    '4. मैंने नियमितीकरण भेज दिया है',
    LANGUAGE_TOGGLE_BUTTON,
  ],

  getOptionsForLang: (lang: 'hindi' | 'english' = 'english') => {
    return lang === 'hindi' ? WORKFLOW_TEMPLATES.optionsHindi : WORKFLOW_TEMPLATES.options;
  },

  systemReplyForOption: (option: 1 | 2 | 3 | 4, date: string, lang: 'hindi' | 'english' = 'english') => {
    if (lang === 'hindi') {
      switch (option) {
        case 1:
          return 'यदि आपके पास लीव बैलेंस है तो कृपया पोर्टल पर छुट्टी का आवेदन करें। यदि लीव बैलेंस नहीं है, तो अनपेड लीव की प्रक्रिया का पालन करें और अपने मैनेजर से स्वीकृत कराएं।';
        case 2:
          return `कृपया ${date} के लिए उपस्थिति नियमितीकरण (Regularization) का आवेदन करें और अपने मैनेजर से स्वीकृत कराएं।`;
        case 3:
          return `कृपया अपने मैनेजर से ${date} की छुट्टी स्वीकृत (Approve) करने का अनुरोध करें।`;
        case 4:
          return `कृपया अपने मैनेजर से ${date} के नियमितीकरण अनुरोध को स्वीकृत करने का अनुरोध करें।`;
      }
    }

    switch (option) {
      case 1:
        return 'Please apply leave if leave balance is available. If leave balance is not available, please follow the HR process for unpaid leave/regularization and get it approved by your manager.';
      case 2:
        return `Please apply attendance regularization for ${date} and get it approved by your manager.`;
      case 3:
        return `Please ask your manager to approve your leave for ${date}.`;
      case 4:
        return `Please ask your manager to approve your regularization request for ${date}.`;
    }
  },

  unclearReply: (date: string, lang: 'hindi' | 'english' = 'english') => {
    if (lang === 'hindi') {
      return `माफ़ कीजिए, हम ${date} के संबंध में आपका उत्तर समझ नहीं पाए। कृपया 1, 2, 3 या 4 लिखकर या नीचे दिए गए बटन पर टैप करके जवाब दें:
1. हाँ, मैं अनुपस्थित था
2. नहीं, मैं काम कर रहा था
3. मैंने छुट्टी के लिए आवेदन कर दिया है
4. मैंने नियमितीकरण भेज दिया है`;
    }

    return `Sorry, we couldn't understand your reply about ${date}. Please reply with 1, 2, 3 or 4:
1. Yes, I was absent
2. No, I was working
3. I have already applied leave
4. I have already sent regularization request`;
  },

  twoDayReminder: (originalOption: 1 | 2 | 3 | 4 | undefined, date: string, lang: 'hindi' | 'english' = 'english') => {
    if (lang === 'hindi') {
      if (originalOption === 1) {
        return `रिमाइंडर: क्या आपने ${date} के लिए लीव/अनपेड लीव प्रक्रिया पूरी कर ली है और मैनेजर से स्वीकृत करा ली है?\n\nनीचे दिए गए विकल्पों में से एक चुनें:\n1. हो गया (Done)\n2. नहीं हुआ (Not Done)\n3. मदद चाहिए (Need Help)`;
      }
      if (originalOption === 2) {
        return `रिमाइंडर: क्या आपने ${date} के लिए नियमितीकरण सबमिट करके मैनेजर से अप्रूव करा लिया है?\n\nनीचे दिए गए विकल्पों में से एक चुनें:\n1. हो गया (Done)\n2. नहीं हुआ (Not Done)\n3. मदद चाहिए (Need Help)`;
      }
      if (originalOption === 3) {
        return `रिमाइंडर: क्या आपके मैनेजर ने ${date} की छुट्टी अप्रूव कर दी है?\n\n1. हो गया (Done)\n2. नहीं हुआ (Not Done)\n3. मदद चाहिए (Need Help)`;
      }
      if (originalOption === 4) {
        return `रिमाइंडर: क्या आपके मैनेजर ने ${date} का नियमितीकरण अनुरोध अप्रूव कर दिया है?\n\n1. हो गया (Done)\n2. नहीं हुआ (Not Done)\n3. मदद चाहिए (Need Help)`;
      }
      return `रिमाइंडर: ${date} के लिए आपकी उपस्थिति कार्यवाही अभी भी लंबित है। कृपया स्थिति अपडेट करें:\n1. हो गया (Done)\n2. नहीं हुआ (Not Done)\n3. मदद चाहिए (Need Help)`;
    }

    if (originalOption === 1) {
      return `Reminder: have you completed the leave/unpaid leave process for ${date} and got it approved by your manager?\n\nReply with one option:\n1. Done\n2. Not Done\n3. Need Help`;
    }
    if (originalOption === 2) {
      return `Reminder: have you submitted regularization for ${date} and got it approved by your manager?\n\nReply with one option:\n1. Done\n2. Not Done\n3. Need Help`;
    }
    if (originalOption === 3) {
      return `Reminder: has your manager approved your leave for ${date}?\n\nReply with one option:\n1. Approved\n2. Not Approved\n3. Need Help`;
    }
    if (originalOption === 4) {
      return `Reminder: has your manager approved your regularization request for ${date}?\n\nReply with one option:\n1. Approved\n2. Not Approved\n3. Need Help`;
    }
    return `Reminder: Your attendance resolution for ${date} is still pending. Please update your status:\n1. Done\n2. Not Done\n3. Need Help`;
  },

  twoDayOptions: ['1. Done', '2. Not Done', '3. Need Help', LANGUAGE_TOGGLE_BUTTON],
  twoDayOptionsHindi: ['1. हो गया (Done)', '2. नहीं हुआ (Not Done)', '3. मदद चाहिए (Need Help)', LANGUAGE_TOGGLE_BUTTON],

  // Call Scripts
  callScriptHindi: (name: string, date: string) => {
    return `नमस्ते ${name.split(' ')[0]}, यह टैलेंट कैरिज की ओर से ऑटोमेटेड अटेंडेंस फॉलो-अप कॉल है।

${date} की आपकी उपस्थिति कार्यवाही अभी भी लंबित है।

कृपया पोर्टल पर लीव या रेगुलराइज़ेशन प्रोसेस पूरा करें और अपने मैनेजर से स्वीकृत कराएं। धन्यवाद।

For listening in English, press the # button.`;
  },

  callScriptEnglish: (name: string, date: string) => {
    return `Hello ${name.split(' ')[0]}, this is an automated HR reminder from Talent Carriage.

Your attendance action for ${date} is still pending.

Please complete the leave, unpaid leave, or regularization process and get it approved by your manager.

Thank you.`;
  },

  callScript: (name: string, date: string, lang: 'hindi' | 'english' = 'hindi') => {
    return lang === 'hindi'
      ? WORKFLOW_TEMPLATES.callScriptHindi(name, date)
      : WORKFLOW_TEMPLATES.callScriptEnglish(name, date);
  },

  // Manager Escalation Templates
  managerWhatsAppNotification: (
    managerName: string,
    empName: string,
    date: string,
    actionType: string,
    lang: 'hindi' | 'english' = 'english'
  ) => {
    if (lang === 'hindi') {
      return `📢 *मैनेजर अटेंडेंस अप्रूवल सूचना*\n\nनमस्ते ${managerName.split(' ')[0]},\nकर्मचारी *${empName}* ने *${date}* के लिए ${actionType} अनुरोध दर्ज किया है और आपकी स्वीकृति प्रतीक्षित है।\n\nकृपया नीचे दिए गए विकल्पों में से एक का चयन करें:`;
    }
    return `📢 *Manager Attendance Authorization Request*\n\nHello ${managerName.split(' ')[0]},\nEmployee *${empName}* has submitted an attendance ${actionType} for *${date}* and is awaiting your authorization.\n\nPlease choose an action below:`;
  },

  managerCallScript: (
    managerName: string,
    empName: string,
    date: string,
    lang: 'hindi' | 'english' = 'english'
  ) => {
    if (lang === 'hindi') {
      return `नमस्ते ${managerName.split(' ')[0]}, यह टैलेंट कैरिज से मैनेजर अटेंडेंस ऑथराइजेशन कॉल है। आपकी टीम सदस्य ${empName} ने ${date} की उपस्थिति को नियमित करने का अनुरोध किया है। स्वीकृति के लिए 1 दबाएं, अस्वीकृत करने के लिए 2 दबाएं, या पोर्टल पर समीक्षा के लिए 3 दबाएं। For listening in English, press the # button.`;
    }
    return `Hello ${managerName.split(' ')[0]}, this is an automated attendance authorization call from Talent Carriage. Your team member ${empName} has requested attendance regularization for ${date}. To approve this regularization request, press 1. To reject, press 2. To review details in the portal, press 3.`;
  },
};

export const INITIAL_FOLLOW_UP_CASES: FollowUpCase[] = [
  {
    id: 'case-1',
    employeeName: 'Leo Johnson',
    employeeCode: 'DPOD-104',
    department: 'Finance & Accounts',
    reportingManager: 'Deepak Gajjar',
    mobileNumber: '919876543210',
    date: '01-Aug-2026',
    code: 'A|A',
    reply: 'Waiting',
    action: 'Pending response',
    status: 'waiting',
    stage: 'stage_1_initial',
    firstMessageSentAt: '01-Aug-2026 10:02',
    messages: [
      {
        id: 'msg-1-1',
        sender: 'system',
        text: 'Hi Leo, our attendance record shows you are marked absent on 01-Aug-2026. Please confirm the reason by choosing one option below.',
        timestamp: '10:02 AM',
        status: 'delivered',
        isTemplate: true,
        buttons: [
          '1. Yes, I was absent',
          '2. No, I was working',
          '3. I have already applied leave',
          '4. I have already sent regularization request',
        ],
      },
    ],
  },
  {
    id: 'case-2',
    employeeName: 'Brijesh Patel',
    employeeCode: 'DPOD-219',
    department: 'Procurement',
    reportingManager: 'Deepak Gajjar',
    mobileNumber: '919876543211',
    date: '05-Aug-2026',
    code: 'A|A',
    reply: '2 · No, I was working',
    replyOption: 2,
    replyType: 'button',
    action: 'Apply regularization',
    status: 'pending-regularization',
    stage: 'stage_1_initial',
    firstMessageSentAt: '05-Aug-2026 10:00',
    firstReplyReceivedAt: '05-Aug-2026 10:14',
    messages: [
      {
        id: 'msg-2-1',
        sender: 'system',
        text: 'Hi Brijesh, our attendance record shows you are marked absent on 05-Aug-2026. Please confirm the reason by choosing one option below.',
        timestamp: '10:00 AM',
        status: 'read',
        isTemplate: true,
        buttons: [
          '1. Yes, I was absent',
          '2. No, I was working',
          '3. I have already applied leave',
          '4. I have already sent regularization request',
        ],
      },
      {
        id: 'msg-2-2',
        sender: 'employee',
        text: '2. No, I was working',
        timestamp: '10:14 AM',
        status: 'read',
      },
      {
        id: 'msg-2-3',
        sender: 'system',
        text: 'Please apply attendance regularization for 05-Aug-2026 and get it approved by your manager.',
        timestamp: '10:14 AM',
        status: 'read',
      },
    ],
  },
  {
    id: 'case-3',
    employeeName: 'Jasvant Katariya',
    employeeCode: 'DPOD-302',
    department: 'Marketing & Brand',
    reportingManager: 'Mayank Talpada',
    mobileNumber: '919876543212',
    date: '31-Aug-2026',
    code: 'P|A',
    reply: '1 · Yes, I was absent',
    replyOption: 1,
    replyType: 'button',
    action: 'Apply leave',
    status: 'pending-leave',
    stage: 'stage_2_followup',
    firstMessageSentAt: '31-Aug-2026 10:05',
    firstReplyReceivedAt: '31-Aug-2026 10:30',
    twoDayReminderSentAt: '02-Sep-2026 10:00',
    messages: [
      {
        id: 'msg-3-1',
        sender: 'system',
        text: 'Hi Jasvant, our attendance record shows you are marked absent on 31-Aug-2026 (second half). Please confirm the reason by choosing one option below.',
        timestamp: '10:05 AM',
        status: 'read',
        isTemplate: true,
        buttons: [
          '1. Yes, I was absent',
          '2. No, I was working',
          '3. I have already applied leave',
          '4. I have already sent regularization request',
        ],
      },
      {
        id: 'msg-3-2',
        sender: 'employee',
        text: '1. Yes, I was absent',
        timestamp: '10:30 AM',
        status: 'read',
      },
      {
        id: 'msg-3-3',
        sender: 'system',
        text: 'Please apply leave if leave balance is available. If leave balance is not available, please follow the HR process for unpaid leave/regularization and get it approved by your manager.',
        timestamp: '10:30 AM',
        status: 'read',
      },
      {
        id: 'msg-3-4',
        sender: 'system',
        text: 'Reminder: have you completed the leave/unpaid leave process for 31-Aug-2026 and got it approved by your manager?\n\nReply with one option:\n1. Done\n2. Not Done\n3. Need Help',
        timestamp: '10:00 AM (2 days later)',
        status: 'delivered',
        buttons: ['1. Done', '2. Not Done', '3. Need Help'],
      },
    ],
  },
  {
    id: 'case-4',
    employeeName: 'Dhruvi Barot',
    employeeCode: 'DPOD-188',
    department: 'Content Development',
    reportingManager: 'Mayank Talpada',
    mobileNumber: '919876543213',
    date: '17-Aug-2026',
    code: 'A|A',
    reply: 'No reply',
    action: 'Follow-up call required',
    status: 'call-required',
    stage: 'stage_3_call',
    firstMessageSentAt: '17-Aug-2026 10:00',
    twoDayReminderSentAt: '19-Aug-2026 10:00',
    messages: [
      {
        id: 'msg-4-1',
        sender: 'system',
        text: 'Hi Dhruvi, our attendance record shows you are marked absent on 17-Aug-2026. Please confirm the reason by choosing one option below.',
        timestamp: '10:00 AM',
        status: 'delivered',
        isTemplate: true,
        buttons: [
          '1. Yes, I was absent',
          '2. No, I was working',
          '3. I have already applied leave',
          '4. I have already sent regularization request',
        ],
      },
      {
        id: 'msg-4-2',
        sender: 'system',
        text: 'Reminder: Your attendance resolution for 17-Aug-2026 is still pending. Please update your status:\n1. Done\n2. Not Done\n3. Need Help',
        timestamp: '10:00 AM (2 days later)',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'case-5',
    employeeName: 'Krish Patel',
    employeeCode: 'DPOD-094',
    department: 'Interior Design',
    reportingManager: 'Aelin Gajjar',
    mobileNumber: '919876543214',
    date: '23-Aug-2026',
    code: 'A|A',
    reply: '3 · I have already applied leave',
    replyOption: 3,
    replyType: 'button',
    action: 'Verify leave in HRMS',
    status: 'verification',
    stage: 'stage_1_initial',
    firstMessageSentAt: '23-Aug-2026 10:00',
    firstReplyReceivedAt: '23-Aug-2026 11:20',
    messages: [
      {
        id: 'msg-5-1',
        sender: 'system',
        text: 'Hi Krish, our attendance record shows you are marked absent on 23-Aug-2026. Please confirm the reason by choosing one option below.',
        timestamp: '10:00 AM',
        status: 'read',
        isTemplate: true,
        buttons: [
          '1. Yes, I was absent',
          '2. No, I was working',
          '3. I have already applied leave',
          '4. I have already sent regularization request',
        ],
      },
      {
        id: 'msg-5-2',
        sender: 'employee',
        text: '3. I have already applied leave',
        timestamp: '11:20 AM',
        status: 'read',
      },
      {
        id: 'msg-5-3',
        sender: 'system',
        text: 'Please ask your manager to approve your leave for 23-Aug-2026.',
        timestamp: '11:20 AM',
        status: 'read',
      },
    ],
  },
  {
    id: 'case-6',
    employeeName: 'Ankit Panwar',
    employeeCode: 'DPOD-142',
    department: 'Software Engineering',
    reportingManager: 'Priya Sharma',
    mobileNumber: '917042097645',
    date: '18-Aug-2026',
    code: 'A|P',
    reply: '4 · I have already sent regularization request',
    replyOption: 4,
    replyType: 'button',
    action: 'Verify manager approval',
    status: 'pending-regularization',
    stage: 'stage_2_followup',
    firstMessageSentAt: '18-Aug-2026 10:00',
    firstReplyReceivedAt: '18-Aug-2026 10:08',
    twoDayReminderSentAt: '20-Aug-2026 10:00',
    twoDayReply: 'not_done',
    messages: [
      {
        id: 'msg-6-1',
        sender: 'system',
        text: 'Hi Ankit, our attendance record shows you are marked absent on 18-Aug-2026 (first half). Please confirm the reason by choosing one option below.',
        timestamp: '10:00 AM',
        status: 'read',
        isTemplate: true,
        buttons: [
          '1. Yes, I was absent',
          '2. No, I was working',
          '3. I have already applied leave',
          '4. I have already sent regularization request',
        ],
      },
      {
        id: 'msg-6-2',
        sender: 'employee',
        text: '4. I have already sent regularization request',
        timestamp: '10:08 AM',
        status: 'read',
      },
      {
        id: 'msg-6-3',
        sender: 'system',
        text: 'Please ask your manager to approve your regularization request for 18-Aug-2026.',
        timestamp: '10:08 AM',
        status: 'read',
      },
      {
        id: 'msg-6-4',
        sender: 'system',
        text: 'Reminder: has your manager approved your regularization request for 18-Aug-2026?\n\nReply with one option:\n1. Approved\n2. Not Approved\n3. Need Help',
        timestamp: '10:00 AM (2 days later)',
        status: 'read',
        buttons: ['1. Approved', '2. Not Approved', '3. Need Help'],
      },
      {
        id: 'msg-6-5',
        sender: 'employee',
        text: '2. Not Approved (Manager was travelling)',
        timestamp: '10:45 AM',
        status: 'read',
      },
    ],
  },
  {
    id: 'case-7',
    employeeName: 'Marcus Vance',
    employeeCode: 'DPOD-088',
    department: 'Strategic Sales',
    reportingManager: 'Priya Sharma',
    mobileNumber: '919876543217',
    date: '20-Aug-2026',
    code: 'P|A',
    reply: '2 · No, I was working',
    replyOption: 2,
    replyType: 'button',
    action: 'Apply regularization with calendar proof',
    status: 'pending-regularization',
    stage: 'stage_1_initial',
    firstMessageSentAt: '20-Aug-2026 10:00',
    firstReplyReceivedAt: '20-Aug-2026 10:15',
    messages: [
      {
        id: 'msg-7-1',
        sender: 'system',
        text: 'Hi Marcus, our attendance record shows you are marked absent on 20-Aug-2026 (second half). Please confirm the reason by choosing one option below.',
        timestamp: '10:00 AM',
        status: 'read',
        isTemplate: true,
        buttons: [
          '1. Yes, I was absent',
          '2. No, I was working',
          '3. I have already applied leave',
          '4. I have already sent regularization request',
        ],
      },
      {
        id: 'msg-7-2',
        sender: 'employee',
        text: '2. No, I was working',
        timestamp: '10:15 AM',
        status: 'read',
      },
      {
        id: 'msg-7-3',
        sender: 'system',
        text: 'Please apply attendance regularization for 20-Aug-2026 and get it approved by your manager.',
        timestamp: '10:15 AM',
        status: 'read',
      },
    ],
  },
];
