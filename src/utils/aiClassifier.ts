export interface ClassificationResult {
  option: 1 | 2 | 3 | 4 | null;
  confidence: number;
  reason: string;
  matchedCategory?: string;
}

export function classifyEmployeeReply(text: string): ClassificationResult {
  const clean = text.trim().toLowerCase();

  // 1. Direct button tap / number matching
  if (/^1\b|\boption\s*1\b|\byes\b.*absent|was\s*absent|unplanned\s*leave|sick|fever|ill|doctor|emergency|family\s*issue|not\s*well|bimar|chutti|holiday/i.test(clean)) {
    return {
      option: 1,
      confidence: 0.96,
      reason: 'Matched Option 1: Confirmed Absent / Sick / Personal Leave',
      matchedCategory: 'Yes, I was absent',
    };
  }

  if (/^2\b|\boption\s*2\b|\bno\b.*working|was\s*working|was\s*in\s*office|wfh|client\s*visit|client\s*meeting|punch\s*missed|biometric\s*failed|fingerprint|card\s*not\s*swipe|forgot\s*to\s*punch|present|kaam\s*pe\s*tha|office\s*me\s*tha/i.test(clean)) {
    return {
      option: 2,
      confidence: 0.95,
      reason: 'Matched Option 2: Was Working / Biometric Miss / On-Duty',
      matchedCategory: 'No, I was working',
    };
  }

  if (/^3\b|\boption\s*3\b|already\s*applied.*leave|applied\s*leave|put\s*leave|leave\s*applied|hrms\s*leave|portal\s*leave|approved\s*leave|pehle\s*se\s*apply/i.test(clean)) {
    return {
      option: 3,
      confidence: 0.97,
      reason: 'Matched Option 3: Already Applied for Leave in HRMS',
      matchedCategory: 'I have already applied leave',
    };
  }

  if (/^4\b|\boption\s*4\b|already\s*sent.*regularization|sent\s*regularization|applied\s*regularization|requested\s*regularization|pending\s*with\s*manager|reg\s*request|sent\s*mail\s*to\s*manager/i.test(clean)) {
    return {
      option: 4,
      confidence: 0.97,
      reason: 'Matched Option 4: Already Sent Regularization Request',
      matchedCategory: 'I have already sent regularization request',
    };
  }

  // Ambiguous / Unclear
  return {
    option: null,
    confidence: 0.2,
    reason: 'Text is ambiguous or contains insufficient details. Needs 1-4 clarification.',
  };
}
