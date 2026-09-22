import * as XLSX from 'xlsx';
import { FollowUpCase } from '../types';
import { WORKFLOW_TEMPLATES } from '../data/followUpData';

const DAY_COL_RE = /^\s*(\d{1,2})\s*\/\s*(\d{1,2})\s*\|/;

function formatDate(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
}

export interface ParseExcelResult {
  cases: FollowUpCase[];
  totalRows: number;
  totalAbsentsFound: number;
  sheetName: string;
  yearDetected: number;
}

export async function parseTimeOfficeWorkbook(
  file: File,
  testPhoneOverride?: string
): Promise<ParseExcelResult> {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  const wb = XLSX.read(data, { type: 'array' });

  let year = new Date().getFullYear();
  const filterSheetName = wb.SheetNames.find((n) => /filter/i.test(n));
  if (filterSheetName) {
    const frows = XLSX.utils.sheet_to_json(wb.Sheets[filterSheetName], { header: 1 });
    const m = /(\d{2})-(\d{2})-(\d{4})/.exec(JSON.stringify(frows));
    if (m) year = parseInt(m[3], 10);
  }

  const sheetName = wb.SheetNames.find((n) => /attendance/i.test(n)) || wb.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(wb.Sheets[sheetName], { defval: null });

  const dayCols: { col: string; date: Date }[] = [];
  if (rows.length > 0) {
    Object.keys(rows[0]).forEach((col) => {
      const m = DAY_COL_RE.exec(String(col));
      if (m) {
        const day = parseInt(m[1], 10);
        const month = parseInt(m[2], 10) - 1;
        dayCols.push({ col, date: new Date(year, month, day) });
      }
    });
  }

  const builtCases: FollowUpCase[] = [];
  let caseCounter = 1;

  rows.forEach((row) => {
    const name = row['Full name'] || row['Employee Name'] || row['Name'];
    if (!name) return;

    const code = String(row['Employee Code'] || row['Emp Code'] || `TC-${caseCounter}`);
    const dept = row['Department'] || 'General Operations';
    const manager = row['Reporting manager'] || row['Manager'] || 'HR Lead';
    const mobileRaw = String(row['Mobile number'] || row['Mobile'] || testPhoneOverride || '919876543210');
    const mobileNumber = mobileRaw.replace(/\D/g, '');

    dayCols.forEach(({ col, date }) => {
      const raw = row[col];
      if (!raw) return;

      const parts = String(raw).split('|');
      const fn = (parts[0] || '').trim().toUpperCase();
      const an = (parts[1] || parts[0] || '').trim().toUpperCase();

      if (fn === 'A' || an === 'A') {
        const dateStr = formatDate(date);
        const sessionCode = `${fn}|${an}`;
        const newId = `imported-${caseCounter++}-${Date.now() % 10000}`;

        builtCases.push({
          id: newId,
          employeeName: String(name),
          employeeCode: code,
          department: String(dept),
          reportingManager: String(manager),
          mobileNumber: mobileNumber || '919876543210',
          date: dateStr,
          code: sessionCode,
          reply: 'Waiting',
          action: 'Pending response',
          status: 'waiting',
          stage: 'stage_1_initial',
          firstMessageSentAt: `${dateStr} 10:00`,
          messages: [
            {
              id: `msg-${newId}-1`,
              sender: 'system',
              text: WORKFLOW_TEMPLATES.firstMessage(String(name), dateStr, sessionCode),
              timestamp: '10:00 AM',
              status: 'delivered',
              isTemplate: true,
              buttons: WORKFLOW_TEMPLATES.options,
            },
          ],
        });
      }
    });
  });

  return {
    cases: builtCases,
    totalRows: rows.length,
    totalAbsentsFound: builtCases.length,
    sheetName,
    yearDetected: year,
  };
}
