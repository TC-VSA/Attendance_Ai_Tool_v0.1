import {
  Employee,
  CheckInRecord,
  CalendarEvent,
  RegularizationRequest,
  AttendancePolicy,
  LiveActivityFeedItem,
} from '../types';

export const getTodayStr = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getRelativeDateStr = (dayOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_POLICY: AttendancePolicy = {
  standardShiftStart: '09:00',
  standardShiftEnd: '18:00',
  gracePeriodMinutes: 15,
  minFullDayHours: 8,
  minHalfDayHours: 4,
  monthlyRegularizationLimit: 4,
  autoApproveVerifiedCalendarMeetings: true,
};

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@nexuscorp.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    role: 'Principal Staff Engineer',
    department: 'Core Infrastructure',
    isManager: false,
    shiftStart: '09:00',
    shiftEnd: '18:00',
    graceMinutes: 15,
    regularizationsUsedThisMonth: 1,
    regularizationQuota: 4,
  },
  {
    id: 'emp-2',
    name: 'Marcus Vance',
    email: 'marcus.vance@nexuscorp.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    role: 'Enterprise Accounts Director',
    department: 'Strategic Sales',
    isManager: false,
    shiftStart: '09:00',
    shiftEnd: '18:00',
    graceMinutes: 15,
    regularizationsUsedThisMonth: 2,
    regularizationQuota: 4,
  },
  {
    id: 'emp-3',
    name: 'Sarah Chen',
    email: 'sarah.chen@nexuscorp.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    role: 'Lead UX Architect',
    department: 'Product & Design',
    isManager: false,
    shiftStart: '09:00',
    shiftEnd: '18:00',
    graceMinutes: 15,
    regularizationsUsedThisMonth: 0,
    regularizationQuota: 4,
  },
  {
    id: 'emp-4',
    name: 'Liam Patel',
    email: 'liam.patel@nexuscorp.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    role: 'Cloud Security Analyst',
    department: 'DevSecOps',
    isManager: false,
    shiftStart: '09:00',
    shiftEnd: '18:00',
    graceMinutes: 15,
    regularizationsUsedThisMonth: 0,
    regularizationQuota: 4,
  },
  {
    id: 'emp-5',
    name: 'Priya Sharma',
    email: 'priya.sharma@nexuscorp.io',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&auto=format&fit=crop&q=80',
    role: 'VP of Engineering & People Lead',
    department: 'Executive Management',
    isManager: true,
    shiftStart: '09:00',
    shiftEnd: '18:00',
    graceMinutes: 15,
    regularizationsUsedThisMonth: 0,
    regularizationQuota: 6,
  },
];

export const createInitialCalendarEvents = (): CalendarEvent[] => {
  const today = getTodayStr();
  const yesterday = getRelativeDateStr(-1);

  return [
    // Today events for Marcus Vance (has early client meeting explaining late check-in)
    {
      id: 'cal-101',
      employeeId: 'emp-2',
      title: 'Acme Corp Strategic Deal Kickoff',
      description: 'Onsite breakfast meeting with Acme procurement and CISO.',
      startTime: '08:45',
      endTime: '10:30',
      date: today,
      type: 'client_meeting',
      location: 'Acme HQ, 450 Mission St, SF',
      isExternal: true,
      attendees: ['marcus.vance@nexuscorp.io', 'ciso@acme.com', 'vp.eng@acme.com'],
      source: 'google_calendar',
    },
    {
      id: 'cal-102',
      employeeId: 'emp-2',
      title: 'Global Pipeline Review',
      description: 'Weekly enterprise revenue status check.',
      startTime: '14:00',
      endTime: '15:00',
      date: today,
      type: 'internal_meeting',
      location: 'Zoom / Boardroom B',
      isExternal: false,
      attendees: ['marcus.vance@nexuscorp.io', 'priya.sharma@nexuscorp.io'],
      source: 'google_calendar',
    },

    // Today events for Elena Rostova
    {
      id: 'cal-103',
      employeeId: 'emp-1',
      title: 'Q3 Distributed Database War Room',
      description: 'High-availability failover validation in staging cluster.',
      startTime: '10:00',
      endTime: '11:30',
      date: today,
      type: 'internal_meeting',
      location: 'War Room 402',
      isExternal: false,
      attendees: ['elena.rostova@nexuscorp.io', 'liam.patel@nexuscorp.io'],
      source: 'synced_feed',
    },
    {
      id: 'cal-104',
      employeeId: 'emp-1',
      title: 'Architecture Review with Cloudflare Partner',
      description: 'Edge worker caching topology deep dive.',
      startTime: '16:00',
      endTime: '17:15',
      date: today,
      type: 'client_meeting',
      location: 'Google Meet',
      isExternal: true,
      attendees: ['elena.rostova@nexuscorp.io', 'arch@cloudflare.partner'],
      source: 'google_calendar',
    },

    // Today events for Sarah Chen
    {
      id: 'cal-105',
      employeeId: 'emp-3',
      title: 'Design Critique & Figma Walkthrough',
      description: 'Reviewing component library v3 token parity.',
      startTime: '11:00',
      endTime: '12:00',
      date: today,
      type: 'internal_meeting',
      location: 'Design Studio 3A',
      isExternal: false,
      attendees: ['sarah.chen@nexuscorp.io'],
      source: 'synced_feed',
    },

    // Yesterday events for Liam Patel (had offsite data center audit)
    {
      id: 'cal-106',
      employeeId: 'emp-4',
      title: 'Equinix SV5 Colocation Compliance Audit',
      description: 'Physical cage biometric inspection and hardware audit.',
      startTime: '08:30',
      endTime: '12:00',
      date: yesterday,
      type: 'offsite',
      location: 'Equinix SV5, San Jose, CA',
      isExternal: true,
      attendees: ['liam.patel@nexuscorp.io', 'auditor@equinix.com'],
      source: 'google_calendar',
    },
  ];
};

