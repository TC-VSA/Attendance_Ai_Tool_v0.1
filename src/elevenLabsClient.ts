export interface ElevenLabsVoice {
  id: string;
  name: string;
  category: string;
  description: string;
  accent: string;
  gender: string;
  language?: string;
  recommendedFor: string;
}

export interface ElevenLabsConfigResponse {
  configured: boolean;
  defaultVoiceId: string;
  voices: ElevenLabsVoice[];
}

let currentAudio: HTMLAudioElement | null = null;

export async function fetchElevenLabsVoices(): Promise<ElevenLabsConfigResponse> {
  try {
    const res = await fetch('/api/elevenlabs/voices');
    if (!res.ok) {
      throw new Error(`Failed to fetch voices: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('Could not load ElevenLabs voices from backend:', err);
    return {
      configured: false,
      defaultVoiceId: 'g5CIjZEefAph4nQFvHAz',
      voices: [
        {
          id: 'g5CIjZEefAph4nQFvHAz',
          name: 'Kabir (Hindi Male - Default)',
          category: 'premade',
          description: 'Formal, courteous Hindi male HR specialist tone',
          accent: 'Indian / Hindi',
          gender: 'male',
          language: 'Hindi',
          recommendedFor: 'Default Automated Hindi Escalation Calls',
        },
        {
          id: 'JBFqnCBsd6RMkjVDRZzb',
          name: 'Rohan (Indian English Male - Default)',
          category: 'premade',
          description: 'Typical natural Indian male accent speaking fluent corporate English',
          accent: 'Indian English',
          gender: 'male',
          language: 'English (Indian Accent)',
          recommendedFor: 'Default English Calls & "#" Key English Switch',
        },
        {
          id: 'onwK4e9ZLuTAKqWW03F9',
          name: 'Vikram (Indian English Male)',
          category: 'premade',
          description: 'Professional Indian male tone with clear Indian corporate cadence',
          accent: 'Indian English',
          gender: 'male',
          language: 'English (Indian Accent)',
          recommendedFor: 'English Corporate Follow-Up Calls',
        },
        {
          id: 's5aK934V462dE7L7kO62',
          name: 'Aditya (Indian Male - Bilingual)',
          category: 'premade',
          description: 'Warm, authentic Indian male voice for both Hindi & English',
          accent: 'Indian (Bilingual)',
          gender: 'male',
          language: 'Hindi / English',
          recommendedFor: 'Bilingual Escalation Desk',
        },
        {
          id: '21m00Tcm4TlvDq8ikWAM',
          name: 'Rachel (International Female)',
          category: 'premade',
          description: 'Calm, professional neutral HR specialist tone',
          accent: 'American',
          gender: 'female',
          language: 'English',
          recommendedFor: 'International English Backup',
        },
        {
          id: 'pNInz6obpgDQGcFmaJgB',
          name: 'Adam (International Male)',
          category: 'premade',
          description: 'Deep, clear formal executive narration',
          accent: 'American',
          gender: 'male',
          language: 'English',
          recommendedFor: 'International English Executive',
        },
      ],
    };
  }
}

export async function playAttendanceVoice(
  text: string,
  voiceId: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): Promise<{ source: 'elevenlabs' | 'browser-fallback' }> {
  // Stop any ongoing audio
  stopAttendanceVoice();

  try {
    const res = await fetch('/api/elevenlabs/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voiceId }),
    });

    if (res.ok) {
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      currentAudio = audio;

      audio.onplay = () => {
        if (onStart) onStart();
      };

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = (e) => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        console.warn('ElevenLabs audio element playback error, falling back to speech synthesis', e);
        fallbackToBrowserSpeech(text, onStart, onEnd, onError);
      };

      await audio.play();
      return { source: 'elevenlabs' };
    } else {
      console.warn('ElevenLabs API returned non-200. Using browser speech synthesis fallback.');
      fallbackToBrowserSpeech(text, onStart, onEnd, onError);
      return { source: 'browser-fallback' };
    }
  } catch (error) {
    console.warn('ElevenLabs speech generation request failed:', error);
    fallbackToBrowserSpeech(text, onStart, onEnd, onError);
    return { source: 'browser-fallback' };
  }
}

export function stopAttendanceVoice() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function fallbackToBrowserSpeech(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
) {
  if (!('speechSynthesis' in window)) {
    if (onError) onError(new Error('Speech synthesis not supported in this browser.'));
    return;
  }

  const isHindi = /[\u0900-\u097F]/.test(text) || text.includes('नमस्ते');

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();

  if (isHindi) {
    utterance.lang = 'hi-IN';
    const hindiVoice = voices.find(
      (v) =>
        (v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')) &&
        (v.name.toLowerCase().includes('male') || !v.name.toLowerCase().includes('female'))
    ) || voices.find((v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'));

    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
  } else {
    // English: Default to typical Indian English male voice (en-IN)
    utterance.lang = 'en-IN';
    const indianEnglishMaleVoice = voices.find(
      (v) =>
        (v.lang === 'en-IN' || v.lang === 'en_IN' || v.name.toLowerCase().includes('india')) &&
        (v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('rishi') ||
          v.name.toLowerCase().includes('ravi') ||
          !v.name.toLowerCase().includes('female'))
    ) || voices.find(
      (v) =>
        v.lang === 'en-IN' ||
        v.lang === 'en_IN' ||
        v.name.toLowerCase().includes('rishi') ||
        v.name.toLowerCase().includes('ravi')
    ) || voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Daniel'))
    );

    if (indianEnglishMaleVoice) {
      utterance.voice = indianEnglishMaleVoice;
    }
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('SpeechSynthesis error:', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}
