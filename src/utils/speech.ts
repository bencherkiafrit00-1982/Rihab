// Web Speech API for English Audio Playback & Pronunciation Recognition

export type SpeakerPersona = 'nadjib_boy' | 'rehab_girl' | 'neutral';

export function speakEnglish(
  text: string, 
  rate: number = 0.9, 
  persona: SpeakerPersona = 'nadjib_boy'
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // cancel any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();

    if (persona === 'nadjib_boy') {
      // Find male English voice for Nadjib (9-year-old Algerian schoolboy pupil)
      const maleVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        return (
          v.lang.startsWith('en') &&
          (name.includes('david') ||
           name.includes('george') ||
           name.includes('alex') ||
           name.includes('daniel') ||
           name.includes('mark') ||
           name.includes('guy') ||
           name.includes('male') ||
           name.includes('oliver') ||
           name.includes('en-us-standard-b') ||
           name.includes('en-us-standard-d') ||
           name.includes('en-gb-standard-b') ||
           name.includes('james'))
        );
      }) || voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('female'));

      if (maleVoice) {
        utterance.voice = maleVoice;
      }

      // Pupil boy voice tuning: male base with youthful, energetic pitch (1.28)
      utterance.pitch = 1.28;
      utterance.rate = rate;
    } else if (persona === 'rehab_girl') {
      // Find female English voice for Rehab (cheerful schoolgirl)
      const femaleVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        return (
          v.lang.startsWith('en') &&
          (name.includes('samantha') ||
           name.includes('victoria') ||
           name.includes('karen') ||
           name.includes('zira') ||
           name.includes('jenny') ||
           name.includes('female') ||
           name.includes('en-us-standard-c') ||
           name.includes('en-us-standard-e'))
        );
      }) || voices.find(v => v.lang.startsWith('en'));

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      // Girl voice tuning: sweet, bright, friendly
      utterance.pitch = 1.2;
      utterance.rate = rate;
    } else {
      // Neutral default
      utterance.pitch = 1.1;
      utterance.rate = rate;
      const genericVoice = voices.find(v => v.lang.startsWith('en'));
      if (genericVoice) utterance.voice = genericVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export interface SpeechRecognitionResult {
  transcript: string;
  isCorrect: boolean;
  score: number; // 0 to 100
}

export function startSpeechRecognition(
  expectedPhrase: string,
  onResult: (result: SpeechRecognitionResult) => void,
  onError: (err: string) => void
): { stop: () => void } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRec) {
    onError('المتصفح الحالي لا يدعم التعرف الصوتي المباشر. يمكنك الاستمرار بالضغط على تقييم نطقك!');
    return { stop: () => {} };
  }

  try {
    const recognition = new SpeechRec();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript.toLowerCase().trim();
      const targetClean = expectedPhrase.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      const spokenClean = spokenText.replace(/[^a-z0-9\s]/g, '').trim();

      // Simple similarity match
      const exactMatch = spokenClean === targetClean;
      const partialMatch = spokenClean.includes(targetClean) || targetClean.includes(spokenClean);
      
      let score = 0;
      if (exactMatch) score = 100;
      else if (partialMatch) score = 85;
      else {
        // Levenshtein-ish or word overlap
        const expectedWords = targetClean.split(/\s+/);
        const spokenWords = spokenClean.split(/\s+/);
        const matchedWords = expectedWords.filter(w => spokenWords.includes(w));
        score = Math.round((matchedWords.length / expectedWords.length) * 80);
      }

      onResult({
        transcript: spokenText,
        isCorrect: score >= 60,
        score: Math.max(score, 50),
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (e: any) => {
      onError(`لم نتمكن من التقاط الصوت: ${e.error || 'خطأ غير متوقع'}`);
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      }
    };
  } catch (err) {
    onError('حدث خطأ في تشغيل الميكروفون');
    return { stop: () => {} };
  }
}
