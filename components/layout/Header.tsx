"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";

import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { QuoteCartBadge } from "@/components/modules/QuoteCartBadge";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Link, usePathname } from "@/i18n/navigation";
import { mainNav, type NavLink } from "@/lib/site-config";

const linkBase =
  "relative flex items-center gap-1 rounded-xl2 px-3 py-2 text-sm transition-colors duration-150";

function linkClasses(active: boolean) {
  return `${linkBase} ${active ? "text-ink" : "text-ink-muted hover:text-ink"}`;
}

/** Decorative rule under the active entry — accent as line work, never as text. */
function ActiveRule() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-3 bottom-0 h-px bg-accent"
    />
  );
}

function NavDropdown({ item, pathname }: { item: NavLink; pathname: string }) {
  const t = useTranslations("nav");
  const children = item.children ?? [];
  const [open, setOpen] = useState(false);
  const groupRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const active = children.some((child) => child.href === pathname);

  function handleBlur(event: FocusEvent<HTMLLIElement>) {
    // Only collapse when focus leaves the group entirely — moving from the
    // trigger into its own menu must not close it.
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }

  function handleMouseLeave() {
    // The pointer leaving is no reason to yank the menu out from under a
    // keyboard user who is still inside it.
    if (groupRef.current?.contains(document.activeElement)) return;
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key !== "Escape" || !open) return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <li
      ref={groupRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setOpen(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((previous) => !previous)}
        className={linkClasses(active)}
      >
        {t(item.labelKey)}
        <ChevronDown size={14} className="text-accent" aria-hidden="true" />
        {active && <ActiveRule />}
      </button>

      {/* Kept mounted and hidden so aria-controls always resolves and the links
          leave the tab order only while the menu is collapsed. */}
      <ul
        id={menuId}
        hidden={!open}
        className="absolute left-0 top-full min-w-56 rounded-xl2 border border-line bg-surface p-2 shadow-lg shadow-ink/5"
      >
        {children.map((child) => {
          const current = child.href === pathname;
          return (
            <li key={child.href}>
              <Link
                href={child.href}
                aria-current={current ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`block rounded-xl2 px-3 py-2 text-sm transition-colors duration-150 ${
                  current
                    ? "text-ink"
                    : "text-ink-muted hover:bg-bg-soft hover:text-ink"
                }`}
              >
                {t(child.labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export function Header() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-ink">
          <Logo size={56} />
          <span className="font-serif text-lg font-semibold">
            <span className="sm:hidden">HAG</span>
            <span className="hidden sm:inline">Hospitality Audit Group</span>
          </span>
        </Link>

        <nav aria-label={tHeader("mainMenu")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              if (item.children) {
                return (
                  <NavDropdown
                    key={item.href}
                    item={item}
                    pathname={pathname}
                  />
                );
              }

              const current = item.href === pathname;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={linkClasses(current)}
                  >
                    {t(item.labelKey)}
                    {current && <ActiveRule />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Hidden on small screens: MobileNav carries the switcher there, at a
              touch target the header strip has no room for. */}
          <LocaleSwitcher className="hidden lg:block" />
          <ThemeToggle />
          <QuoteCartBadge />
          <Button href="/moduller" className="hidden lg:inline-flex">
            {tHeader("cta")}
          </Button>
          <MobileNav className="lg:hidden" />
        </div>
      </div>
    </header>
  );
}
