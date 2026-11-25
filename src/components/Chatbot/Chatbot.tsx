"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./ChatBot.module.scss";
import { useSpeechToText } from "../../utils/useSpeachToText";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  /** Plain text, or any React node (product cards, markdown, etc.) */
  content: ReactNode;
  /** Plain-text version used by the copy button when `content` is rich */
  copyText?: string;
}

export type ChatStatus = "ready" | "submitted" | "streaming" | "error";

export interface ChatBotProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  /** Matches the `status` returned by the AI SDK's useChat */
  status?: ChatStatus;
  onStop?: () => void;
  onRetry?: () => void;
  error?: string | null;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  /** Heading shown while the conversation is empty */
  greeting?: string;
  /** Tappable prompts shown while the conversation is empty */
  suggestions?: string[];
  /** Small print under the input */
  footnote?: string;
  /** Show the microphone button when the browser supports speech input */
  voice?: boolean;
  /** Speech recognition language (BCP 47), e.g. "en-IN", "en-US", "hi-IN" */
  voiceLang?: string;
  maxLength?: number;
  className?: string;
}

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(" ");

const joinText = (base: string, spoken: string) =>
  base.trim() ? `${base.trimEnd()} ${spoken}` : spoken;

export default function ChatBot({
  messages,
  onSend,
  status = "ready",
  onStop,
  onRetry,
  error,
  title = "Assistant",
  subtitle,
  placeholder = "Ask anything",
  greeting = "Hello. How can I help you today?",
  suggestions = ["I want to buy a shirt for office.","I have dry skin what sunscreen is good for me?"],
  footnote = "AI can make mistakes. Check important info.",
  voice = true,
  voiceLang = "en-IN",
  maxLength = 2000,
  className,
}: ChatBotProps) {
  const [draft, setDraft] = useState("");
  const [atBottom, setAtBottom] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stickRef = useRef(true);
  const baseRef = useRef(""); // text already typed when the mic was started
  const inputId = useId();

  const speech = useSpeechToText({
    lang: voiceLang,
    onTranscript: (spoken) =>
      setDraft(joinText(baseRef.current, spoken).slice(0, maxLength)),
  });

  const busy = status === "submitted" || status === "streaming";
  const canSend = draft.trim().length > 0 && !busy;
  const isEmpty = messages.length === 0;
  const showMic = voice && speech.supported;

  /* Auto-grow the textarea up to a max height */
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [draft]);

  /* Keep the latest message in view, unless the reader scrolled up */
  useEffect(() => {
    const el = scrollerRef.current;
    if (el && stickRef.current) el.scrollTo({ top: el.scrollHeight });
  }, [messages, status]);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    stickRef.current = near;
    setAtBottom(near);
  };

  const jumpToLatest = () => {
    const el = scrollerRef.current;
    if (!el) return;
    stickRef.current = true;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  const send = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || busy) return;
      speech.abort(); // drop any pending speech so it can't refill the box
      stickRef.current = true;
      onSend(value);
      setDraft("");
    },
    [busy, onSend, speech],
  );

  const toggleMic = () => {
    if (speech.listening) {
      speech.stop();
    } else {
      baseRef.current = draft;
      speech.start();
      textareaRef.current?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(draft);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(draft);
    }
  };

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1600);
    } catch {
      /* clipboard unavailable (insecure context); ignore */
    }
  };

  return (
    <section className={cx(styles.root, className)} aria-label={title}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        <span className={styles.srOnly} role="status">
          {speech.listening ? "Listening" : busy ? "Assistant is responding" : ""}
        </span>
      </header>

      <div className={styles.body}>
        <div
          ref={scrollerRef}
          className={styles.scroller}
          onScroll={handleScroll}
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          aria-label="Conversation"
          tabIndex={0}
        >
          <div className={cx(styles.thread, isEmpty && styles.threadEmpty)}>
            {isEmpty && (
              <div className={styles.empty}>
                <p className={styles.greeting}>{greeting}</p>
              </div>
            )}

            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const isLast = i === messages.length - 1;
              const streaming = !isUser && isLast && status === "streaming";
              const text =
                typeof m.content === "string" ? m.content : (m.copyText ?? null);

              return (
                <article
                  key={m.id}
                  className={cx(styles.message, isUser ? styles.user : styles.assistant)}
                >
                  <span className={styles.srOnly}>
                    {isUser ? "You said:" : `${title} said:`}
                  </span>
                  <div className={cx(styles.content, streaming && styles.streaming)}>
                    {m.content}
                  </div>

                  {!isUser && text && !streaming && (
                    <div className={cx(styles.actions, isLast && styles.actionsVisible)}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => copy(m.id, text)}
                        aria-label={copiedId === m.id ? "Copied" : "Copy response"}
                        title={copiedId === m.id ? "Copied" : "Copy"}
                      >
                        {copiedId === m.id ? (
                          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                            <path
                              d="m4.5 10.5 3.5 3.5 7.5-8"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                            <rect
                              x="7"
                              y="7"
                              width="9"
                              height="9"
                              rx="2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                            <path
                              d="M13 7V5.5A1.5 1.5 0 0 0 11.5 4h-6A1.5 1.5 0 0 0 4 5.5v6A1.5 1.5 0 0 0 5.5 13H7"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}

            {status === "submitted" && (
              <div className={cx(styles.message, styles.assistant)}>
                <span className={styles.srOnly}>{title} is thinking</span>
                <span className={styles.thinking} aria-hidden="true" />
              </div>
            )}

            {(status === "error" || error) && (
              <div className={styles.error} role="alert">
                <span>{error || "Something went wrong. Try again."}</span>
                {onRetry && (
                  <button type="button" onClick={onRetry}>
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {!atBottom && !isEmpty && (
          <button
            type="button"
            className={styles.jump}
            onClick={jumpToLatest}
            aria-label="Jump to latest message"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path
                d="M10 4v11m0 0-4.5-4.5M10 15l4.5-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.dock}>
        {speech.error && (
          <p className={styles.voiceNote} role="alert">
            {speech.error}
          </p>
        )}

        <form className={styles.composer} onSubmit={handleSubmit}>
          <label htmlFor={inputId} className={styles.srOnly}>
            Message
          </label>
          <textarea
            id={inputId}
            ref={textareaRef}
            className={styles.input}
            rows={1}
            value={draft}
            maxLength={maxLength}
            placeholder={speech.listening ? "Listening…" : placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            enterKeyHint="send"
          />

          {showMic && (
            <button
              type="button"
              className={cx(styles.mic, speech.listening && styles.micOn)}
              onClick={toggleMic}
              aria-pressed={speech.listening}
              aria-label={speech.listening ? "Stop voice input" : "Start voice input"}
              title={speech.listening ? "Stop voice input" : "Voice input"}
            >
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <rect
                  x="7.5"
                  y="2.5"
                  width="5"
                  height="9.5"
                  rx="2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          {busy && onStop ? (
            <button
              type="button"
              className={styles.send}
              onClick={onStop}
              aria-label="Stop response"
            >
              <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                <rect x="4" y="4" width="12" height="12" rx="2.5" fill="currentColor" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              className={styles.send}
              disabled={!canSend}
              aria-label="Send message"
            >
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <path
                  d="M10 16V4m0 0L5 9m5-5 5 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </form>

        {isEmpty && suggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className={styles.suggestion}
                  onClick={() => send(s)}
                  disabled={busy}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}

        {footnote && <p className={styles.footnote}>{footnote}</p>}
      </div>
    </section>
  );
}