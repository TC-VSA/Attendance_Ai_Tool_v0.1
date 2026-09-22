export interface PlivoCallResponse {
  success: boolean;
  callUuid: string;
  status: 'initiated' | 'failed';
  callerId: string;
  mode: 'plivo-live' | 'plivo-simulated';
  message?: string;
  plivoResponse?: any;
}

export interface PlivoStatusResponse {
  configured: boolean;
  phoneNumber: string;
  authIdPrefix: string | null;
  provider: string;
}

export async function getPlivoStatus(): Promise<PlivoStatusResponse> {
  try {
    const res = await fetch('/api/plivo/status');
    if (!res.ok) throw new Error(`Status check returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Could not fetch Plivo status:', err);
    return {
      configured: false,
      phoneNumber: '+919876543210',
      authIdPrefix: null,
      provider: 'Plivo Telephony API',
    };
  }
}

export async function initiatePlivoCall(params: {
  to: string;
  caseId: string;
  employeeName: string;
  date: string;
  language?: 'hindi' | 'english';
  customCallerId?: string;
}): Promise<PlivoCallResponse> {
  try {
    const res = await fetch('/api/plivo/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn('Plivo call API error, falling back to simulated session:', err);
    return {
      success: true,
      callUuid: `plivo-sim-${Date.now()}`,
      status: 'initiated',
      callerId: params.customCallerId || '+919876543210',
      mode: 'plivo-simulated',
      message: `Plivo call simulated from virtual number ${params.customCallerId || '+919876543210'} to ${params.employeeName}`,
    };
  }
}

export async function initiatePlivoManagerCall(params: {
  to: string;
  caseId: string;
  employeeName: string;
  managerName: string;
  date: string;
  language?: 'hindi' | 'english';
  customCallerId?: string;
}): Promise<PlivoCallResponse> {
  try {
    const res = await fetch('/api/plivo/manager-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn('Plivo manager call API error, falling back to simulated session:', err);
    return {
      success: true,
      callUuid: `plivo-mgr-sim-${Date.now()}`,
      status: 'initiated',
      callerId: params.customCallerId || '+919876543210',
      mode: 'plivo-simulated',
      message: `Plivo call simulated to manager ${params.managerName} from ${params.customCallerId || '+919876543210'}`,
    };
  }
}
