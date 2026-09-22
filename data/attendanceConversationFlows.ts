// Multi-Step Interactive Dialogue Trees & Trail Questions for WhatsApp and Voice Keypad IVR

export interface TrailOption {
  id: string;
  label: string;
  labelHindi: string;
  icon?: string;
  dtmfKey?: string;
  actionPayload: string;
}

export interface ConversationNode {
  id: string;
  agentPromptHindi: string;
  agentPromptEnglish: string;
  voiceScriptHindi: string;
  voiceScriptEnglish: string;
  options: TrailOption[];
  isFinalResolution?: boolean;
  resolutionType?: 'leave_applied' | 'punch_regularized' | 'manager_reminded' | 'verified_resolved';
}

export const WHATSAPP_FLOW_TREES: Record<string, ConversationNode> = {
  // Root Initial Prompt
  INITIAL: {
    id: 'INITIAL',
    agentPromptHindi:
      'नमस्ते, हमारी उपस्थिति रिकॉर्ड के अनुसार आप {date} को अनुपस्थित (Absent) दर्ज हैं।\nकृपया स्थिति स्पष्ट करने के लिए नीचे दिए गए विकल्पों में से एक चुनें:',
    agentPromptEnglish:
      'Hi, our biometric attendance system shows you are marked absent on {date}.\nPlease confirm your status by selecting an option below:',
    voiceScriptHindi:
      'नमस्ते {name}, मैं टैलेंट कैरिज HR शेयर्ड सर्विसेज से AI अटेंडेंस वॉइस एजेंट हूँ। {date} की आपकी उपस्थिति कार्यवाही अभी लंबित है। यदि आप अनुपस्थित थे तो 1 दबाएं। यदि आप उपस्थित थे और पंच भूल गए तो 2 दबाएं। यदि छुट्टी लगा चुके हैं तो 3 दबाएं। नियमितीकरण के लिए 4 दबाएं। अंग्रेजी के लिए # दबाएं।',
    voiceScriptEnglish:
      'Hello {name}, this is the Talent Carriage HR Shared Services automated attendance voice agent. Your attendance resolution for {date} is pending. If you were absent, press 1. If you worked and missed your punch, press 2. If you already applied leave, press 3. If you sent regularization, press 4. For Hindi, press *.',
    options: [
      {
        id: 'opt_1_absent',
        label: '1️⃣ Yes, I was absent',
        labelHindi: '1️⃣ हाँ, मैं अनुपस्थित था',
        icon: '🏠',
        dtmfKey: '1',
        actionPayload: 'FLOW_ABSENT_STEP1',
      },
      {
        id: 'opt_2_working',
        label: '2️⃣ No, I was working (Missed Punch)',
        labelHindi: '2️⃣ नहीं, मैं काम कर रहा था (पंच मिस)',
        icon: '💼',
        dtmfKey: '2',
        actionPayload: 'FLOW_WORKING_STEP1',
      },
      {
        id: 'opt_3_applied_leave',
        label: '3️⃣ I have already applied leave',
        labelHindi: '3️⃣ मैंने छुट्टी के लिए आवेदन कर दिया है',
        icon: '📋',
        dtmfKey: '3',
        actionPayload: 'FLOW_APPLIED_LEAVE_STEP1',
      },
      {
        id: 'opt_4_regularization',
        label: '4️⃣ I have sent regularization request',
        labelHindi: '4️⃣ मैंने नियमितीकरण भेज दिया है',
        icon: '⏱️',
        dtmfKey: '4',
        actionPayload: 'FLOW_REGULARIZATION_STEP1',
      },
    ],
  },

  // -------------------------------------------------------------
  // BRANCH 1: EMPLOYEE WAS ABSENT (Agent asks to apply leave on behalf)
  // -------------------------------------------------------------
  FLOW_ABSENT_STEP1: {
    id: 'FLOW_ABSENT_STEP1',
    agentPromptHindi:
      'समझ गया, आपकी अनुपस्थिति नोट कर ली गई है।\n\nक्या मैं आपकी ओर से HRMS पोर्टल पर लीव (Leave) अप्लाई कर दूँ ताकि आपकी सैलरी न कटे?\nकृपया अपनी लीव का प्रकार चुनें:',
    agentPromptEnglish:
      'Understood, your absence has been noted.\n\nCan I apply for leave on your behalf in the HRMS portal so your salary is not deducted?\nPlease choose your leave type:',
    voiceScriptHindi:
      'आपने अनुपस्थिति चुना है। क्या मैं आपकी ओर से HRMS में लीव दर्ज कर दूँ? सिक लीव (Sick Leave) के लिए 1 दबाएं। कैजुअल लीव (CL) के लिए 2 दबाएं। प्रिविलेज या अर्न्ड लीव (EL) के लिए 3 दबाएं। यदि आप खुद पोर्टल पर लगाएंगे तो 4 दबाएं।',
    voiceScriptEnglish:
      'You selected absent. Should I apply for leave on your behalf? For Sick Leave, press 1. For Casual Leave, press 2. For Earned Leave, press 3. If you prefer to apply yourself, press 4.',
    options: [
      {
        id: 'leave_sl',
        label: '🤒 Sick Leave (SL)',
        labelHindi: '🤒 सिक लीव (SL)',
        icon: '🤒',
        dtmfKey: '1',
        actionPayload: 'FLOW_ABSENT_DURATION_SL',
      },
      {
        id: 'leave_cl',
        label: '📋 Casual Leave (CL)',
        labelHindi: '📋 कैजुअल लीव (CL)',
        icon: '📋',
        dtmfKey: '2',
        actionPayload: 'FLOW_ABSENT_DURATION_CL',
      },
      {
        id: 'leave_el',
        label: '🏖️ Earned Leave (EL)',
        labelHindi: '🏖️ प्रिविलेज / अर्न्ड लीव (EL)',
        icon: '🏖️',
        dtmfKey: '3',
        actionPayload: 'FLOW_ABSENT_DURATION_EL',
      },
      {
        id: 'leave_self',
        label: '❌ No, I will apply myself on portal',
        labelHindi: '❌ नहीं, मैं खुद पोर्टल पर लगाऊंगा',
        icon: '❌',
        dtmfKey: '4',
        actionPayload: 'FLOW_ABSENT_SELF',
      },
    ],
  },

  // Leave Duration step (Full day vs Half day)
  FLOW_ABSENT_DURATION_SL: {
    id: 'FLOW_ABSENT_DURATION_SL',
    agentPromptHindi:
      'आपने *सिक लीव (SL)* चुनी है।\n\nक्या यह पूरे दिन की छुट्टी (Full Day) है या हाफ-डे (Half Day)?',
    agentPromptEnglish:
      'You selected *Sick Leave (SL)*.\n\nIs this a Full Day leave or Half Day?',
    voiceScriptHindi:
      'सिक लीव के लिए, पूरे दिन (Full Day) हेतु 1 दबाएं। पहले हाफ (First Half) के लिए 2 दबाएं। दूसरे हाफ (Second Half) के लिए 3 दबाएं।',
    voiceScriptEnglish:
      'For Sick Leave, press 1 for Full Day. Press 2 for First Half. Press 3 for Second Half.',
    options: [
      {
        id: 'dur_full',
        label: '☀️ Full Day Leave (पूरा दिन)',
        labelHindi: '☀️ पूरा दिन (Full Day)',
        icon: '☀️',
        dtmfKey: '1',
        actionPayload: 'FLOW_ABSENT_CONFIRM_SL_FULL',
      },
      {
        id: 'dur_half_1',
        label: '⛅ First Half (पहला हाफ)',
        labelHindi: '⛅ पहला हाफ (First Half)',
        icon: '⛅',
        dtmfKey: '2',
        actionPayload: 'FLOW_ABSENT_CONFIRM_SL_HALF1',
      },
      {
        id: 'dur_half_2',
        label: '🌙 Second Half (दूसरा हाफ)',
        labelHindi: '🌙 दूसरा हाफ (Second Half)',
        icon: '🌙',
        dtmfKey: '3',
        actionPayload: 'FLOW_ABSENT_CONFIRM_SL_HALF2',
      },
    ],
  },

  FLOW_ABSENT_DURATION_CL: {
    id: 'FLOW_ABSENT_DURATION_CL',
    agentPromptHindi:
      'आपने *कैजुअल लीव (CL)* चुनी है।\n\nकृपया अवधि चुनें:',
    agentPromptEnglish:
      'You selected *Casual Leave (CL)*.\n\nPlease select duration:',
    voiceScriptHindi:
      'कैजुअल लीव के लिए, पूरे दिन हेतु 1 दबाएं। फर्स्ट हाफ के लिए 2 दबाएं। सेकंड हाफ के लिए 3 दबाएं।',
    voiceScriptEnglish:
      'For Casual Leave, press 1 for Full Day. Press 2 for First Half. Press 3 for Second Half.',
    options: [
      {
        id: 'dur_cl_full',
        label: '☀️ Full Day Leave (पूरा दिन)',
        labelHindi: '☀️ पूरा दिन (Full Day)',
        icon: '☀️',
        dtmfKey: '1',
        actionPayload: 'FLOW_ABSENT_CONFIRM_CL_FULL',
      },
      {
        id: 'dur_cl_half1',
        label: '⛅ First Half (पहला हाफ)',
        labelHindi: '⛅ पहला हाफ (First Half)',
        icon: '⛅',
        dtmfKey: '2',
        actionPayload: 'FLOW_ABSENT_CONFIRM_CL_HALF1',
      },
      {
        id: 'dur_cl_half2',
        label: '🌙 Second Half (दूसरा हाफ)',
        labelHindi: '🌙 दूसरा हाफ (Second Half)',
        icon: '🌙',
        dtmfKey: '3',
        actionPayload: 'FLOW_ABSENT_CONFIRM_CL_HALF2',
      },
    ],
  },

  FLOW_ABSENT_DURATION_EL: {
    id: 'FLOW_ABSENT_DURATION_EL',
    agentPromptHindi:
      'आपने *अर्न्ड लीव (EL)* चुनी है।\n\nकृपया अवधि चुनें:',
    agentPromptEnglish:
      'You selected *Earned Leave (EL)*.\n\nPlease select duration:',
    voiceScriptHindi:
      'अर्न्ड लीव के लिए, पूरे दिन हेतु 1 दबाएं। पहले हाफ के लिए 2 दबाएं।',
    voiceScriptEnglish:
      'For Earned Leave, press 1 for Full Day. Press 2 for Half Day.',
    options: [
      {
        id: 'dur_el_full',
        label: '☀️ Full Day Leave (पूरा दिन)',
        labelHindi: '☀️ पूरा दिन (Full Day)',
        icon: '☀️',
        dtmfKey: '1',
        actionPayload: 'FLOW_ABSENT_CONFIRM_EL_FULL',
      },
      {
        id: 'dur_el_half',
        label: '⛅ Half Day Leave (आधा दिन)',
        labelHindi: '⛅ आधा दिन (Half Day)',
        icon: '⛅',
        dtmfKey: '2',
        actionPayload: 'FLOW_ABSENT_CONFIRM_EL_HALF',
      },
    ],
  },

  // Final confirmation of Leave
  FLOW_ABSENT_RESOLVED: {
    id: 'FLOW_ABSENT_RESOLVED',
    agentPromptHindi:
      '✅ *लीव सफलतापूर्वक दर्ज!*\n\nटैलेंट कैरिज HR शेयर्ड सर्विसेज AI एजेंट ने आपकी ओर से {date} के लिए *{leaveType} ({duration})* HRMS में सबमिट कर दिया है।\n\nआपके रिपोर्टिंग मैनेजर *{managerName}* को 1-क्लिक अप्रूवल हेतु व्हाट्सएप अलर्ट भेज दिया गया है।',
    agentPromptEnglish:
      '✅ *Leave Successfully Filed!*\n\nTalent Carriage HR Shared Services AI Agent has applied *{leaveType} ({duration})* for {date} in HRMS on your behalf.\n\nNotification sent to Reporting Manager *{managerName}* for 1-click authorization.',
    voiceScriptHindi:
      'धन्यवाद! आपकी ओर से HRMS में लीव दर्ज कर दी गई है। आपके रिपोर्टिंग मैनेजर {managerName} को अनुमोदन के लिए सूचित कर दिया गया है। आपकी अटेंडेंस सुरक्षित है।',
    voiceScriptEnglish:
      'Thank you! The leave has been submitted into HRMS on your behalf, and your reporting manager {managerName} has been alerted for approval. Have a great day.',
    options: [
      {
        id: 'confirm_ok',
        label: '👍 Thank you, All Good!',
        labelHindi: '👍 धन्यवाद, सब ठीक है!',
        icon: '👍',
        dtmfKey: '1',
        actionPayload: 'FLOW_CLOSE_SATISFIED',
      },
      {
        id: 'confirm_status',
        label: '📄 View Leave Request ID',
        labelHindi: '📄 रिक्वेस्ट आईडी देखें',
        icon: '📄',
        dtmfKey: '2',
        actionPayload: 'FLOW_VIEW_REQUEST_DETAILS',
      },
    ],
    isFinalResolution: true,
    resolutionType: 'leave_applied',
  },

  FLOW_ABSENT_SELF: {
    id: 'FLOW_ABSENT_SELF',
    agentPromptHindi:
      'ठीक है। कृपया आज शाम 6:00 बजे से पहले HRMS पोर्टल (hrms.talentcarriage.com) पर जाकर अपनी छुट्टी का आवेदन अवश्य कर दें, ताकि पेरोल में कटौतियां न हों।\n\nयदि बाद में सहायता चाहिए तो कभी भी यहाँ रिप्लाई कर सकते हैं।',
    agentPromptEnglish:
      'Noted. Please ensure you log into the HRMS portal (hrms.talentcarriage.com) before 6:00 PM today to submit your leave, avoiding any payroll loss.\n\nFeel free to message here if you need any assistance.',
    voiceScriptHindi:
      'ठीक है। कृपया आज शाम तक पोर्टल पर लीव लगा दें। धन्यवाद।',
    voiceScriptEnglish:
      'Noted. Please submit your leave on the portal by this evening. Thank you.',
    options: [
      {
        id: 'self_remind',
        label: '⏰ Remind me in 2 hours',
        labelHindi: '⏰ मुझे 2 घंटे बाद याद दिलाएं',
        icon: '⏰',
        dtmfKey: '1',
        actionPayload: 'FLOW_SET_REMINDER',
      },
      {
        id: 'self_apply_now',
        label: '🔄 Actually, please apply for me',
        labelHindi: '🔄 एजेंट से ही अप्लाई करवाएं',
        icon: '🔄',
        dtmfKey: '2',
        actionPayload: 'FLOW_ABSENT_STEP1',
      },
    ],
    isFinalResolution: true,
  },

  // -------------------------------------------------------------
  // BRANCH 2: WORKING / MISSED PUNCH (Agent asks to regularize timings)
  // -------------------------------------------------------------
  FLOW_WORKING_STEP1: {
    id: 'FLOW_WORKING_STEP1',
    agentPromptHindi:
      'समझ गया! आपका बायोमेट्रिक पंच मिस हुआ है।\n\nक्या मैं आपकी ओर से HRMS में अटेंडेंस रेगुलराइज (Regularize) कर दूँ?\nकृपया अपनी शिफ्ट का समय चुनें:',
    agentPromptEnglish:
      'Got it! Your biometric punch was missed.\n\nCan I regularize your attendance punch in HRMS on your behalf?\nPlease select your shift timings:',
    voiceScriptHindi:
      'आपने मिस्ड पंच चुना है। क्या मैं आपकी ओर से HRMS में पंच रेगुलराइज कर दूँ? जनरल शिफ्ट (सुबह 9:30 से शाम 6:30) के लिए 1 दबाएं। मॉर्निंग शिफ्ट (सुबह 9 से शाम 6) के लिए 2 दबाएं। लेट शिफ्ट (सुबह 10 से शाम 7) के लिए 3 दबाएं। कस्टम समय बोलने के लिए 4 दबाएं।',
    voiceScriptEnglish:
      'You selected missed punch. Should I regularize your attendance in HRMS? For General Shift 9:30 AM to 6:30 PM, press 1. For Morning Shift 9:00 AM to 6:00 PM, press 2. For Late Shift 10:00 AM to 7:00 PM, press 3. To speak custom timings, press 4.',
    options: [
      {
        id: 'shift_gen',
        label: '⏰ General Shift (09:30 AM - 06:30 PM)',
        labelHindi: '⏰ जनरल शिफ्ट (09:30 AM - 06:30 PM)',
        icon: '⏰',
        dtmfKey: '1',
        actionPayload: 'FLOW_PUNCH_REASON_GEN',
      },
      {
        id: 'shift_morn',
        label: '⏰ Morning Shift (09:00 AM - 06:00 PM)',
        labelHindi: '⏰ मॉर्निंग शिफ्ट (09:00 AM - 06:00 PM)',
        icon: '⏰',
        dtmfKey: '2',
        actionPayload: 'FLOW_PUNCH_REASON_MORN',
      },
      {
        id: 'shift_late',
        label: '⏰ Late Shift (10:00 AM - 07:00 PM)',
        labelHindi: '⏰ लेट शिफ्ट (10:00 AM - 07:00 PM)',
        icon: '⏰',
        dtmfKey: '3',
        actionPayload: 'FLOW_PUNCH_REASON_LATE',
      },
      {
        id: 'shift_custom',
        label: '✏️ Custom Timings (कस्टम समय)',
        labelHindi: '✏️ कस्टम समय दर्ज करें',
        icon: '✏️',
        dtmfKey: '4',
        actionPayload: 'FLOW_PUNCH_REASON_CUSTOM',
      },
    ],
  },

  // Reason for Missed Punch step
  FLOW_PUNCH_REASON: {
    id: 'FLOW_PUNCH_REASON',
    agentPromptHindi:
      'नियमितीकरण के लिए पंच मिस होने का कारण (Reason) क्या था?\nकृपया चुनें ताकि तुरंत अनुमोदन मिल सके:',
    agentPromptEnglish:
      'What was the reason for the missed punch?\nPlease select so your manager can authorize instantly:',
    voiceScriptHindi:
      'पंच मिस होने का कारण चुनें: बायोमेट्रिक मशीन समस्या के लिए 1 दबाएं। आईडी कार्ड भूलने के लिए 2 दबाएं। क्लाइंट विजिट या ऑन-ड्यूटी के लिए 3 दबाएं। जल्दबाजी में पंच भूलने के लिए 4 दबाएं।',
    voiceScriptEnglish:
      'Select reason for missed punch: For Biometric machine error, press 1. For Forgot ID Card, press 2. For Client visit or On-Duty, press 3. For Forgot to swipe, press 4.',
    options: [
      {
        id: 'rsn_machine',
        label: '⚙️ Biometric machine error / gate crowd',
        labelHindi: '⚙️ बायोमेट्रिक मशीन में तकनीकी समस्या',
        icon: '⚙️',
        dtmfKey: '1',
        actionPayload: 'FLOW_PUNCH_CONFIRM_MACHINE',
      },
      {
        id: 'rsn_card',
        label: '🪪 Forgot ID Card / Manual Entry at gate',
        labelHindi: '🪪 आईडी कार्ड भूल गया / गेट पर एंट्री की',
        icon: '🪪',
        dtmfKey: '2',
        actionPayload: 'FLOW_PUNCH_CONFIRM_CARD',
      },
      {
        id: 'rsn_client',
        label: '🚗 Client Visit / Direct Field duty',
        labelHindi: '🚗 सीधे क्लाइंट साइट पर था / ऑन-ड्यूटी',
        icon: '🚗',
        dtmfKey: '3',
        actionPayload: 'FLOW_PUNCH_CONFIRM_CLIENT',
      },
      {
        id: 'rsn_forgot',
        label: '🏃‍♂️ In a hurry / Forgot to swipe out',
        labelHindi: '🏃‍♂️ जल्दी में आउट-पंच करना भूल गया',
        icon: '🏃‍♂️',
        dtmfKey: '4',
        actionPayload: 'FLOW_PUNCH_CONFIRM_FORGOT',
      },
    ],
  },

  // Final confirmation of Punch Regularization
  FLOW_PUNCH_RESOLVED: {
    id: 'FLOW_PUNCH_RESOLVED',
    agentPromptHindi:
      '✅ *उपस्थिति नियमितीकरण दर्ज!*\n\nटैलेंट कैरिज HR शेयर्ड सर्विसेज AI एजेंट ने आपकी ओर से {date} के लिए *{inTime} से {outTime}* (कारण: {reason}) HRMS में नियमित कर दिया है।\n\nमैनेजर *{managerName}* को तत्काल व्हाट्सएप ऑथराइजेशन लिंक भेज दिया गया है।',
    agentPromptEnglish:
      '✅ *Attendance Regularized!*\n\nTalent Carriage HR Shared Services AI Agent has regularized your attendance for {date} ({inTime} to {outTime}, Reason: {reason}) directly in HRMS on your behalf.\n\nAuthorization link sent to Manager *{managerName}*.',
    voiceScriptHindi:
      'बधाई हो! आपकी ओर से HRMS में नियमितीकरण सफलतापूर्वक दर्ज कर दिया गया है। आपके मैनेजर {managerName} को 1-क्लिक अप्रूवल भेज दिया गया है। धन्यवाद।',
    voiceScriptEnglish:
      'Great! Attendance regularization has been submitted directly into HRMS on your behalf. Manager {managerName} has received the 1-click authorization link. Thank you.',
    options: [
      {
        id: 'punch_ok',
        label: '👍 All Set, Thank You!',
        labelHindi: '👍 सब ठीक है, धन्यवाद!',
        icon: '👍',
        dtmfKey: '1',
        actionPayload: 'FLOW_CLOSE_SATISFIED',
      },
      {
        id: 'punch_remind_mgr',
        label: '📲 Ping Manager on WhatsApp',
        labelHindi: '📲 मैनेजर को अभी व्हाट्सएप पिंग करें',
        icon: '📲',
        dtmfKey: '2',
        actionPayload: 'FLOW_PING_MANAGER_NOW',
      },
    ],
    isFinalResolution: true,
    resolutionType: 'punch_regularized',
  },

  // -------------------------------------------------------------
  // BRANCH 3: ALREADY APPLIED LEAVE
  // -------------------------------------------------------------
  FLOW_APPLIED_LEAVE_STEP1: {
    id: 'FLOW_APPLIED_LEAVE_STEP1',
    agentPromptHindi:
      'धन्यवाद! आपकी लीव अर्जी की स्थिति क्या है?\nक्या मैनेजर द्वारा इसे अप्रूव कर दिया गया है या पेंडिंग है?',
    agentPromptEnglish:
      'Thank you! What is the current status of your leave application?\nIs it pending manager authorization or already approved?',
    voiceScriptHindi:
      'आपने बताया कि आप लीव लगा चुके हैं। यदि मैनेजर अप्रूवल पेंडिंग है तो 1 दबाएं। यदि पहले ही अप्रूव हो चुका है तो 2 दबाएं। यदि मैनेजर को अर्जेंट रिमाइंडर भेजना है तो 3 दबाएं।',
    voiceScriptEnglish:
      'You mentioned you already applied leave. If manager approval is pending, press 1. If already approved, press 2. To send an urgent reminder to your manager, press 3.',
    options: [
      {
        id: 'app_pending',
        label: '⏳ Manager approval pending',
        labelHindi: '⏳ मैनेजर अप्रूवल पेंडिंग है',
        icon: '⏳',
        dtmfKey: '1',
        actionPayload: 'FLOW_REMIND_MANAGER_CONFIRM',
      },
      {
        id: 'app_approved',
        label: '✅ Manager has already approved',
        labelHindi: '✅ मैनेजर ने अप्रूव कर दिया है',
        icon: '✅',
        dtmfKey: '2',
        actionPayload: 'FLOW_LEAVE_ALREADY_APPROVED',
      },
      {
        id: 'app_remind_now',
        label: '🔔 Send urgent reminder to Manager',
        labelHindi: '🔔 मैनेजर को तुरंत रिमाइंडर भेजो',
        icon: '🔔',
        dtmfKey: '3',
        actionPayload: 'FLOW_REMIND_MANAGER_CONFIRM',
      },
    ],
  },

  // -------------------------------------------------------------
  // BRANCH 4: ALREADY SENT REGULARIZATION
  // -------------------------------------------------------------
  FLOW_REGULARIZATION_STEP1: {
    id: 'FLOW_REGULARIZATION_STEP1',
    agentPromptHindi:
      'शानदार! आपने नियमितीकरण भेजा है।\nक्या आपके रिपोर्टिंग मैनेजर *{managerName}* ने इसे ऑथराइज कर दिया है?',
    agentPromptEnglish:
      'Great! You have sent regularization.\nHas your reporting manager *{managerName}* authorized it in the portal?',
    voiceScriptHindi:
      'नियमितीकरण के लिए: यदि मैनेजर अप्रूवल पेंडिंग है तो 1 दबाएं। यदि अप्रूव हो चुका है तो 2 दबाएं। यदि मैनेजर को फॉलो-अप अलर्ट भेजना है तो 3 दबाएं।',
    voiceScriptEnglish:
      'For regularization: If manager approval is pending, press 1. If already approved, press 2. To send a follow-up alert to your manager, press 3.',
    options: [
      {
        id: 'reg_pending',
        label: '⏳ Pending with Manager',
        labelHindi: '⏳ मैनेजर के पास पेंडिंग है',
        icon: '⏳',
        dtmfKey: '1',
        actionPayload: 'FLOW_REMIND_MANAGER_CONFIRM',
      },
      {
        id: 'reg_approved',
        label: '✅ Approved by Manager',
        labelHindi: '✅ मैनेजर द्वारा स्वीकृत हो गया',
        icon: '✅',
        dtmfKey: '2',
        actionPayload: 'FLOW_REG_ALREADY_APPROVED',
      },
      {
        id: 'reg_ping',
        label: '📲 Urgent Ping to Manager',
        labelHindi: '📲 मैनेजर को तत्काल व्हाट्सएप पिंग',
        icon: '📲',
        dtmfKey: '3',
        actionPayload: 'FLOW_REMIND_MANAGER_CONFIRM',
      },
    ],
  },

  // Manager Reminder Dispatched Confirmation
  FLOW_MANAGER_REMINDER_SENT: {
    id: 'FLOW_MANAGER_REMINDER_SENT',
    agentPromptHindi:
      '🔔 *मैनेजर को रिमाइंडर प्रेषित!*\n\nहमने आपके रिपोर्टिंग मैनेजर *{managerName}* को व्हाट्सएप और सिस्टम नोटिफिकेशन पर प्राथमिकता संदेश भेज दिया है कि वे {date} की आपकी अर्जी तुरंत स्वीकृत करें।\n\nस्वीकृति मिलते ही आपकी उपस्थिति हरी (Present/Approved) हो जाएगी।',
    agentPromptEnglish:
      '🔔 *Manager Reminder Dispatched!*\n\nWe have dispatched a priority alert to your reporting manager *{managerName}* on WhatsApp to authorize your request for {date}.\n\nYour attendance status will turn green upon approval.',
    voiceScriptHindi:
      'आपके मैनेजर {managerName} को आपकी अर्जी स्वीकृत करने के लिए व्हाट्सएप पर प्रायोरिटी रिमाइंडर भेज दिया गया है। धन्यवाद।',
    voiceScriptEnglish:
      'A priority WhatsApp reminder has been sent to manager {managerName} to approve your request. Thank you.',
    options: [
      {
        id: 'mgr_rem_ok',
        label: '👍 Perfect, Thank You',
        labelHindi: '👍 बहुत बढ़िया, धन्यवाद',
        icon: '👍',
        dtmfKey: '1',
        actionPayload: 'FLOW_CLOSE_SATISFIED',
      },
    ],
    isFinalResolution: true,
    resolutionType: 'manager_reminded',
  },

  // Already Approved Confirmation
  FLOW_CASE_VERIFIED: {
    id: 'FLOW_CASE_VERIFIED',
    agentPromptHindi:
      '🎉 *सत्यापित एवं क्लोज!*\n\nHRMS में रिकॉर्ड री-चेक कर लिया गया है। आपकी उपस्थिति {date} के लिए अनुमोदित (Approved) है। कोई आगे की कार्यवाही अपेक्षित नहीं है।',
    agentPromptEnglish:
      '🎉 *Verified & Closed!*\n\nHRMS records re-checked. Your attendance for {date} is verified and authorized. No further action needed.',
    voiceScriptHindi:
      'शानदार! आपकी उपस्थिति HRMS में सत्यापित हो चुकी है। यह केस अब क्लोज किया जा रहा है। आपका दिन शुभ हो!',
    voiceScriptEnglish:
      'Great! Your attendance has been verified in HRMS. This case is now resolved. Have a great day!',
    options: [
      {
        id: 'verified_close',
        label: '👍 Case Resolved',
        labelHindi: '👍 केस क्लोज करें',
        icon: '👍',
        dtmfKey: '1',
        actionPayload: 'FLOW_CLOSE_SATISFIED',
      },
    ],
    isFinalResolution: true,
    resolutionType: 'verified_resolved',
  },
};
