"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Minimal typings: the Web Speech API is not in TypeScript's default DOM lib */
interface ResultLike {
  0: { transcript: string };
  isFinal: boolean;
}
interface RecognitionEventLike {
  results: ArrayLike<ResultLike>;
}
interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: RecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionCtor = new () => RecognitionLike;

const getCtor = (): RecognitionCtor | null => {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

const ERRORS: Record<string, string> = {
  "not-allowed": "Microphone access is blocked. Allow it in your browser settings.",
  "service-not-allowed": "Microphone access is blocked. Allow it in your browser settings.",
  "audio-capture": "No microphone found.",
  network: "Voice input needs an internet connection.",
};

export interface UseSpeechToTextOptions {
  /** BCP 47 language tag, e.g. "en-IN", "en-US", "hi-IN" */
  lang?: string;
  /**
   * Called on every update with the full transcript of the current session
   * (final + interim words), not just the new part.
   */
  onTranscript: (text: string) => void;
}

export function useSpeechToText({ lang = "en-IN", onTranscript }: UseSpeechToTextOptions) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recRef = useRef<RecognitionLike | null>(null);
  const cbRef = useRef(onTranscript);

  useEffect(() => {
    cbRef.current = onTranscript;
  }, [onTranscript]);

  // Checked after mount so server and client markup match
  useEffect(() => {
    setSupported(getCtor() !== null);
    return () => recRef.current?.abort();
  }, []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor || recRef.current) return;

    setError(null);
    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      cbRef.current(text.trim());
    };
    rec.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      setError(ERRORS[e.error] ?? "Voice input failed. Try again.");
    };
    rec.onend = () => {
      recRef.current = null;
      setListening(false);
    };

    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      recRef.current = null;
    }
  }, [lang]);

  /** Stop and keep the words captured so far (lets the last result arrive) */
  const stop = useCallback(() => recRef.current?.stop(), []);

  /** Stop immediately and discard anything still pending */
  const abort = useCallback(() => recRef.current?.abort(), []);

  return { supported, listening, error, start, stop, abort };
}