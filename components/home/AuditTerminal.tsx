"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type LogLine =
  | { kind: "command"; text: string }
  | {
      kind: "check";
      time: string;
      label: string;
      detail: string;
      status: "ok" | "fail";
      note?: string;
    }
  | { kind: "note"; text: string };

/**
 * The audit log from blueprint 2.1, kept as structured data rather than a
 * space-padded block: the columns are rebuilt with layout so the panel can
 * reflow on a narrow screen instead of scrolling sideways.
 */
const LOG_LINES: readonly LogLine[] = [
  { kind: "command", text: '$ hag audit --module=A --property="•••• Hotel & Spa"' },
  {
    kind: "check",
    time: "[14:02:11]",
    label: "check-in",
    detail: "süre: 3dk 40sn",
    status: "ok",
    note: "standart: <4dk",
  },
  {
    kind: "check",
    time: "[14:06:32]",
    label: "bellboy",
    detail: "karşılama süresi 45sn",
    status: "ok",
  },
  {
    kind: "check",
    time: "[14:41:05]",
    label: "oda hijyeni",
    detail: "buklet düzeni",
    status: "fail",
    note: "eksik: 2 kalem",
  },
  {
    kind: "check",
    time: "[19:20:18]",
    label: "f&b",
    detail: "reçete gramajı",
    status: "fail",
    note: "sapma: %11",
  },
  {
    kind: "check",
    time: "[21:05:44]",
    label: "upselling",
    detail: "teklif yapılmadı",
    status: "fail",
    note: "gelir kaybı",
  },
  { kind: "note", text: "> rapor hazırlanıyor... SWOT + ROI analizi" },
  { kind: "note", text: "> tespit edilen aylık gelir kaçağı: ₺ ***.***" },
];

const LINE_INTERVAL_MS = 600;
const HOLD_MS = 2600;
const FADE_MS = 700;

/** Read out as one coherent sentence, since a looping log would otherwise stutter. */
const SCREEN_READER_LABEL =
  "Örnek gizli müşteri denetim logu: check-in ve bellboy standarda uygun; oda hijyeni, reçete gramajı ve upselling kaleminde sapma tespit edildi.";

type Phase = { count: number; fading: boolean };

export function AuditTerminal() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>({ count: 0, fading: false });

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    // One timer per phase step; the effect re-runs on each state change and
    // schedules only the next hop, so unmounting always clears a live timer.
    if (phase.fading) {
      const timer = setTimeout(() => setPhase({ count: 0, fading: false }), FADE_MS);
      return () => clearTimeout(timer);
    }

    if (phase.count < LOG_LINES.length) {
      const timer = setTimeout(
        () => setPhase((current) => ({ ...current, count: current.count + 1 })),
        LINE_INTERVAL_MS,
      );
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => setPhase((current) => ({ ...current, fading: true })), HOLD_MS);
    return () => clearTimeout(timer);
  }, [phase, reduceMotion]);

  const visibleLines = reduceMotion ? LOG_LINES : LOG_LINES.slice(0, phase.count);

  return (
    <div
      role="img"
      aria-label={SCREEN_READER_LABEL}
      className="overflow-hidden rounded-xl2 border border-terminal-ink/10 bg-terminal-bg shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-terminal-ink/10 px-4 py-3">
        {/* Three brass dots rather than the macOS traffic lights — a nod to the star rating. */}
        <span className="h-2.5 w-2.5 rounded-full bg-brass" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-brass/60" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-brass/30" aria-hidden="true" />
        <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.18em] text-terminal-ink/50">
          audit-log
        </span>
      </div>

      <div
        aria-hidden="true"
        className="px-4 py-5 font-mono text-[11px] leading-relaxed text-terminal-ink sm:px-5 sm:text-xs"
      >
        <motion.div
          animate={{ opacity: phase.fading && !reduceMotion ? 0 : 1 }}
          transition={{ duration: reduceMotion ? 0 : FADE_MS / 1000, ease: "easeOut" }}
        >
          {visibleLines.map((line, index) => (
            <LogRow
              key={rowKey(line)}
              line={line}
              animate={!reduceMotion}
              isLast={index === visibleLines.length - 1}
              startsNoteGroup={line.kind === "note" && visibleLines[index - 1]?.kind !== "note"}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function rowKey(line: LogLine): string {
  return line.kind === "check" ? `${line.time}-${line.label}` : line.text;
}

function LogRow({
  line,
  animate,
  isLast,
  startsNoteGroup,
}: {
  line: LogLine;
  animate: boolean;
  isLast: boolean;
  startsNoteGroup: boolean;
}) {
  const content = <LogContent line={line} isLast={isLast} />;
  // Reproduces the blank lines the blueprint's log has around the check block.
  const spacing =
    line.kind === "command" ? "mb-4" : startsNoteGroup ? "mt-4" : line.kind === "note" ? "mt-1" : "";
  const className = ["min-w-0", spacing].filter(Boolean).join(" ");

  if (!animate) {
    return <div className={className}>{content}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  );
}

function LogContent({ line, isLast }: { line: LogLine; isLast: boolean }) {
  if (line.kind === "command") {
    return (
      <p className="break-words text-terminal-ink">
        {line.text}
        {isLast ? <Caret /> : null}
      </p>
    );
  }

  if (line.kind === "note") {
    return (
      <p className="break-words text-terminal-ink/70">
        {line.text}
        {isLast ? <Caret /> : null}
      </p>
    );
  }

  const isOk = line.status === "ok";

  return (
    <p className="flex flex-wrap items-baseline gap-x-3">
      <span className="shrink-0 text-terminal-ink/45">{line.time}</span>
      <span className="shrink-0 sm:w-28">{line.label}</span>
      <span className="text-terminal-ink/75 sm:w-44 sm:shrink-0">{line.detail}</span>
      {/* text-accent is legitimate here: 4.86:1 against the terminal panel. */}
      <span className={isOk ? "text-terminal-ok" : "text-accent"}>
        {isOk ? "✓" : "✗"}
        {line.note ? ` ${line.note}` : ""}
      </span>
      {isLast ? <Caret /> : null}
    </p>
  );
}

/** Static block caret: it reads as a terminal without spending animation budget. */
function Caret() {
  return <span className="ml-1 inline-block h-3 w-1.5 translate-y-px bg-terminal-ink/70" />;
}
