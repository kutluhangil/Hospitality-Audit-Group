"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type LogLine =
  | { kind: "command" }
  | {
      kind: "check";
      id: string;
      time: string;
      status: "ok" | "fail";
      hasNote: boolean;
    }
  | { kind: "note"; id: string };

/**
 * The audit log from blueprint 2.1, kept as structured data rather than a
 * space-padded block: the columns are rebuilt with layout so the panel can
 * reflow on a narrow screen instead of scrolling sideways.
 *
 * Only the wording is language-dependent, so only the wording is looked up.
 * A timestamp is the same in every language, a ✓ is a ✓, and whether a finding
 * carries a note is a fact about the finding rather than about the reader — all
 * of that stays here. The text lives under `home.auditTerminal` in messages.
 */
const LOG_LINES: readonly LogLine[] = [
  { kind: "command" },
  {
    kind: "check",
    id: "checkin",
    time: "[14:02:11]",
    status: "ok",
    hasNote: true,
  },
  {
    kind: "check",
    id: "bellboy",
    time: "[14:06:32]",
    status: "ok",
    hasNote: false,
  },
  {
    kind: "check",
    id: "roomHygiene",
    time: "[14:41:05]",
    status: "fail",
    hasNote: true,
  },
  {
    kind: "check",
    id: "fnb",
    time: "[19:20:18]",
    status: "fail",
    hasNote: true,
  },
  {
    kind: "check",
    id: "upselling",
    time: "[21:05:44]",
    status: "fail",
    hasNote: true,
  },
  { kind: "note", id: "report" },
  { kind: "note", id: "leakage" },
];

const LINE_INTERVAL_MS = 600;
const HOLD_MS = 2600;
const FADE_MS = 700;

type Phase = { count: number; fading: boolean };

export function AuditTerminal() {
  const t = useTranslations("home.auditTerminal");
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>({ count: 0, fading: false });

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    // One timer per phase step; the effect re-runs on each state change and
    // schedules only the next hop, so unmounting always clears a live timer.
    if (phase.fading) {
      const timer = setTimeout(
        () => setPhase({ count: 0, fading: false }),
        FADE_MS,
      );
      return () => clearTimeout(timer);
    }

    if (phase.count < LOG_LINES.length) {
      const timer = setTimeout(
        () => setPhase((current) => ({ ...current, count: current.count + 1 })),
        LINE_INTERVAL_MS,
      );
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(
      () => setPhase((current) => ({ ...current, fading: true })),
      HOLD_MS,
    );
    return () => clearTimeout(timer);
  }, [phase, reduceMotion]);

  const visibleLines = reduceMotion
    ? LOG_LINES
    : LOG_LINES.slice(0, phase.count);

  return (
    <div
      role="img"
      // Read out as one coherent sentence: a looping log would otherwise stutter.
      aria-label={t("srLabel")}
      className="overflow-hidden rounded-xl2 border border-terminal-ink/10 bg-terminal-bg shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-terminal-ink/10 px-4 py-3">
        {/* Three brass dots rather than the macOS traffic lights — a nod to the star rating. */}
        <span
          className="h-2.5 w-2.5 rounded-full bg-brass"
          aria-hidden="true"
        />
        <span
          className="h-2.5 w-2.5 rounded-full bg-brass/60"
          aria-hidden="true"
        />
        <span
          className="h-2.5 w-2.5 rounded-full bg-brass/30"
          aria-hidden="true"
        />
        <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.18em] text-terminal-ink/50">
          audit-log
        </span>
      </div>

      {/*
        A container query, not a viewport one. The panel is roughly 420px wide
        even on a 1440px screen, so viewport breakpoints fire while the panel is
        still narrow and the columns wrap — which is exactly what an audit log
        must not do. @container makes the rows respond to the panel.
      */}
      <div
        aria-hidden="true"
        className="@container px-4 py-5 font-mono text-[11px] leading-relaxed text-terminal-ink sm:px-5 sm:text-xs"
      >
        <motion.div
          animate={{ opacity: phase.fading && !reduceMotion ? 0 : 1 }}
          transition={{
            duration: reduceMotion ? 0 : FADE_MS / 1000,
            ease: "easeOut",
          }}
        >
          {visibleLines.map((line, index) => (
            <LogRow
              key={rowKey(line)}
              line={line}
              animate={!reduceMotion}
              isLast={index === visibleLines.length - 1}
              startsNoteGroup={
                line.kind === "note" && visibleLines[index - 1]?.kind !== "note"
              }
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/** Stable across a language change, since none of these are the copy itself. */
function rowKey(line: LogLine): string {
  return line.kind === "command" ? "command" : `${line.kind}-${line.id}`;
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
    line.kind === "command"
      ? "mb-4"
      : startsNoteGroup
        ? "mt-4"
        : line.kind === "note"
          ? "mt-1"
          : "";
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
  const t = useTranslations("home.auditTerminal");

  if (line.kind === "command") {
    return (
      <p className="break-words text-terminal-ink">
        {t("command")}
        {isLast ? <Caret /> : null}
      </p>
    );
  }

  if (line.kind === "note") {
    return (
      <p className="break-words text-terminal-ink/70">
        {t(`notes.${line.id}`)}
        {isLast ? <Caret /> : null}
      </p>
    );
  }

  const isOk = line.status === "ok";

  /*
    28rem is measured, not guessed: the longest row needs 454px of the panel's
    478px of content box, so the columns fit from 448px up. Below that the row
    folds and the status indents under its own entry — still readable as a log.
    Either way the status glyph stays column-locked; a ✓ that drifts is the one
    thing this element cannot afford, since its whole job is to look measured.
  */
  return (
    <p className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 @[28rem]:grid-cols-[auto_6.5rem_1fr_auto]">
      <span className="text-terminal-ink/45">{line.time}</span>
      <span>{t(`lines.${line.id}.label`)}</span>
      <span className="col-start-2 text-terminal-ink/75 @[28rem]:col-start-auto">
        {t(`lines.${line.id}.detail`)}
      </span>
      {/* text-accent is legitimate here: 4.86:1 against the terminal panel. */}
      <span
        className={[
          "col-start-2 whitespace-nowrap @[28rem]:col-start-auto",
          isOk ? "text-terminal-ok" : "text-accent",
        ].join(" ")}
      >
        {isOk ? "✓" : "✗"}
        {line.hasNote ? ` ${t(`lines.${line.id}.note`)}` : ""}
        {isLast ? <Caret /> : null}
      </span>
    </p>
  );
}

/** Static block caret: it reads as a terminal without spending animation budget. */
function Caret() {
  return (
    <span className="ml-1 inline-block h-3 w-1.5 translate-y-px bg-terminal-ink/70" />
  );
}
