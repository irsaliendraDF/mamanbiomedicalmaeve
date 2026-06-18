"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/provider";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import type { Role } from "@/lib/supabase/types";

type Item = { href: string; label: string; icon: React.ReactNode };

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0"
    >
      <path d={d} />
    </svg>
  );
}

const icons = {
  home: "M3 11.5 12 4l9 7.5M5 10v10h14V10",
  portals: "M12 21s-7-4.35-7-10a7 7 0 0 1 14 0c0 5.65-7 10-7 10Z",
  partner: "M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm6 9a6 6 0 0 0-12 0M2 20a6 6 0 0 1 6-6",
  learn: "M12 6.5C10 4.5 6 4.5 4 6v13c2-1.5 6-1.5 8 0 2-1.5 6-1.5 8 0V6c-2-1.5-6-1.5-8 .5Z",
  account: "M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6.5 9a6.5 6.5 0 0 1 13 0",
  signout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
};

export function AppShell({
  children,
  name,
  role,
}: {
  children: React.ReactNode;
  name: string | null;
  role: Role;
}) {
  const t = useT();
  const pathname = usePathname();
  const router = useRouter();

  const base: Item[] = [
    { href: "/app", label: t.nav.home, icon: <Icon d={icons.home} /> },
    { href: "/app/portals", label: t.nav.portals, icon: <Icon d={icons.portals} /> },
    { href: "/app/partner", label: t.nav.partner, icon: <Icon d={icons.partner} /> },
    { href: "/app/learn", label: t.nav.learn, icon: <Icon d={icons.learn} /> },
    { href: "/app/account", label: t.nav.account, icon: <Icon d={icons.account} /> },
  ];
  // Partner role leads with Partner.
  const items =
    role === "partner"
      ? [base[0], base[2], base[1], base[3], base[4]]
      : base;

  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-dvh overflow-x-hidden bg-cream lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-white p-5 lg:flex">
        <Link href="/app" className="mb-8 px-2">
          <Logo />
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive(it.href)
                  ? "bg-blush-100 text-berry-600"
                  : "text-muted hover:bg-plum-50 hover:text-plum-700"
              }`}
            >
              {it.icon}
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line pt-4">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-plum-50 hover:text-berry-500"
          >
            <Icon d={icons.signout} />
            {t.nav.signOut}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar — language toggle pinned top right */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-cream/85 px-4 py-3 backdrop-blur lg:justify-end lg:px-8">
          <Link href="/app" className="lg:hidden">
            <Logo showBy={false} />
          </Link>
          <LanguageToggle />
        </header>

        <main className="flex-1 pb-24 lg:pb-10">
          <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
            {name && <p className="sr-only">{t.nav.dashboard}</p>}
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-line bg-white/95 px-1 py-1.5 backdrop-blur lg:hidden">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium transition ${
              isActive(it.href) ? "text-berry-500" : "text-faint"
            }`}
          >
            {it.icon}
            <span className="max-w-full truncate">{it.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
