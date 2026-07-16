import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { moduleIcons, modules, type ModuleCode } from "@/lib/modules-data";

type ModuleQuickLinksProps = {
  codes: readonly ModuleCode[];
};

/**
 * Selecting from the module list rather than looking each code up keeps the
 * result total — an unknown code simply cannot enter the grid.
 * The cards point at /moduller, where the quote cart lives.
 */
export function ModuleQuickLinks({ codes }: ModuleQuickLinksProps) {
  const t = useTranslations("catalogue");
  const tModules = useTranslations("modules");
  const selected = modules.filter((module) => codes.includes(module.code));

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {selected.map((module) => {
        const Icon = moduleIcons[module.icon];
        return (
          <li key={module.code}>
            <Link
              href="/moduller"
              className="flex h-full flex-col rounded-xl2 border border-line bg-surface p-6 transition-colors duration-150 hover:bg-bg-soft"
            >
              <Icon aria-hidden className="size-6 text-accent" />
              <span className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                {t("moduleLabel")} {module.code}
              </span>
              <span className="mt-2 font-serif text-lg">
                {tModules(`${module.code}.title`)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
