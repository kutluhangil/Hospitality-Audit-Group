"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { mainNav, type NavLink } from "@/lib/site-config";

const FOCUSABLE_SELECTOR = "a[href], button:not([disabled])";

// The overlay lists every destination flat: a two-level tree is navigation
// furniture the small screen cannot afford, and the parent entry only duplicates
// its first child anyway.
const overlayLinks: readonly NavLink[] = mainNav.flatMap((item) =>
  item.children ? [...item.children] : [item],
);

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  // The overlay is stored as the route it was opened on rather than a boolean.
  // Any route change — a link inside it, browser back/forward — makes this
  // mismatch and closes the menu during render, with no effect to sync.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt !== null && openedAt === pathname;
  const reduceMotion = useReducedMotion();
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpenedAt(null);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    // The overlay covers the page; letting the document scroll underneath it
    // strands the user somewhere else once it closes.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  // Navigating to the current route leaves the pathname untouched, so that one
  // case still needs an explicit dismissal. Focus belongs to the page here, not
  // back on the hamburger.
  const dismissForNavigation = () => setOpenedAt(null);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Menüyü aç"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpenedAt(pathname)}
        className={[
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl2 border border-line",
          "text-ink transition-colors duration-150 hover:bg-bg-soft",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Menu size={18} aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Ana menü"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="flex items-center gap-2.5 text-ink">
              <Logo size={32} />
              <span className="font-serif text-lg font-semibold">HAG</span>
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Menüyü kapat"
              onClick={close}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl2 border border-line text-ink transition-colors duration-150 hover:bg-bg-soft"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <motion.nav
            aria-label="Ana menü"
            className="flex flex-1 flex-col gap-1 px-4 py-8"
            variants={reduceMotion ? undefined : listVariants}
            initial={reduceMotion ? undefined : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
          >
            {overlayLinks.map((link) => {
              const current = pathname === link.href;
              return (
                <motion.div key={link.href} variants={reduceMotion ? undefined : itemVariants}>
                  <Link
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    onClick={dismissForNavigation}
                    className={`block border-b border-line py-4 font-serif text-2xl transition-colors duration-150 ${
                      current ? "text-accent-strong" : "text-ink hover:text-accent-strong"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}

            <motion.div
              className="pt-8"
              variants={reduceMotion ? undefined : itemVariants}
            >
              <Button href="/moduller" size="lg" className="w-full" onClick={dismissForNavigation}>
                Teklif Alın
              </Button>
            </motion.div>
          </motion.nav>
        </div>
      )}
    </>
  );
}