export const createInitialCheckInRecords = (): CheckInRecord[] => {
  const today = getTodayStr();
  const yesterday = getRelativeDateStr(-1);

  return [
    // Elena Rostova - Checked in today on time, currently working
    {
      id: 'rec-1',
      employeeId: 'emp-1',
      date: today,
      checkInTime: '08:52:10',
      workMode: 'office',
      locationName: 'HQ San Francisco - Floor 7',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      breaks: [
        {
          id: 'brk-1',
          type: 'coffee',
          startTime: '10:45:00',
          endTime: '11:00:00',
          durationMinutes: 15,
        },
      ],
      totalWorkMinutes: 240,
      totalBreakMinutes: 15,
      regularityStatus: 'compliant',
      flags: ['Punctual check-in', 'Office Badge Validated'],
      notes: 'Hardware lab benchmarking session',
    },

    // Marcus Vance - Checked in late today (10:45 AM) because of Acme Corp meeting (08:45 - 10:30 AM)
    // Irregular -> Perfect candidate for 1-Click Regularization!
    {
      id: 'rec-2',
      employeeId: 'emp-2',
      date: today,
      checkInTime: '10:45:20',
      workMode: 'client_site',
      locationName: 'Acme Corp HQ - Mission St',
      coordinates: { lat: 37.7891, lng: -122.4014 },
      breaks: [],
      totalWorkMinutes: 135,
      totalBreakMinutes: 0,
      regularityStatus: 'irregular',
      flags: [
        'Late check-in by 90 minutes',
        'Matches Calendar Event: "Acme Corp Strategic Deal Kickoff" (08:45 - 10:30)',
      ],
      notes: 'Direct transit from client meeting to office',
    },

    // Sarah Chen - Checked in on time, remote today
    {
      id: 'rec-3',
      employeeId: 'emp-3',
      date: today,
      checkInTime: '09:04:15',
      workMode: 'remote',
      locationName: 'Remote Workstation - Berkeley, CA',
      coordinates: { lat: 37.8715, lng: -122.2730 },
      breaks: [],
      totalWorkMinutes: 220,
      totalBreakMinutes: 0,
      regularityStatus: 'compliant',
      flags: ['Approved Remote Day', 'Punctual (within 15m grace)'],
    },

    // Liam Patel - Checked in on-duty, currently on break
    {
      id: 'rec-4',
      employeeId: 'emp-4',
      date: today,
      checkInTime: '09:08:00',
      workMode: 'office',
      locationName: 'HQ San Francisco - SOC Room',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      breaks: [
        {
          id: 'brk-2',
          type: 'lunch',
          startTime: '12:30:00',
          durationMinutes: 0, // Currently on break!
        },
      ],
      totalWorkMinutes: 200,
      totalBreakMinutes: 25,
      regularityStatus: 'compliant',
      flags: ['Active Lunch Break'],
    },

    // Priya Sharma (Manager) - Checked in early today
    {
      id: 'rec-5',
      employeeId: 'emp-5',
      date: today,
      checkInTime: '08:35:00',
      workMode: 'office',
      locationName: 'Executive Suite - Floor 12',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      breaks: [],
      totalWorkMinutes: 260,
      totalBreakMinutes: 0,
      regularityStatus: 'compliant',
      flags: ['Executive check-in'],
    },

    // Yesterday's record for Elena Rostova - Regularized after review
    {
      id: 'rec-6',
      employeeId: 'emp-1',
      date: yesterday,
      checkInTime: '10:15:00',
      checkOutTime: '19:45:00',
      workMode: 'office',
      locationName: 'HQ San Francisco',
      breaks: [
        {
          id: 'brk-old-1',
          type: 'lunch',
          startTime: '13:00:00',
          endTime: '13:45:00',
          durationMinutes: 45,
        },
      ],
      totalWorkMinutes: 525,
      totalBreakMinutes: 45,
      regularityStatus: 'regularized',
      flags: ['Regularized: Late start due to critical 03:00 AM server outage incident'],
      regularizationId: 'reg-001',
    },

    // Yesterday's record for Liam Patel - Missed morning punch due to offsite audit
    {
      id: 'rec-7',
      employeeId: 'emp-4',
      date: yesterday,
      checkInTime: '12:15:00',
      checkOutTime: '18:30:00',
      workMode: 'on_duty',
      locationName: 'Equinix SV5 Colocation',
      breaks: [],
      totalWorkMinutes: 375,
      totalBreakMinutes: 0,
      regularityStatus: 'review_required',
      flags: [
        'Pending Regularization Approval',
        'Calendar Event: Equinix SV5 Colocation Compliance Audit (08:30 - 12:00)',
      ],
      regularizationId: 'reg-002',
    },
  ];
};

