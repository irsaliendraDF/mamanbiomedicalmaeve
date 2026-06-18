"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/provider";
import { PORTALS, portalLabel } from "@/lib/portals";
import { PageHeader } from "@/components/app/PageHeader";

export function PortalsGrid() {
  const { t } = useLanguage();
  return (
    <div>
      <PageHeader title={t.portals.title} subtitle={t.portals.subtitle} />
      <div className="grid gap-4 sm:grid-cols-2">
        {PORTALS.map((p) => {
          const label = portalLabel(t, p.key);
          return (
            <Link key={p.key} href={`/app/portals/${p.key}`}>
              <div
                className="group h-full rounded-2xl border border-line p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
                style={{ backgroundColor: p.tint }}
              >
                <span className="text-3xl">{p.emoji}</span>
                <h2
                  className="mt-3 font-display text-2xl"
                  style={{ color: p.accent }}
                >
                  {label.title}
                </h2>
                <p className="mt-1 text-sm text-plum-700/70">{label.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
