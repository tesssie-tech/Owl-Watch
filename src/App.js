import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

const DEFAULT_SECONDS = 25 * 60;

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 0 ? fallback : parsed;
}

function toClock(totalSeconds) {
  const safeValue = Math.max(0, totalSeconds);
  const minutes = String(Math.floor(safeValue / 60)).padStart(2, '0');
  const seconds = String(safeValue % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const initialMinutes = parsePositiveInt(params.get('m'), 25);
  const initialSeconds = parsePositiveInt(params.get('s'), 0);
  const initialLabel = params.get('label') || 'Cozy Focus';
  const isEmbedMode = params.get('embed') === '1';

  const [label, setLabel] = useState(initialLabel);
  const [minutesInput, setMinutesInput] = useState(initialMinutes);
  const [secondsInput, setSecondsInput] = useState(initialSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialMinutes * 60 + initialSeconds || DEFAULT_SECONDS
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [copied, setCopied] = useState(false);

  const dingRef = useRef(null);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(intervalId);
          setIsRunning(false);
          setIsFinished(true);

          if (dingRef.current) {
            dingRef.current.currentTime = 0;
            dingRef.current.play().catch(() => {});
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleApplyTime = () => {
    const nextTotal = minutesInput * 60 + secondsInput;
    setRemainingSeconds(nextTotal > 0 ? nextTotal : DEFAULT_SECONDS);
    setIsRunning(false);
    setIsFinished(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setRemainingSeconds(minutesInput * 60 + secondsInput || DEFAULT_SECONDS);
  };

  const handleCopyNotionLink = async () => {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const query = new URLSearchParams({
      embed: '1',
      m: String(minutesInput),
      s: String(secondsInput),
      label,
    });

    try {
      await navigator.clipboard.writeText(`${baseUrl}?${query.toString()}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`app-shell ${isEmbedMode ? 'embed' : ''}`}>
      <main className="timer-card" role="main" aria-label="Notion timer app">
        <p className="badge">owl watch</p>
        <h1>{label}</h1>

        <p className={`clock ${isFinished ? 'finished' : ''}`} aria-live="polite">
          {toClock(remainingSeconds)}
        </p>

        <div className="row actions">
          <button type="button" onClick={() => setIsRunning((value) => !value)}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button type="button" onClick={handleReset} className="soft-button">
            Reset
          </button>
        </div>

        {!isEmbedMode && (
          <>
            <div className="inputs">
              <label htmlFor="label">Label</label>
              <input
                id="label"
                value={label}
                maxLength={24}
                onChange={(event) => setLabel(event.target.value || 'Cozy Focus')}
              />

              <div className="grid-two">
                <div>
                  <label htmlFor="minutes">Minutes</label>
                  <input
                    id="minutes"
                    type="number"
                    min="0"
                    max="180"
                    value={minutesInput}
                    onChange={(event) => setMinutesInput(parsePositiveInt(event.target.value, 0))}
                  />
                </div>

                <div>
                  <label htmlFor="seconds">Seconds</label>
                  <input
                    id="seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={secondsInput}
                    onChange={(event) => {
                      const nextValue = parsePositiveInt(event.target.value, 0);
                      setSecondsInput(Math.min(59, nextValue));
                    }}
                  />
                </div>
              </div>

              <div className="row setup-actions">
                <button type="button" onClick={handleApplyTime} className="soft-button">
                  Apply time
                </button>
                <button type="button" onClick={handleCopyNotionLink} className="soft-button">
                  {copied ? 'Copied' : 'Copy Notion link'}
                </button>
              </div>
            </div>
            <p className="hint">Paste the copied link into a Notion embed block.</p>
          </>
        )}

        {isFinished && <p className="done-note">Session complete. Nice work.</p>}

        <audio
          ref={dingRef}
          preload="none"
          src="data:audio/wav;base64,UklGRmYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YUIAAACAaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWk="
        />
      </main>
    </div>
  );
}

export default App;