export const createInitialRegularizations = (): RegularizationRequest[] => {
  const yesterday = getRelativeDateStr(-1);

  return [
    {
      id: 'reg-001',
      employeeId: 'emp-1',
      employeeName: 'Elena Rostova',
      employeeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
      date: yesterday,
      originalCheckIn: '10:15',
      originalCheckOut: '19:45',
      requestedCheckIn: '09:00',
      requestedCheckOut: '19:45',
      reasonCategory: 'onsite_duty',
      explanation: 'Compensatory delayed arrival approved by VP due to midnight P0 database migration incident from 01:30 to 04:00 AM.',
      status: 'approved',
      submittedAt: `${yesterday} 10:20:00`,
      reviewedAt: `${yesterday} 14:15:00`,
      reviewedBy: 'Priya Sharma',
      reviewerNotes: 'Verified with P0 incident postmortem ticket #INC-8921. Full day accredited.',
    },
    {
      id: 'reg-002',
      employeeId: 'emp-4',
      employeeName: 'Liam Patel',
      employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
      date: yesterday,
      originalCheckIn: '12:15',
      originalCheckOut: '18:30',
      requestedCheckIn: '08:30',
      requestedCheckOut: '18:30',
      reasonCategory: 'client_meeting',
      linkedCalendarEventId: 'cal-106',
      linkedCalendarEventTitle: 'Equinix SV5 Colocation Compliance Audit',
      calendarProofSnippet: 'Calendar Event: Equinix SV5 Audit (08:30 - 12:00) with external auditor compliance sign-off.',
      explanation: 'Was directly on site at the San Jose data center starting at 08:30 AM before entering HQ at noon. Calendar invite attached.',
      status: 'pending',
      submittedAt: `${yesterday} 18:35:00`,
    },
  ];
};

export const createInitialLiveActivity = (): LiveActivityFeedItem[] => {
  return [
    {
      id: 'act-1',
      employeeId: 'emp-2',
      employeeName: 'Marcus Vance',
      employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      action: 'check_in',
      timestamp: '10:45 AM',
      workMode: 'client_site',
      details: 'Checked in at Acme Corp HQ [Flagged: Late arrival (90m) - Calendar meeting detected]',
    },
    {
      id: 'act-2',
      employeeId: 'emp-4',
      employeeName: 'Liam Patel',
      employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
      action: 'start_break',
      timestamp: '12:30 PM',
      details: 'Started Lunch Break (Estimated: 45 min)',
    },
    {
      id: 'act-3',
      employeeId: 'emp-3',
      employeeName: 'Sarah Chen',
      employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
      action: 'check_in',
      timestamp: '09:04 AM',
      workMode: 'remote',
      details: 'Checked in via Remote Workstation [Compliant]',
    },
    {
      id: 'act-4',
      employeeId: 'emp-1',
      employeeName: 'Elena Rostova',
      employeeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
      action: 'check_in',
      timestamp: '08:52 AM',
      workMode: 'office',
      details: 'Checked in at HQ SF - Floor 7 [Compliant]',
    },
    {
      id: 'act-5',
      employeeId: 'emp-5',
      employeeName: 'Priya Sharma',
      employeeAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&auto=format&fit=crop&q=80',
      action: 'regularize_approved',
      timestamp: 'Yesterday 02:15 PM',
      details: 'Approved attendance regularization for Elena Rostova (Incident duty)',
    },
  ];
};
