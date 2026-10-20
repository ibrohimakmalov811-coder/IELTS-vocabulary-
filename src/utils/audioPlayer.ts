export interface AudioPlayOptions {
  accent?: "US" | "UK";
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: Error) => void;
}

class AudioPlayerService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private activeWord: string | null = null;

  public playWord(word: string, options: AudioPlayOptions = {}): boolean {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (options.onError) {
        options.onError(new Error("Text-to-speech is not supported in this browser."));
      }
      return false;
    }

    try {
      // 1. Immediately cancel any speech already playing to avoid overlap
      window.speechSynthesis.cancel();

      const langCode = options.accent === "UK" ? "en-GB" : "en-US";
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = langCode;
      utterance.rate = options.rate || 0.88; // comfortable, clear IELTS pacing
      utterance.pitch = options.pitch || 1.0;

      // Try selecting a native English voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const matchingVoice = voices.find(
          (v) => v.lang.startsWith(langCode.substring(0, 2)) && v.name.toLowerCase().includes("natural")
        ) || voices.find((v) => v.lang.startsWith(langCode.substring(0, 2)));

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onstart = () => {
        this.activeWord = word;
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        this.activeWord = null;
        this.currentUtterance = null;
        if (options.onEnd) options.onEnd();
      };

      utterance.onerror = (event) => {
        this.activeWord = null;
        this.currentUtterance = null;
        // Interrupted events happen normally when user clicks another word
        if (event.error !== "interrupted" && options.onError) {
          options.onError(new Error(`Speech synthesis error: ${event.error}`));
        }
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      if (options.onError) options.onError(e as Error);
      return false;
    }
  }

  public stop(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
      this.activeWord = null;
    }
  }

  public getActiveWord(): string | null {
    return this.activeWord;
  }
}

export const audioPlayer = new AudioPlayerService();
